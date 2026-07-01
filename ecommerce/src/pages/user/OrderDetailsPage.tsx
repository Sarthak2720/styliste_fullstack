import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiList,
  FiMapPin,
  FiPackage,
  FiRotateCcw,
  FiTruck,
  FiXCircle,
  FiStar,
  FiImage,
  FiX,
  FiDownload,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import Navbar from '../../components/layout/Navbar';
import { orderApi } from '../../api/orderApi';
import reviewApi from '../../api/reviewApi';
import type { Order, ReturnRequest, ReturnTimelineEvent } from '../../types';
import { formatINR } from '../../utils/currency';

type TimelineStep = { key: string; label: string };
type CancelMode = 'FULL' | 'PARTIAL';

const RETURN_REASON_OPTIONS = [
  'Damaged product',
  'Wrong size',
  'Wrong product delivered',
  'Quality issue',
  'Not as described',
  'Other',
];

const RETURN_STATUSES = [
  'REQUESTED',
  'APPROVED',
  'PICKED_UP',
  'REFUND_INITIATED',
  'REFUNDED',
  'REJECTED',
] as const;
const RETURN_WINDOW_DAYS = 15;
const RETURN_STATUS_ALIASES: Record<string, string> = {
  RETURN_REQUESTED: 'REQUESTED',
  RETURN_APPROVED: 'APPROVED',
  RETURN_PICKED_UP: 'PICKED_UP',
  RETURN_REFUND_INITIATED: 'REFUND_INITIATED',
  RETURN_REFUNDED: 'REFUNDED',
  RETURN_REJECTED: 'REJECTED',
};

const timelineBaseSteps: TimelineStep[] = [
  { key: 'PENDING', label: 'Order Placed' },
  { key: 'PROCESSING', label: 'Order Confirmed' },
  { key: 'SHIPPED', label: 'Shipped' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { key: 'DELIVERED', label: 'Delivered' },
];

const timelineAltSteps: Record<string, TimelineStep[]> = {
  CANCELLED: [
    { key: 'PENDING', label: 'Order Placed' },
    { key: 'CANCELLED', label: 'Cancelled' },
  ],
  RETURNED: [
    { key: 'PENDING', label: 'Order Placed' },
    { key: 'PROCESSING', label: 'Order Confirmed' },
    { key: 'SHIPPED', label: 'Shipped' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { key: 'DELIVERED', label: 'Delivered' },
    { key: 'RETURNED', label: 'Returned' },
  ],
};

const timelineIcons: Record<string, (props: { size?: number }) => React.ReactNode> = {
  
  PENDING: FiClock,
  PROCESSING: FiPackage,
  SHIPPED: FiTruck,
  OUT_FOR_DELIVERY: FiMapPin,
  DELIVERED: FiCheckCircle,
  CANCELLED: FiXCircle,
  RETURNED: FiRotateCcw,
};

const getTimelineSteps = (status: string) =>
  timelineAltSteps[status] ?? timelineBaseSteps;

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-500/20 text-yellow-600',
    PROCESSING: 'bg-blue-500/20 text-blue-600',
    SHIPPED: 'bg-purple-500/20 text-purple-600',
    OUT_FOR_DELIVERY: 'bg-indigo-500/20 text-indigo-600',
    DELIVERED: 'bg-green-500/20 text-green-600',
    CANCELLED: 'bg-red-500/20 text-red-600',
    RETURNED: 'bg-gray-500/20 text-gray-600',
    CONFIRMED: 'bg-green-500/20 text-green-600',
    COMPLETED: 'bg-green-500/20 text-green-600',
  };
  return colors[status] || 'bg-dark-700 text-dark-300';
};

const getReturnStatusBadgeColor = (status: string) => {
  const colors: Record<string, string> = {
    REQUESTED: 'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-blue-100 text-blue-700',
    PICKED_UP: 'bg-purple-100 text-purple-700',
    REFUND_INITIATED: 'bg-amber-100 text-amber-700',
    REFUNDED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

const getReturnStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    REQUESTED: 'Return Requested',
    APPROVED: 'Return Approved',
    PICKED_UP: 'Picked Up',
    REFUND_INITIATED: 'Refund Processing',
    REFUNDED: 'Refund Completed',
    REJECTED: 'Return Rejected',
  };
  return labels[status] || status.replace(/_/g, ' ');
};

const getItemStatusBadgeColor = (status: string) => {
  const colors: Record<string, string> = {
    ACTIVE: 'bg-gray-100 text-gray-700',
    CANCELLED: 'bg-red-100 text-red-700',
    RETURNED: 'bg-orange-100 text-orange-700',
    RETURN_REQUESTED: 'bg-yellow-100 text-yellow-700',
    REQUESTED: 'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-blue-100 text-blue-700',
    PICKED_UP: 'bg-purple-100 text-purple-700',
    REFUND_INITIATED: 'bg-amber-100 text-amber-700',
    REFUNDED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

const normalizeStatusValue = (value?: string | null) =>
  (value || '').trim().toUpperCase();

const isCancelledStatus = (value?: string | null) => {
  const normalized = normalizeStatusValue(value);
  return normalized === 'CANCELLED' || normalized === 'CANCELED';
};

const normalizeItemName = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [timeline, setTimeline] = useState<
    { status: string; message: string; timestamp: string }[]
  >([]);
  const [reviewDrafts, setReviewDrafts] = useState<
    Record<string, { rating: number; title: string; body: string }>
  >({});
  const [reviewSubmitting, setReviewSubmitting] = useState<Record<string, boolean>>({});
  const [reviewAttachments, setReviewAttachments] = useState<
    Record<string, { images: File[]; videos: File[] }>
  >({});
  const [reviewIds, setReviewIds] = useState<Record<string, number>>({});
  const [reviewExistingImages, setReviewExistingImages] = useState<Record<string, string[]>>({});
  const [reviewImagesToDelete, setReviewImagesToDelete] = useState<Record<string, string[]>>(
    {}
  );
  const [reviewModal, setReviewModal] = useState<{
    item: Order['items'][number];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelMode, setCancelMode] = useState<CancelMode>('FULL');
  const [cancelReason, setCancelReason] = useState('');
  const [selectedCancelItemIds, setSelectedCancelItemIds] = useState<number[]>([]);
  const [cancelSubmitting, setCancelSubmitting] = useState(false);
  const [returnModal, setReturnModal] = useState<{
    item: Order['items'][number];
  } | null>(null);
  const [returnReason, setReturnReason] = useState('');
  const [returnQuantity, setReturnQuantity] = useState(1);
  const [returnProofFiles, setReturnProofFiles] = useState<File[]>([]);
  const [returnSubmitting, setReturnSubmitting] = useState(false);
  const [localReturnStatusByItemId, setLocalReturnStatusByItemId] = useState<
    Record<number, string>
  >({});
  const [serverReturnRequestByItemId, setServerReturnRequestByItemId] = useState<
    Record<number, ReturnRequest>
  >({});
  const [localReturnRequestIdByItemId, setLocalReturnRequestIdByItemId] = useState<
    Record<number, number>
  >({});
  const [returnTimelineModal, setReturnTimelineModal] = useState<{
    returnRequestId: number;
    itemName: string;
  } | null>(null);
  const [returnTimelineLoading, setReturnTimelineLoading] = useState(false);
  const [returnTimelineByRequestId, setReturnTimelineByRequestId] = useState<
    Record<number, ReturnTimelineEvent[]>
  >({});
  const IMAGE_BASE_URL = import.meta.env.VITE_API_IMG_URL || 'http://localhost:8090';

  const orderId = useMemo(() => (id ? Number(id) : NaN), [id]);

  const getOrderImageUrl = (path?: string) => {
    if (!path) return '/placeholder.jpg';
    if (path.startsWith('http') || path.startsWith('blob:')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${IMAGE_BASE_URL}${cleanPath}`;
  };

  useEffect(() => {
    if (!Number.isFinite(orderId)) {
      setError('Invalid order id');
      setLoading(false);
      return;
    }
    let active = true;
    const loadOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await orderApi.getOrderById(orderId);
        if (active) {
          setOrder(data);
          if (Array.isArray(data.timeline)) {
            setTimeline(data.timeline);
          }
        }
      } catch (err: any) {
        if (active) {
          setError(err?.message || 'Failed to load order details');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    loadOrder();
    return () => {
      active = false;
    };
  }, [orderId, reloadKey]);

  useEffect(() => {
    if (!Number.isFinite(orderId)) return;
    let active = true;
    const loadTimeline = async () => {
      setTimelineLoading(true);
      try {
        const data = await orderApi.getOrderTimeline(orderId);
        if (active) {
          setTimeline(data);
        }
      } catch {
        // Keep timeline from order payload if timeline endpoint fails.
      } finally {
        if (active) {
          setTimelineLoading(false);
        }
      }
    };
    loadTimeline();
    return () => {
      active = false;
    };
  }, [orderId, reloadKey]);

  const handleDownloadInvoice = async () => {
    if (!order) return;
    setDownloadingInvoice(true);
    try {
      const blob = await orderApi.downloadInvoice(order.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice-${order.orderNumber || order.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Invoice downloaded successfully');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to download invoice');
    } finally {
      setDownloadingInvoice(false);
    }
  };

  const isOrderCancellable = (status: string) =>
    status === 'PENDING' || status === 'PROCESSING';

  const getItemStatus = (item: Order['items'][number]) => {
    const statusSource = item as unknown as {
      itemStatus?: string;
      status?: string;
      orderItemStatus?: string;
    };
    return (
      normalizeStatusValue(
        statusSource.itemStatus || statusSource.status || statusSource.orderItemStatus
      ) || 'ACTIVE'
    );
  };

  const getItemReturnStatus = (item: Order['items'][number]) => {
    const localStatus = localReturnStatusByItemId[item.id];
    if (localStatus) return localStatus;
    const serverStatus = serverReturnRequestByItemId[item.id]?.status;
    if (serverStatus) {
      return RETURN_STATUS_ALIASES[serverStatus] || serverStatus;
    }

    const normalizeReturnStatus = (value?: string | null) => {
      const normalized = normalizeStatusValue(value);
      if (!normalized) return null;
      return RETURN_STATUS_ALIASES[normalized] || normalized;
    };

    const statusSource = item as unknown as {
      returnStatus?: string;
      return_request_status?: string;
    };
    const rawReturnStatus = normalizeReturnStatus(
      statusSource.returnStatus || statusSource.return_request_status
    );
    if (rawReturnStatus && RETURN_STATUSES.includes(rawReturnStatus as (typeof RETURN_STATUSES)[number])) {
      return rawReturnStatus;
    }

    const statusFromItem = normalizeReturnStatus(getItemStatus(item));
    if (RETURN_STATUSES.includes(statusFromItem as (typeof RETURN_STATUSES)[number])) {
      return statusFromItem;
    }

    return null;
  };

  const getItemReturnRequestId = (item: Order['items'][number]) => {
    const localId = localReturnRequestIdByItemId[item.id];
    if (Number.isFinite(localId) && localId > 0) return localId;
    const serverRequestId = Number(serverReturnRequestByItemId[item.id]?.id);
    if (Number.isFinite(serverRequestId) && serverRequestId > 0) return serverRequestId;

    const source = item as unknown as {
      returnRequestId?: number | string;
      returnId?: number | string;
      latestReturnRequestId?: number | string;
      returnRequest?: { id?: number | string };
    };
    const rawId =
      source.returnRequestId ||
      source.returnId ||
      source.latestReturnRequestId ||
      source.returnRequest?.id;
    const parsed = Number(rawId);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  };

  const getRemainingReturnQuantity = (item: Order['items'][number]) => {
    const parseNonNegativeInt = (value: unknown) => {
      const parsed = Number(value);
      if (!Number.isFinite(parsed) || parsed < 0) return null;
      return Math.floor(parsed);
    };

    const totalQtyRaw = parseNonNegativeInt(item.quantity);
    const totalQty = totalQtyRaw ?? 0;
    const capByTotalQuantity = (value: number) => {
      if (totalQty <= 0) return value;
      return Math.min(value, totalQty);
    };

    const serverRequest = serverReturnRequestByItemId[item.id];
    if (serverRequest) {
      const directServerValues = [
        serverRequest.remainingQuantity,
        serverRequest.returnableQuantity,
      ];
      for (const value of directServerValues) {
        const parsed = parseNonNegativeInt(value);
        if (parsed !== null) return capByTotalQuantity(parsed);
      }

      const returnedQty = parseNonNegativeInt(serverRequest.returnedQuantity) ?? 0;
      if (totalQty > 0) {
        return Math.max(0, totalQty - Math.min(returnedQty, totalQty));
      }
    }

    const source = item as unknown as {
      remainingQuantity?: number | string;
      remainingReturnQuantity?: number | string;
      returnableQuantity?: number | string;
      availableReturnQuantity?: number | string;
      returnedQuantity?: number | string;
      alreadyReturnedQuantity?: number | string;
    };

    const directValues = [
      source.remainingQuantity,
      source.remainingReturnQuantity,
      source.returnableQuantity,
      source.availableReturnQuantity,
    ];
    for (const value of directValues) {
      const parsed = parseNonNegativeInt(value);
      if (parsed !== null) return capByTotalQuantity(parsed);
    }
    if (totalQty <= 0) return 0;

    const returnedQty =
      parseNonNegativeInt(
        source.returnedQuantity || source.alreadyReturnedQuantity
      ) ?? 0;
    return Math.max(0, totalQty - Math.min(returnedQty, totalQty));
  };

  const orderItemIdsKey = useMemo(() => {
    if (!order?.items?.length) return '';
    return [...order.items]
      .map((item) => item.id)
      .sort((a, b) => a - b)
      .join(',');
  }, [order]);

  useEffect(() => {
    if (!order || !order.items?.length) {
      setServerReturnRequestByItemId({});
      return;
    }

    let active = true;
    const loadReturnRequestsForOrderItems = async () => {
      try {
        const requests = await orderApi.getMyReturnRequests();
        if (!active) return;

        const orderItemIds = new Set(order.items.map((item) => item.id));
        const relevant = requests
          .filter((req) => orderItemIds.has(req.orderItemId))
          .sort((a, b) => {
            const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
            const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
            if (Number.isNaN(aTime) || Number.isNaN(bTime)) return b.id - a.id;
            return bTime - aTime;
          });

        const mapped: Record<number, ReturnRequest> = {};
        relevant.forEach((request) => {
          if (!mapped[request.orderItemId]) {
            mapped[request.orderItemId] = request;
          }
        });

        setServerReturnRequestByItemId(mapped);
      } catch {
        if (!active) return;
        setServerReturnRequestByItemId({});
      }
    };

    loadReturnRequestsForOrderItems();
    return () => {
      active = false;
    };
  }, [order?.id, orderItemIdsKey, reloadKey]);

  const cancelledItemNamesFromTimeline = useMemo(() => {
    const cancelledNames: string[] = [];
    timeline.forEach((event) => {
      const message = (event.message || '').trim();
      if (!message || !/cancel/i.test(message)) return;

      const match = message.match(/items?\s+cancel(?:led|ed)\s*:\s*(.+)$/i);
      if (!match?.[1]) return;

      match[1]
        .split(/[|,]/)
        .map((name) => name.trim())
        .filter(Boolean)
        .forEach((name) => cancelledNames.push(name));
    });
    return cancelledNames.map(normalizeItemName).filter(Boolean);
  }, [timeline]);

  const isItemCancelled = (item: Order['items'][number]) => {
    if (isCancelledStatus(getItemStatus(item))) return true;

    const normalizedProductName = normalizeItemName(item.productName || '');
    if (!normalizedProductName) return false;

    return cancelledItemNamesFromTimeline.some(
      (cancelledName) =>
        cancelledName === normalizedProductName ||
        cancelledName.includes(normalizedProductName) ||
        normalizedProductName.includes(cancelledName)
    );
  };

  const getApiErrorMessage = (err: unknown, fallback: string) => {
    if (err && typeof err === 'object') {
      const possible = err as { message?: unknown; error?: unknown };
      if (typeof possible.message === 'string' && possible.message.trim()) {
        return possible.message;
      }
      if (typeof possible.error === 'string' && possible.error.trim()) {
        return possible.error;
      }
    }
    return fallback;
  };

  const toggleCancelItem = (orderItemId: number) => {
    setSelectedCancelItemIds((prev) =>
      prev.includes(orderItemId)
        ? prev.filter((idValue) => idValue !== orderItemId)
        : [...prev, orderItemId]
    );
  };

  const openCancelModal = () => {
    setCancelModalOpen(true);
    setCancelMode('FULL');
    setCancelReason('');
    setSelectedCancelItemIds([]);
  };

  const closeCancelModal = () => {
    if (cancelSubmitting) return;
    setCancelModalOpen(false);
    setCancelMode('FULL');
    setCancelReason('');
    setSelectedCancelItemIds([]);
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    if (!isOrderCancellable(order.status)) {
      toast.error("Order cannot be cancelled after it has been shipped");
      return;
    }

    const reason = cancelReason.trim();
    if (!reason) {
      toast.error('Please enter a cancellation reason');
      return;
    }

    if (cancelMode === 'PARTIAL' && selectedCancelItemIds.length === 0) {
      toast.error('Please select at least one item to cancel');
      return;
    }

    setCancelSubmitting(true);
    try {
      const response = await orderApi.cancelOrder(order.id, {
        reason,
        orderItemIds: cancelMode === 'PARTIAL' ? selectedCancelItemIds : undefined,
      });
      toast.success(response.message || 'Cancellation processed');
      closeCancelModal();
      setReloadKey((prev) => prev + 1);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to cancel order'));
    } finally {
      setCancelSubmitting(false);
    }
  };

  const deliveredEvent = useMemo(
    () => timeline.find((event) => event.status === 'DELIVERED'),
    [timeline]
  );
  const deliveredAt = useMemo(() => {
    if (!deliveredEvent?.timestamp) return null;
    const parsed = new Date(deliveredEvent.timestamp);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, [deliveredEvent]);
  const orderReturnWindowEndsAt = useMemo(() => {
    if (!order?.items?.length) return null;

    const itemLevelWindowEnds = order.items
      .map((item) => item.returnEligibleUntil || item.returnWindowEndsAt)
      .filter(Boolean)
      .map((value) => new Date(value as string))
      .filter((date) => !Number.isNaN(date.getTime()))
      .sort((a, b) => b.getTime() - a.getTime());

    if (itemLevelWindowEnds.length > 0) {
      return itemLevelWindowEnds[0];
    }

    if (!deliveredAt) return null;
    return new Date(
      deliveredAt.getTime() + RETURN_WINDOW_DAYS * 24 * 60 * 60 * 1000
    );
  }, [order?.items, deliveredAt]);
  const isReturnWindowExpired = useMemo(() => {
    if (!orderReturnWindowEndsAt) return false;
    return Date.now() > orderReturnWindowEndsAt.getTime();
  }, [orderReturnWindowEndsAt]);

  const canReturnItem = (item: Order['items'][number]) => {
    if (!order || order.status !== 'DELIVERED') return false;
    if (isReturnWindowExpired) return false;
    if (isItemCancelled(item)) return false;
    if (getRemainingReturnQuantity(item) <= 0) return false;

    const status = getItemStatus(item);
    if (status !== 'ACTIVE') return false;

    return !getItemReturnStatus(item);
  };

  const openReturnModal = (item: Order['items'][number]) => {
    const remainingQty = getRemainingReturnQuantity(item);
    setReturnModal({ item });
    setReturnReason('');
    setReturnQuantity(remainingQty > 0 ? 1 : 0);
    setReturnProofFiles([]);
  };

  const closeReturnModal = () => {
    if (returnSubmitting) return;
    setReturnModal(null);
    setReturnReason('');
    setReturnQuantity(1);
    setReturnProofFiles([]);
  };

  const openReturnTimelineModal = (returnRequestId: number, itemName: string) => {
    setReturnTimelineModal({ returnRequestId, itemName });
  };

  const closeReturnTimelineModal = () => {
    setReturnTimelineModal(null);
    setReturnTimelineLoading(false);
  };

  useEffect(() => {
    const requestId = returnTimelineModal?.returnRequestId;
    if (!requestId) return;
    if (returnTimelineByRequestId[requestId]) return;

    let active = true;
    const loadReturnTimeline = async () => {
      setReturnTimelineLoading(true);
      try {
        const data = await orderApi.getReturnTimeline(requestId);
        if (active) {
          setReturnTimelineByRequestId((prev) => ({ ...prev, [requestId]: data }));
        }
      } catch (error: unknown) {
        if (active) {
          toast.error(getApiErrorMessage(error, 'Failed to load return timeline'));
          setReturnTimelineByRequestId((prev) => ({ ...prev, [requestId]: [] }));
        }
      } finally {
        if (active) {
          setReturnTimelineLoading(false);
        }
      }
    };

    loadReturnTimeline();
    return () => {
      active = false;
    };
  }, [returnTimelineModal, returnTimelineByRequestId]);

  const handleSubmitReturnRequest = async () => {
    if (!returnModal) return;
    if (!canReturnItem(returnModal.item)) {
      toast.error("This item is not eligible for return");
      return;
    }
    const normalizedReason = returnReason.trim();
    if (!normalizedReason) {
      toast.error('Please select a return reason');
      return;
    }

    const maxQty = getRemainingReturnQuantity(returnModal.item);
    if (maxQty <= 0) {
      toast.error('No returnable quantity remaining for this item');
      return;
    }

    const parsedInputQuantity = Number(returnQuantity);
    if (!Number.isFinite(parsedInputQuantity) || parsedInputQuantity < 1) {
      toast.error('Please enter a valid return quantity');
      return;
    }

    const requestedQuantity = Math.floor(parsedInputQuantity);
    if (requestedQuantity > maxQty) {
      toast.error(`You can return at most ${maxQty} item(s) for this product`);
      return;
    }

    setReturnSubmitting(true);
    try {
      const response = await orderApi.createReturnRequest({
        orderItemId: returnModal.item.id,
        quantity: requestedQuantity,
        reason: normalizedReason,
        proofImages: returnProofFiles,
      });

      setLocalReturnStatusByItemId((prev) => ({
        ...prev,
        [returnModal.item.id]: response.status || 'REQUESTED',
      }));
      if (response.id) {
        setLocalReturnRequestIdByItemId((prev) => ({
          ...prev,
          [returnModal.item.id]: response.id,
        }));
      }
      toast.success('Return request submitted successfully');
      closeReturnModal();
      setReloadKey((prev) => prev + 1);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to submit return request'));
    } finally {
      setReturnSubmitting(false);
    }
  };

  const firstItem = order?.items?.[0];
  const orderDate = order?.createdAt ? new Date(order.createdAt) : null;
  const dateLabel =
    orderDate && !Number.isNaN(orderDate.getTime())
      ? format(orderDate, 'MMMM dd, yyyy')
      : '—';
  const displayOrderId = order?.orderNumber ? String(order.orderNumber) : String(order?.id ?? '');
  const orderLabel = displayOrderId.startsWith('ORD-') ? displayOrderId : `ORD-${displayOrderId}`;

  const timelineSteps = order ? getTimelineSteps(order.status) : timelineBaseSteps;
  const currentIndex = order
    ? Math.max(0, timelineSteps.findIndex((step) => step.key === order.status))
    : 0;
  const eventMap = new Map(timeline.map((event) => [event.status, event]));
  const activeReturnTimelineEvents = useMemo(() => {
    if (!returnTimelineModal) return [];
    const data = returnTimelineByRequestId[returnTimelineModal.returnRequestId] || [];
    return [...data].sort((a, b) => {
      const aTime = new Date(a.timestamp).getTime();
      const bTime = new Date(b.timestamp).getTime();
      if (Number.isNaN(aTime) || Number.isNaN(bTime)) return 0;
      return aTime - bTime;
    });
  }, [returnTimelineModal, returnTimelineByRequestId]);

  const getReviewKey = (orderIdValue: number, productId: number) =>
    `${orderIdValue}-${productId}`;
  const getReviewDraft = (key: string) =>
    reviewDrafts[key] || { rating: 0, title: '', body: '' };
  const getReviewAttachments = (key: string) =>
    reviewAttachments[key] || { images: [], videos: [] };
  const getReviewId = (key: string) => reviewIds[key];
  const getReviewExistingImages = (key: string) => reviewExistingImages[key] || [];
  const getReviewImagesToDelete = (key: string) => reviewImagesToDelete[key] || [];

  const mapExistingReviewImages = (review: {
    imageUrls?: string[];
    media?: { id: number; url: string; mediaType: 'IMAGE' | 'VIDEO' }[];
  }) => {
    const imageUrls =
      review.imageUrls && review.imageUrls.length > 0
        ? review.imageUrls
        : (review.media || [])
            .filter((m) => m.mediaType === 'IMAGE')
            .map((m) => m.url);

    return imageUrls;
  };

  const updateReviewDraft = (
    key: string,
    patch: Partial<{ rating: number; title: string; body: string }>
  ) => {
    setReviewDrafts((prev) => ({
      ...prev,
      [key]: { ...getReviewDraft(key), ...patch },
    }));
  };

  const updateReviewAttachments = (
    key: string,
    type: 'images' | 'videos',
    files: FileList | File[]
  ) => {
    const list = Array.isArray(files) ? files : Array.from(files);
    setReviewAttachments((prev) => {
      const current = getReviewAttachments(key);
      return {
        ...prev,
        [key]: { ...current, [type]: [...current[type], ...list] },
      };
    });
  };

  const removeReviewAttachment = (
    key: string,
    type: 'images' | 'videos',
    index: number
  ) => {
    setReviewAttachments((prev) => {
      const current = getReviewAttachments(key);
      return {
        ...prev,
        [key]: {
          ...current,
          [type]: current[type].filter((_, idx) => idx !== index),
        },
      };
    });
  };

  const removeExistingReviewImage = (key: string, index: number) => {
    const current = getReviewExistingImages(key);
    const targetUrl = current[index];

    setReviewExistingImages((prev) => ({
      ...prev,
      [key]: (prev[key] || []).filter((_, idx) => idx !== index),
    }));

    if (targetUrl) {
      setReviewImagesToDelete((prev) => ({
        ...prev,
        [key]: Array.from(new Set([...(prev[key] || []), targetUrl])),
      }));
    }
  };

  const fetchExistingReview = async (
    productId: number,
    userId: number,
    orderIdValue: number,
    knownReviewId?: number
  ) => {
    try {
      const data = await reviewApi.getProductReviews(productId, 0, 200);
      const reviews = data.content || [];
      if (knownReviewId) {
        const byId = reviews.find((review) => review.id === knownReviewId);
        if (byId) return byId;
      }
      return (
        reviews.find(
          (review) =>
            review.userId === userId &&
            (!review.orderId || review.orderId === orderIdValue)
        ) || null
      );
    } catch {
      return null;
    }
  };

  const openReviewModal = async (item: Order['items'][number]) => {
    if (!order) return;
    const key = getReviewKey(order.id, item.productId);
    if (!reviewDrafts[key]) {
      setReviewDrafts((prev) => ({
        ...prev,
        [key]: { rating: 0, title: '', body: '' },
      }));
    }
    setReviewAttachments((prev) => ({
      ...prev,
      [key]: { images: [], videos: [] },
    }));
    if (item.reviewId && !reviewIds[key]) {
      setReviewIds((prev) => ({ ...prev, [key]: item.reviewId! }));
    }
    setReviewModal({ item });

    const existing = await fetchExistingReview(
      item.productId,
      order.userId,
      order.id,
      item.reviewId || getReviewId(key)
    );
    if (existing) {
      setReviewIds((prev) => ({ ...prev, [key]: existing.id }));
      setReviewExistingImages((prev) => ({
        ...prev,
        [key]: mapExistingReviewImages(existing),
      }));
      setReviewImagesToDelete((prev) => ({ ...prev, [key]: [] }));
      setReviewDrafts((prev) => ({
        ...prev,
        [key]: {
          rating: existing.rating || 0,
          title: existing.title || '',
          body: existing.body || '',
        },
      }));
    } else {
      setReviewExistingImages((prev) => ({ ...prev, [key]: [] }));
      setReviewImagesToDelete((prev) => ({ ...prev, [key]: [] }));
    }
  };

  const closeReviewModal = () => {
    setReviewModal(null);
  };

  const handleSubmitReview = async (item: Order['items'][number]) => {
    if (!order) return;
    const key = getReviewKey(order.id, item.productId);
    const draft = getReviewDraft(key);
    if (!draft.rating || draft.rating < 1) {
      return;
    }
    if (!draft.body.trim()) {
      return;
    }

    setReviewSubmitting((prev) => ({ ...prev, [key]: true }));
    try {
      const attachments = getReviewAttachments(key);
      const imagesToDelete = getReviewImagesToDelete(key);
      let existingId = getReviewId(key);
      if (!existingId) {
        const existing = await fetchExistingReview(
          item.productId,
          order.userId,
          order.id,
          item.reviewId
        );
        if (existing) {
          existingId = existing.id;
          setReviewIds((prev) => ({ ...prev, [key]: existing.id }));
        }
      }

      let persistedReviewId: number | null = null;
      let persistedImages: string[] = [];
      if (existingId) {
        const updated = await reviewApi.updateReview(
          existingId,
          {
            rating: draft.rating,
            title: draft.title.trim() || item.productName || 'Review',
            body: draft.body.trim(),
            imagesToDelete,
            videosToDelete: [],
          },
          attachments.images,
          attachments.videos
        );
        persistedReviewId = updated.id;
        persistedImages = mapExistingReviewImages(updated);
      } else {
        const created = await reviewApi.createReview(
          {
            productId: item.productId,
            orderId: order.id,
            rating: draft.rating,
            title: draft.title.trim() || item.productName || 'Review',
            body: draft.body.trim(),
          },
          attachments.images,
          attachments.videos
        );
        persistedReviewId = created.id;
        persistedImages = mapExistingReviewImages(created);
      }

      if (persistedReviewId) {
        setReviewIds((prev) => ({ ...prev, [key]: persistedReviewId as number }));
      }
      if (persistedImages.length === 0) {
        const refreshed = await fetchExistingReview(
          item.productId,
          order.userId,
          order.id,
          persistedReviewId || existingId || item.reviewId
        );
        persistedImages = refreshed ? mapExistingReviewImages(refreshed) : [];
      }
      setReviewExistingImages((prev) => ({
        ...prev,
        [key]: persistedImages,
      }));
      setReviewImagesToDelete((prev) => ({ ...prev, [key]: [] }));
      setReviewDrafts((prev) => ({
        ...prev,
        [key]: {
          rating: draft.rating,
          title: draft.title,
          body: draft.body,
        },
      }));
      setReviewAttachments((prev) => ({
        ...prev,
        [key]: { images: [], videos: [] },
      }));
      setReviewModal(null);
    } finally {
      setReviewSubmitting((prev) => ({ ...prev, [key]: false }));
    }
  };

  useEffect(() => {
    const isModalOpen =
      reviewModal !== null ||
      cancelModalOpen ||
      returnModal !== null ||
      returnTimelineModal !== null;
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [reviewModal, cancelModalOpen, returnModal, returnTimelineModal]);

  useEffect(() => {
    if (!order || order.status !== 'DELIVERED') return;
    let active = true;
    const loadExistingReviews = async () => {
      const updates: Record<string, number> = {};
      const drafts: Record<string, { rating: number; title: string; body: string }> = {};
      const existingImages: Record<string, string[]> = {};

      await Promise.all(
        order.items.map(async (item) => {
          const key = getReviewKey(order.id, item.productId);
          if (reviewIds[key]) return;
          const existing = await fetchExistingReview(
            item.productId,
            order.userId,
            order.id,
            item.reviewId
          );
          if (existing) {
            updates[key] = existing.id;
            existingImages[key] = mapExistingReviewImages(existing);
            if (!reviewDrafts[key]) {
              drafts[key] = {
                rating: existing.rating,
                title: existing.title || '',
                body: existing.body || '',
              };
            }
          }
        })
      );

      if (!active) return;
      if (Object.keys(updates).length) {
        setReviewIds((prev) => ({ ...prev, ...updates }));
      }
      if (Object.keys(existingImages).length) {
        setReviewExistingImages((prev) => ({ ...prev, ...existingImages }));
      }
      if (Object.keys(drafts).length) {
        setReviewDrafts((prev) => ({ ...prev, ...drafts }));
      }
    };

    loadExistingReviews();
    return () => {
      active = false;
    };
  }, [order?.id, order?.status]);

  return (
    <div className="min-h-screen bg-[#F6F4EC] text-dark-900">
      <Navbar />
      <div className="mx-auto w-full max-w-5xl px-4 py-8 space-y-6">
        <button
          type="button"
          onClick={() => navigate('/dashboard', { state: { tab: 'orders' } })}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B7D60] hover:underline"
        >
          <FiArrowLeft size={16} />
          Back to Orders
        </button>

        {loading && <p className="text-sm text-dark-500">Loading order details...</p>}
        {!loading && error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && !error && order && (
          <>
            <div className="rounded-2xl border border-[#E6E2D6] bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl bg-[#F2F0E8] overflow-hidden flex items-center justify-center">
                    <img
                      src={getOrderImageUrl(firstItem?.productImage)}
                      alt={firstItem?.productName || 'Order item'}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-dark-700">{orderLabel}</span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-dark-900">
                      {firstItem?.productName || 'Order items'}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-dark-500">
                      <span>{dateLabel}</span>
                      <span className="font-semibold text-dark-700">
                        {formatINR(order.totalAmount)}
                      </span>
                    </div>
                    <p className="text-xs text-dark-500">
                      Size: {firstItem?.selectedSize || '—'} · Color:{' '}
                      {firstItem?.selectedColor || '—'} · Qty:{' '}
                      {firstItem?.quantity ?? '—'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isOrderCancellable(order.status) && (
                    <button
                      type="button"
                      onClick={openCancelModal}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                    >
                      <FiXCircle size={16} />
                      Cancel Order
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleDownloadInvoice}
                    disabled={downloadingInvoice}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#E6E2D6] bg-white px-4 py-2 text-sm font-semibold text-[#6B7D60] hover:bg-[#F6F4EC] disabled:opacity-60"
                    title="Download Invoice (PDF)"
                  >
                    <FiDownload size={16} />
                    {downloadingInvoice ? 'Downloading...' : 'Download Invoice'}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
                <div className="rounded-2xl border border-[#E6E2D6] bg-white p-5">
                  <p className="text-xs text-dark-500">CURRENT STATUS</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    {order.trackingNumber && (
                      <span className="text-xs text-dark-500">
                        Tracking: {order.trackingNumber}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                  <div className="rounded-xl border border-[#E6E2D6] bg-white p-4 h-full min-h-[220px]">
                    <p className="text-xs font-semibold tracking-widest text-dark-500">
                      ABOUT PRODUCT
                    </p>
                    <p className="mt-2 text-xs text-dark-500">
                      Size: {firstItem?.selectedSize || '—'} · Color:{' '}
                      {firstItem?.selectedColor || '—'} · Qty:{' '}
                      {firstItem?.quantity ?? '—'}
                    </p>
                    <p className="mt-4 text-xs font-semibold tracking-widest text-dark-500">
                      SHIPPING ADDRESS
                    </p>
                    <p className="mt-2 text-sm text-dark-700 whitespace-pre-line">
                      {order.shippingAddress}
                    </p>
                    <p className="mt-2 text-xs text-dark-500">
                      Phone: {order.userPhone || '—'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#E6E2D6] bg-white p-4 h-full min-h-[220px]">
                    <p className="text-xs font-semibold tracking-widest text-dark-500">
                      ORDER SUMMARY
                    </p>
                    {(() => {
                      // const orderTax = Number(order.tax || 0);
                      const orderDiscount = Number(order.discount || 0);
                      const orderTotal = Number(order.totalAmount || 0);
                      const rawSubtotal = orderTotal + orderDiscount;
                      const subtotal = Number.isFinite(rawSubtotal) ? rawSubtotal : orderTotal;
                      const rawPaymentMode =
                        (order as any).paymentMethod ||
                        (order as any).paymentMode ||
                        (order as any).paymentType;
                      const paymentMode = rawPaymentMode
                        ? String(rawPaymentMode).replace(/_/g, ' ')
                        : 'Online';
                      return (
                        <div className="mt-3 space-y-2 text-sm text-dark-600">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatINR(subtotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="text-[#6B7D60]">
                              {order.shippingCharges !== undefined && order.shippingCharges !== null
                                ? formatINR(order.shippingCharges)
                                : 'Free'}
                            </span>
                          </div>
                          <div className="border-t border-[#E6E2D6] pt-2 flex justify-between font-semibold text-dark-900">
                            <span>Total</span>
                            <span>{formatINR(orderTotal)}</span>
                          </div>
                          <div className="text-xs text-dark-500">
                            Payment Mode: {paymentMode}
                          </div>
                          <div className="text-xs text-dark-500">
                            Payment Status: {order.paymentStatus.replace(/_/g, ' ')}
                          </div>
                          {order.transactionId && (
                            <div className="mt-2 pt-2 border-t border-[#E6E2D6] text-xs text-dark-500">
                              <p className="font-semibold text-dark-700">
                                Ref ID: {order.transactionId === 'COD_PENDING' ? 'Pay on Delivery' : order.transactionId}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {order.items.some((item) => !!getItemReturnStatus(item)) && (
                  <div className="rounded-2xl border border-[#E6E2D6] bg-white p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-xs font-semibold tracking-widest text-dark-500">
                        RETURN REQUESTS
                      </h3>
                      <span className="text-xs text-dark-500">
                        Separate from order delivery timeline
                      </span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {order.items
                        .filter((item) => !!getItemReturnStatus(item))
                        .map((item) => {
                          const returnStatus = getItemReturnStatus(item) as string;
                          const returnRequestId = getItemReturnRequestId(item);
                          const remainingReturnQty = getRemainingReturnQuantity(item);
                          return (
                            <div
                              key={`return-summary-${item.id}`}
                              className="rounded-xl border border-[#E6E2D6] bg-white p-4"
                            >
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-semibold text-dark-900">
                                    {item.productName}
                                  </p>
                                  <p className="text-xs text-dark-500 mt-1">
                                    Qty: {item.quantity} · Returnable Qty: {remainingReturnQty}
                                  </p>
                                  {returnRequestId && (
                                    <p className="text-xs text-dark-500 mt-1">
                                      Return ID: #{returnRequestId}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${getReturnStatusBadgeColor(
                                      returnStatus
                                    )}`}
                                  >
                                    {getReturnStatusLabel(returnStatus)}
                                  </span>
                                  {returnRequestId && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        openReturnTimelineModal(returnRequestId, item.productName)
                                      }
                                      className="px-3 py-1.5 rounded-lg border border-[#DCD7C6] bg-white text-dark-700 text-xs font-semibold hover:bg-[#F9F8F4] transition-colors inline-flex items-center gap-1"
                                    >
                                      <FiList size={13} />
                                      View Timeline
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-[#E6E2D6] bg-white p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xs font-semibold tracking-widest text-dark-500">
                      ORDER ITEMS
                    </h3>
                    {order.status === 'DELIVERED' && (
                      <span className="text-xs text-dark-500">
                        Return window: {isReturnWindowExpired ? 'Expired' : 'Open'}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-3">
                    {order.items.map((item) => {
                      const returnStatus = getItemReturnStatus(item);
                      const itemStatus = getItemStatus(item);
                      const itemCancelled = isItemCancelled(item);
                      const displayItemStatus = itemCancelled ? 'CANCELLED' : itemStatus;
                      const returnRequestId = getItemReturnRequestId(item);
                      const remainingReturnQty = getRemainingReturnQuantity(item);
                      const isItemReturnable = canReturnItem(item);
                      const showReturnWindowExpiredMessage =
                        order.status === 'DELIVERED' &&
                        !returnStatus &&
                        displayItemStatus === 'ACTIVE' &&
                        isReturnWindowExpired;
                      const showNoRemainingQtyMessage =
                        order.status === 'DELIVERED' &&
                        !returnStatus &&
                        displayItemStatus === 'ACTIVE' &&
                        remainingReturnQty <= 0;

                      return (
                        <div
                          key={item.id}
                          className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#E6E2D6] bg-white p-4"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="h-14 w-14 rounded-xl bg-[#F2F0E8] overflow-hidden flex items-center justify-center">
                              <img
                                src={getOrderImageUrl(item.productImage)}
                                alt={item.productName}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-dark-900 truncate">
                                {item.productName}
                              </p>
                              <p className="text-xs text-dark-500 mt-1">
                                Qty: {item.quantity}
                                {item.selectedSize ? ` · Size: ${item.selectedSize}` : ''}
                                {item.selectedColor ? ` · Color: ${item.selectedColor}` : ''}
                              </p>
                              {order.status === 'DELIVERED' && !itemCancelled && (
                                <p className="text-[11px] text-dark-500 mt-1">
                                  Returnable Qty: {remainingReturnQty}
                                </p>
                              )}
                              {displayItemStatus !== 'ACTIVE' && !returnStatus && (
                                <span
                                  className={`inline-flex mt-2 px-2 py-0.5 rounded-full text-[11px] font-semibold ${getItemStatusBadgeColor(displayItemStatus)}`}
                                >
                                  {displayItemStatus.replace(/_/g, ' ')}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {!returnStatus && isCancelledStatus(displayItemStatus) && (
                              <span
                                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${getItemStatusBadgeColor(displayItemStatus)}`}
                              >
                                Cancelled
                              </span>
                            )}
                            {returnStatus && (
                              <span
                                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${getReturnStatusBadgeColor(returnStatus)}`}
                              >
                                {getReturnStatusLabel(returnStatus)}
                              </span>
                            )}
                            {returnStatus && returnRequestId && (
                              <button
                                type="button"
                                onClick={() =>
                                  openReturnTimelineModal(returnRequestId, item.productName)
                                }
                                className="px-3 py-1.5 rounded-lg border border-[#DCD7C6] bg-white text-dark-700 text-xs font-semibold hover:bg-[#F9F8F4] transition-colors inline-flex items-center gap-1"
                              >
                                <FiList size={13} />
                                Return Timeline
                              </button>
                            )}
                            {returnStatus && !returnRequestId && (
                              <span className="text-[11px] text-dark-500">
                                Return timeline not available yet
                              </span>
                            )}
                            {isItemReturnable && (
                              <button
                                type="button"
                                onClick={() => openReturnModal(item)}
                                className="px-3 py-1.5 rounded-lg border border-[#C9D8C1] bg-[#EAF4E5] text-[#4F6A45] text-xs font-semibold hover:bg-[#DDECD5] transition-colors"
                              >
                                Return Item
                              </button>
                            )}
                            {showReturnWindowExpiredMessage && (
                              <span className="text-xs text-red-500 font-medium">
                                Return window expired
                              </span>
                            )}
                            {showNoRemainingQtyMessage && (
                              <span className="text-xs text-dark-500 font-medium">
                                No returnable quantity left
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E6E2D6] bg-white p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold tracking-widest text-dark-500">
                      ORDER TIMELINE
                    </h3>
                    {timelineLoading && (
                      <span className="text-xs text-dark-400">Loading...</span>
                    )}
                  </div>
                  <ol className="mt-4 space-y-6">
                    {timelineSteps.map((step, index) => {
                      const event = eventMap.get(step.key);
                      const eventDate = event ? new Date(event.timestamp) : null;
                      const isValid = !!eventDate && !Number.isNaN(eventDate.getTime());
                      const timeLabel = event
                        ? isValid
                          ? format(eventDate as Date, 'dd MMM yyyy, hh:mm a')
                          : event?.timestamp
                        : index < currentIndex
                        ? 'Completed'
                        : index === currentIndex
                        ? 'In progress'
                        : 'Pending';
                      const isDone = index <= currentIndex;
                      const isLineActive = index < currentIndex;
                      const isLast = index === timelineSteps.length - 1;
                      const Icon = timelineIcons[step.key] || FiPackage;
                      return (
                        <li key={step.key} className="relative pl-10">
                          {!isLast && (
                            <span
                              className={`absolute left-[11px] top-6 h-full w-0.5 ${
                                isLineActive ? 'bg-[#6B7D60]' : 'bg-[#D8D4C7]'
                              }`}
                            />
                          )}
                          <span
                            className={`absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full border ${
                              isDone
                                ? 'bg-[#E6EFE2] border-[#6B7D60] text-[#6B7D60]'
                                : 'bg-white border-[#D8D4C7] text-dark-400'
                            }`}
                          >
                            <Icon size={14} />
                          </span>
                          <div>
                            <p
                              className={`text-sm font-semibold ${
                                isDone ? 'text-dark-900' : 'text-dark-400'
                              }`}
                            >
                              {step.label}
                            </p>
                            <p
                              className={`text-xs ${
                                isDone ? 'text-dark-500' : 'text-dark-400'
                              }`}
                            >
                              {timeLabel}
                            </p>
                            {event?.message && (
                              <p className="text-xs text-dark-600 mt-1">{event.message}</p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
                {order.status === 'DELIVERED' && order.items.length > 0 && (
                  <div className="rounded-2xl border border-[#E6E2D6] bg-white p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xs font-semibold tracking-widest text-dark-500">
                          RATE & REVIEW PRODUCTS
                        </h3>
                        <p className="text-xs text-dark-400 mt-1">
                          Share feedback for each item you received.
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {order.items.map((item) => {
                        const key = getReviewKey(order.id, item.productId);
                        const existingReviewId = getReviewId(key);
                        const cancelledItem = isItemCancelled(item);
                        return (
                          <div
                            key={item.id}
                            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#E6E2D6] bg-white p-4"
                          >
                            <div className="flex items-center gap-4">
                              <div className="h-14 w-14 rounded-xl bg-[#F2F0E8] overflow-hidden flex items-center justify-center">
                                <img
                                  src={getOrderImageUrl(item.productImage)}
                                  alt={item.productName}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-dark-900">
                                  {item.productName}
                                </p>
                                <p className="text-xs text-dark-500 mt-1">
                                  Qty: {item.quantity}
                                  {item.selectedSize ? ` · Size: ${item.selectedSize}` : ''}
                                  {item.selectedColor ? ` · Color: ${item.selectedColor}` : ''}
                                </p>
                              </div>
                            </div>
                            {cancelledItem ? (
                              <span className="text-xs font-semibold text-red-600">
                                This item was cancelled
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => openReviewModal(item)}
                                className="btn-primary px-4"
                              >
                                {existingReviewId ? 'Edit Review' : 'Write Review'}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
            </div>
          </>
        )}
      </div>

      {cancelModalOpen && order && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl border border-[#E6E2D6] p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-dark-900">Cancel Order</h3>
              <button
                type="button"
                onClick={closeCancelModal}
                className="text-dark-500 hover:text-dark-700"
                disabled={cancelSubmitting}
              >
                &times;
              </button>
            </div>
            <p className="mt-1 text-sm text-dark-500">
              Order #{order.orderNumber || order.id}
            </p>

            <div className="mt-4">
              <p className="text-sm font-semibold text-dark-700">Cancellation Type</p>
              <div className="mt-2 flex flex-wrap gap-3">
                <label className="flex items-center gap-2 text-sm text-dark-600">
                  <input
                    type="radio"
                    checked={cancelMode === 'FULL'}
                    onChange={() => {
                      setCancelMode('FULL');
                      setSelectedCancelItemIds([]);
                    }}
                    className="accent-[#6B7D60]"
                  />
                  Full Order
                </label>
                <label className="flex items-center gap-2 text-sm text-dark-600">
                  <input
                    type="radio"
                    checked={cancelMode === 'PARTIAL'}
                    onChange={() => setCancelMode('PARTIAL')}
                    className="accent-[#6B7D60]"
                  />
                  Specific Items
                </label>
              </div>
            </div>

            {cancelMode === 'PARTIAL' && (
              <div className="mt-4 max-h-56 overflow-y-auto rounded-xl border border-[#E6E2D6] p-3 space-y-2">
                {(order.items || [])
                  .filter((item) => !isItemCancelled(item))
                  .map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-[#E6E2D6] px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-dark-900 truncate">
                          {item.productName}
                        </p>
                        <p className="text-xs text-dark-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedCancelItemIds.includes(item.id)}
                        onChange={() => toggleCancelItem(item.id)}
                        className="accent-[#6B7D60]"
                      />
                    </label>
                  ))}
              </div>
            )}

            <div className="mt-4">
              <label className="text-sm font-semibold text-dark-700">Reason</label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason for cancellation"
                className="mt-2 input-field resize-none"
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={closeCancelModal}
                className="btn-ghost"
                disabled={cancelSubmitting}
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleCancelOrder}
                className="btn-primary disabled:opacity-60"
                disabled={cancelSubmitting}
              >
                {cancelSubmitting ? 'Processing...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {returnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl border border-[#E6E2D6] p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-dark-900">Return Item</h3>
              <button
                type="button"
                onClick={closeReturnModal}
                className="text-dark-500 hover:text-dark-700"
                disabled={returnSubmitting}
              >
                &times;
              </button>
            </div>
            <p className="mt-1 text-sm text-dark-500">{returnModal.item.productName}</p>
            <p className="mt-1 text-xs text-dark-500">
              Remaining returnable quantity: {getRemainingReturnQuantity(returnModal.item)}
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-dark-700">Reason</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="mt-2 input-field"
                >
                  <option value="">Select reason</option>
                  {RETURN_REASON_OPTIONS.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-dark-700">Quantity</label>
                <input
                  type="number"
                  step={1}
                  min={1}
                  max={Math.max(1, getRemainingReturnQuantity(returnModal.item))}
                  value={returnQuantity}
                  onChange={(e) => {
                    const parsed = Number(e.target.value);
                    const maxQty = Math.max(
                      1,
                      getRemainingReturnQuantity(returnModal.item)
                    );
                    if (!Number.isFinite(parsed)) {
                      setReturnQuantity(1);
                      return;
                    }
                    const normalized = Math.max(1, Math.floor(parsed));
                    setReturnQuantity(Math.min(normalized, maxQty));
                  }}
                  className="mt-2 input-field"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-semibold text-dark-700">Proof Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setReturnProofFiles(Array.from(e.target.files || []))
                }
                className="mt-2 block w-full text-sm text-dark-500 file:mr-4 file:rounded-lg file:border-0 file:bg-[#EAF4E5] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#4F6A45] hover:file:bg-[#DDECD5]"
              />

              {returnProofFiles.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {returnProofFiles.map((file, index) => (
                    <span
                      key={`${file.name}-${index}`}
                      className="px-2.5 py-1 rounded-full bg-[#F2F0E8] text-xs text-dark-600"
                    >
                      {file.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={closeReturnModal}
                className="btn-ghost"
                disabled={returnSubmitting}
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSubmitReturnRequest}
                className="btn-primary disabled:opacity-60"
                disabled={returnSubmitting}
              >
                {returnSubmitting ? 'Submitting...' : 'Submit Return Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {returnTimelineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl border border-[#E6E2D6] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-dark-900">Return Timeline</h3>
                <p className="text-xs text-dark-500 mt-1">
                  Return #{returnTimelineModal.returnRequestId} · {returnTimelineModal.itemName}
                </p>
              </div>
              <button
                type="button"
                onClick={closeReturnTimelineModal}
                className="text-dark-500 hover:text-dark-700"
              >
                &times;
              </button>
            </div>

            {returnTimelineLoading ? (
              <p className="mt-4 text-sm text-dark-500">Loading return timeline...</p>
            ) : activeReturnTimelineEvents.length === 0 ? (
              <p className="mt-4 text-sm text-dark-500">No return timeline available.</p>
            ) : (
              <ol className="mt-4 space-y-4">
                {activeReturnTimelineEvents.map((event, index) => {
                  const parsedDate = new Date(event.timestamp);
                  const hasValidDate = !Number.isNaN(parsedDate.getTime());
                  return (
                    <li
                      key={`${event.status}-${event.timestamp}-${index}`}
                      className="rounded-xl border border-[#E6E2D6] bg-white p-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${getReturnStatusBadgeColor(
                            event.status
                          )}`}
                        >
                          {getReturnStatusLabel(event.status)}
                        </span>
                        <span className="text-xs text-dark-500">
                          {hasValidDate
                            ? format(parsedDate, 'dd MMM yyyy, hh:mm a')
                            : event.timestamp}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-dark-600">
                        {event.message || 'Status updated'}
                      </p>
                    </li>
                  );
                })}
              </ol>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={closeReturnTimelineModal}
                className="btn-ghost"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {reviewModal && order &&
        (() => {
          const key = getReviewKey(order.id, reviewModal.item.productId);
          const draft = getReviewDraft(key);
          const attachments = getReviewAttachments(key);
          const existingImages = getReviewExistingImages(key);
          const isSubmitting = !!reviewSubmitting[key];
          const existingReviewId = getReviewId(key);
          const previewImage = getOrderImageUrl(reviewModal.item.productImage);

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-xl border border-[#E6E2D6] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E2D6]">
                  <h3 className="text-sm font-semibold tracking-widest text-dark-700">
                    WRITE REVIEW
                  </h3>
                  <button
                    type="button"
                    onClick={closeReviewModal}
                    className="text-dark-500 hover:text-dark-700"
                  >
                    &times;
                  </button>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
                  <div className="rounded-xl border border-[#E6E2D6] bg-white p-4 flex flex-wrap gap-4">
                    <div className="h-20 w-20 rounded-xl bg-[#F2F0E8] overflow-hidden flex items-center justify-center">
                      <img
                        src={previewImage}
                        alt={reviewModal.item.productName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-dark-900">
                        {reviewModal.item.productName}
                      </p>
                      <div className="mt-2 flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => updateReviewDraft(key, { rating: star })}
                            className="p-1"
                            aria-label={`Rate ${star} stars`}
                          >
                            <FiStar
                              size={18}
                              className={
                                draft.rating >= star
                                  ? 'text-[#6B7D60] fill-[#6B7D60]'
                                  : 'text-dark-300'
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <textarea
                    placeholder="Please write product review here."
                    value={draft.body}
                    onChange={(e) => updateReviewDraft(key, { body: e.target.value })}
                    className="input-field h-40 resize-none"
                  />

                  <div className="flex flex-wrap items-center gap-3">
                    <label className="relative h-14 w-14 rounded-lg border border-dashed border-[#CFC8B4] bg-[#F9F8F4] flex items-center justify-center cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) =>
                          updateReviewAttachments(key, 'images', e.target.files || [])
                        }
                      />
                      <FiImage size={18} className="text-dark-400" />
                    </label>
                    {existingImages.map((imageUrl, index) => (
                      <div
                        key={`existing-${imageUrl}-${index}`}
                        className="relative h-14 w-14 overflow-visible"
                        title="Already uploaded"
                      >
                        <div className="h-full w-full rounded-lg overflow-hidden border border-[#E6E2D6] bg-white">
                          <img
                            src={getOrderImageUrl(imageUrl)}
                            alt="Existing review"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExistingReviewImage(key, index)}
                          className="absolute -top-2 -right-2 z-20 h-5 w-5 rounded-full bg-[#6B7D60] text-white flex items-center justify-center shadow ring-2 ring-white"
                          aria-label="Remove existing photo"
                        >
                          <FiX size={12} />
                        </button>
                      </div>
                    ))}
                    {attachments.images.map((file, index) => (
                      <div key={`${file.name}-${index}`} className="relative h-14 w-14 overflow-visible">
                        <div className="h-full w-full rounded-lg overflow-hidden border border-[#E6E2D6] bg-white">
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Review upload"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeReviewAttachment(key, 'images', index)}
                          className="absolute -top-2 -right-2 z-20 h-5 w-5 rounded-full bg-[#6B7D60] text-white flex items-center justify-center shadow ring-2 ring-white"
                          aria-label="Remove photo"
                        >
                          <FiX size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-[#E6E2D6] flex flex-wrap gap-3">
                  <button type="button" onClick={closeReviewModal} className="btn-ghost">
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSubmitReview(reviewModal.item)}
                    disabled={isSubmitting}
                    className="btn-primary px-4 disabled:opacity-50"
                  >
                    {isSubmitting
                      ? 'Submitting...'
                      : existingReviewId
                      ? 'Update Review'
                      : 'Submit Review'}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
};

export default OrderDetailsPage;
