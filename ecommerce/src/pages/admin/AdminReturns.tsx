import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { FiList, FiRefreshCw, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { orderApi } from "../../api/orderApi";
import type { ReturnRequest } from "../../types";
import { formatINR } from "../../utils/currency";

type ReturnAdminAction = "APPROVE" | "REJECT" | "PICKED_UP";
type TimelineEvent = {
  status: string;
  message: string;
  timestamp: string;
};

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === "object") {
    const candidate = error as { message?: unknown; error?: unknown };
    if (typeof candidate.message === "string" && candidate.message.trim()) {
      return candidate.message;
    }
    if (typeof candidate.error === "string" && candidate.error.trim()) {
      return candidate.error;
    }
  }
  return fallback;
};

const getReturnStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    REQUESTED: "text-yellow-700 bg-yellow-100",
    APPROVED: "text-blue-700 bg-blue-100",
    PICKED_UP: "text-purple-700 bg-purple-100",
    REFUND_INITIATED: "text-amber-700 bg-amber-100",
    REFUNDED: "text-green-700 bg-green-100",
    REJECTED: "text-red-700 bg-red-100",
  };
  return colors[status] || "text-gray-700 bg-gray-100";
};

const getReturnStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    REQUESTED: "Return Requested",
    APPROVED: "Return Approved",
    PICKED_UP: "Picked Up",
    REFUND_INITIATED: "Refund Processing",
    REFUNDED: "Refund Completed",
    REJECTED: "Return Rejected",
  };
  return labels[status] || status.replace(/_/g, " ");
};

const getReturnActionOptions = (status: string) => {
  const normalized = String(status || "").toUpperCase();
  if (normalized === "REQUESTED") {
    return [
      {
        value: "APPROVE" as ReturnAdminAction,
        label: "Approve Return",
        helper: "Approve request after reviewing reason/proofs.",
        requiresComment: true,
      },
      {
        value: "REJECT" as ReturnAdminAction,
        label: "Reject Return",
        helper: "Reject request and restore item eligibility.",
        requiresComment: true,
      },
    ];
  }
  if (normalized === "APPROVED") {
    return [
      {
        value: "PICKED_UP" as ReturnAdminAction,
        label: "Mark Picked Up",
        helper: "Triggers restock + refund lifecycle automatically.",
        requiresComment: false,
      },
    ];
  }
  return [];
};

const AdminReturns = () => {
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const [returnRequestsLoading, setReturnRequestsLoading] = useState(false);
  const [columnSearch, setColumnSearch] = useState({
    returnId: "",
    orderItem: "",
    reason: "",
    status: "",
    refund: "",
    created: "",
  });
  const [returnActionTarget, setReturnActionTarget] = useState<{
    type: ReturnAdminAction;
    request: ReturnRequest;
  } | null>(null);
  const [returnActionComment, setReturnActionComment] = useState("");
  const [returnActionSubmitting, setReturnActionSubmitting] = useState(false);
  const [returnTimelineTarget, setReturnTimelineTarget] = useState<ReturnRequest | null>(
    null
  );
  const [returnTimelineEvents, setReturnTimelineEvents] = useState<TimelineEvent[]>([]);
  const [returnTimelineLoading, setReturnTimelineLoading] = useState(false);

  const fetchReturnRequests = async () => {
    setReturnRequestsLoading(true);
    try {
      const data = await orderApi.getReturnRequests();
      const sorted = [...data].sort((a, b) => {
        const aTime = new Date(a.createdAt || 0).getTime();
        const bTime = new Date(b.createdAt || 0).getTime();
        return bTime - aTime;
      });
      setReturnRequests(sorted);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to fetch return requests"));
      setReturnRequests([]);
    } finally {
      setReturnRequestsLoading(false);
    }
  };

  const openReturnActionModal = (
    request: ReturnRequest,
    preferredType?: ReturnAdminAction
  ) => {
    const actions = getReturnActionOptions(request.status);
    if (actions.length === 0) {
      toast.error("No admin action available for this return status");
      return;
    }
    const resolvedType =
      preferredType && actions.some((action) => action.value === preferredType)
        ? preferredType
        : actions[0].value;
    setReturnActionTarget({ type: resolvedType, request });
    setReturnActionComment("");
  };

  const closeReturnActionModal = () => {
    if (returnActionSubmitting) return;
    setReturnActionTarget(null);
    setReturnActionComment("");
  };

  const handleSubmitReturnAction = async () => {
    if (!returnActionTarget) return;
    const action = returnActionTarget.type;
    const comment = returnActionComment.trim();
    const selectedOption = getReturnActionOptions(returnActionTarget.request.status).find(
      (option) => option.value === action
    );
    if (selectedOption?.requiresComment && !comment) {
      toast.error("Please add admin comment");
      return;
    }

    setReturnActionSubmitting(true);
    try {
      if (action === "APPROVE") {
        const response = await orderApi.approveReturnRequest(
          returnActionTarget.request.id,
          comment
        );
        toast.success(response.message || "Return approved");
      } else if (action === "REJECT") {
        const response = await orderApi.rejectReturnRequest(
          returnActionTarget.request.id,
          comment
        );
        toast.success(response.message || "Return rejected");
      } else {
        const response = await orderApi.markReturnPickedUp(returnActionTarget.request.id);
        toast.success(response.message || "Return picked up");
      }
      closeReturnActionModal();
      await fetchReturnRequests();
      if (returnTimelineTarget?.id === returnActionTarget.request.id) {
        const timelineData = await orderApi.getReturnTimeline(returnTimelineTarget.id);
        setReturnTimelineEvents(timelineData);
      }
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to process return action"));
    } finally {
      setReturnActionSubmitting(false);
    }
  };

  const openReturnTimelineModal = async (request: ReturnRequest) => {
    setReturnTimelineTarget(request);
    setReturnTimelineEvents([]);
    setReturnTimelineLoading(true);
    try {
      const timelineData = await orderApi.getReturnTimeline(request.id);
      setReturnTimelineEvents(timelineData);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to load return timeline"));
      setReturnTimelineEvents([]);
    } finally {
      setReturnTimelineLoading(false);
    }
  };

  const closeReturnTimelineModal = () => {
    setReturnTimelineTarget(null);
    setReturnTimelineEvents([]);
  };

  useEffect(() => {
    fetchReturnRequests();
  }, []);

  useEffect(() => {
    const isModalOpen = returnActionTarget !== null || returnTimelineTarget !== null;
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [returnActionTarget, returnTimelineTarget]);

  const handleColumnSearchChange = (
    key: keyof typeof columnSearch,
    value: string
  ) => {
    setColumnSearch((prev) => ({ ...prev, [key]: value }));
  };

  const hasActiveFilters = Object.values(columnSearch).some(
    (value) => value.trim().length > 0
  );

  const filteredReturnRequests = useMemo(() => {
    const normalizedReturnIdQuery = columnSearch.returnId.trim().toLowerCase();
    const normalizedOrderItemQuery = columnSearch.orderItem.trim().toLowerCase();
    const normalizedReasonQuery = columnSearch.reason.trim().toLowerCase();
    const normalizedStatusQuery = columnSearch.status.trim().toLowerCase();
    const normalizedRefundQuery = columnSearch.refund.trim().toLowerCase();
    const normalizedCreatedQuery = columnSearch.created.trim().toLowerCase();

    return returnRequests.filter((request) => {
      const parsedCreatedAt = request.createdAt ? new Date(request.createdAt) : null;
      const createdAtLabel =
        parsedCreatedAt && !Number.isNaN(parsedCreatedAt.getTime())
          ? format(parsedCreatedAt, "MMM dd, yyyy")
          : "";
      const quantityLabel = request.requestedQuantity ?? request.quantity ?? "";
      const orderItemLabel = `${request.productName || `Item #${request.orderItemId}`} ${
        quantityLabel ? `Qty ${quantityLabel}` : ""
      } Order Item #${request.orderItemId}`;
      const statusLabel = `${request.status} ${getReturnStatusLabel(request.status)}`;
      const refundLabel =
        request.refundAmount !== undefined && request.refundAmount !== null
          ? `${request.refundAmount} ${formatINR(request.refundAmount)}`
          : "";

      if (normalizedReturnIdQuery) {
        const returnIdText = `#${request.id} ${request.id}`;
        if (!returnIdText.toLowerCase().includes(normalizedReturnIdQuery)) {
          return false;
        }
      }

      if (
        normalizedOrderItemQuery &&
        !orderItemLabel.toLowerCase().includes(normalizedOrderItemQuery)
      ) {
        return false;
      }

      if (
        normalizedReasonQuery &&
        !(request.reason || "").toLowerCase().includes(normalizedReasonQuery)
      ) {
        return false;
      }

      if (normalizedStatusQuery && !statusLabel.toLowerCase().includes(normalizedStatusQuery)) {
        return false;
      }

      if (normalizedRefundQuery && !refundLabel.toLowerCase().includes(normalizedRefundQuery)) {
        return false;
      }

      if (
        normalizedCreatedQuery &&
        !`${createdAtLabel} ${request.createdAt || ""}`
          .toLowerCase()
          .includes(normalizedCreatedQuery)
      ) {
        return false;
      }

      return true;
    });
  }, [returnRequests, columnSearch]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-dark-900">Return Management</h2>
          <p className="text-sm text-dark-500">Review and process customer return requests</p>
        </div>
        <button
          onClick={() => fetchReturnRequests()}
          className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 inline-flex items-center gap-2 transition-colors w-fit"
          disabled={returnRequestsLoading}
        >
          <FiRefreshCw className={returnRequestsLoading ? "animate-spin" : ""} />
          {returnRequestsLoading ? "Loading..." : "Refresh Return"}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 md:p-5 overflow-x-auto">
        <table className="min-w-full divide-y divide-dark-200">
          <thead className="bg-dark-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                <div className="flex flex-col">
                  <span>Return ID</span>
                  <input
                    type="text"
                    placeholder="Search Return ID"
                    className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
                    value={columnSearch.returnId}
                    onChange={(e) => handleColumnSearchChange("returnId", e.target.value)}
                  />
                </div>
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                <div className="flex flex-col">
                  <span>Order Item</span>
                  <input
                    type="text"
                    placeholder="Search Order Item"
                    className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
                    value={columnSearch.orderItem}
                    onChange={(e) => handleColumnSearchChange("orderItem", e.target.value)}
                  />
                </div>
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                <div className="flex flex-col">
                  <span>Reason</span>
                  <input
                    type="text"
                    placeholder="Search Reason"
                    className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
                    value={columnSearch.reason}
                    onChange={(e) => handleColumnSearchChange("reason", e.target.value)}
                  />
                </div>
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                <div className="flex flex-col">
                  <span>Status</span>
                  <input
                    type="text"
                    placeholder="Search Status"
                    className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
                    value={columnSearch.status}
                    onChange={(e) => handleColumnSearchChange("status", e.target.value)}
                  />
                </div>
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                <div className="flex flex-col">
                  <span>Refund</span>
                  <input
                    type="text"
                    placeholder="Search Refund"
                    className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
                    value={columnSearch.refund}
                    onChange={(e) => handleColumnSearchChange("refund", e.target.value)}
                  />
                </div>
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                <div className="flex flex-col">
                  <span>Created</span>
                  <input
                    type="text"
                    placeholder="Search Created"
                    className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
                    value={columnSearch.created}
                    onChange={(e) => handleColumnSearchChange("created", e.target.value)}
                  />
                </div>
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-dark-200">
            {returnRequestsLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-sm text-dark-500">
                  Loading return requests...
                </td>
              </tr>
            ) : filteredReturnRequests.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-sm text-dark-500">
                  {hasActiveFilters
                    ? "No matching return requests found."
                    : "No return requests found."}
                </td>
              </tr>
            ) : (
              filteredReturnRequests.map((request) => (
                <tr key={request.id} className="hover:bg-dark-50">
                  <td className="px-4 py-3 text-sm font-medium text-dark-900">#{request.id}</td>
                  <td className="px-4 py-3 text-sm text-dark-700">
                    <div className="space-y-1">
                      <p className="font-medium text-dark-800">
                        {request.productName || `Item #${request.orderItemId}`}
                      </p>
                      <p className="text-xs text-dark-500">
                        Order Item #{request.orderItemId}
                        {request.requestedQuantity || request.quantity
                          ? ` • Qty ${request.requestedQuantity || request.quantity}`
                          : ""}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-dark-700 max-w-[260px] truncate">
                    {request.reason}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getReturnStatusColor(
                        request.status
                      )}`}
                    >
                      {getReturnStatusLabel(request.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-dark-700">
                    {request.refundAmount !== undefined && request.refundAmount !== null
                      ? formatINR(request.refundAmount)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-dark-700">
                    {request.createdAt
                      ? format(new Date(request.createdAt), "MMM dd, yyyy")
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-wrap gap-2">
                      {getReturnActionOptions(request.status).length > 0 ? (
                        <button
                          onClick={() => openReturnActionModal(request)}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                        >
                          {getReturnActionOptions(request.status)[0].value === "PICKED_UP"
                            ? "Mark Picked Up"
                            : "Review / Update"}
                        </button>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-dark-100 text-dark-500">
                          {request.status === "PICKED_UP" ||
                          request.status === "REFUND_INITIATED"
                            ? "Auto Refund Flow"
                            : "No Action"}
                        </span>
                      )}
                      <button
                        onClick={() => openReturnTimelineModal(request)}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 inline-flex items-center gap-1"
                      >
                        <FiList size={12} />
                        Timeline
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {createPortal(
        <AnimatePresence>
          {returnActionTarget && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeReturnActionModal}
                className="fixed inset-0 bg-black/50 z-[9990]"
              />
              <div className="fixed inset-0 z-[9991] flex items-center justify-center p-4 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl border border-dark-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-dark-900">Update Return State</h2>
                    <button onClick={closeReturnActionModal}>
                      <FiX size={22} className="text-dark-400 hover:text-dark-900" />
                    </button>
                  </div>

                  <div className="space-y-2 text-sm text-dark-600">
                    <p>
                      Return ID:{" "}
                      <span className="font-semibold text-dark-900">
                        #{returnActionTarget.request.id}
                      </span>
                    </p>
                    <p>
                      Item ID:{" "}
                      <span className="font-semibold text-dark-900">
                        #{returnActionTarget.request.orderItemId}
                      </span>
                    </p>
                    <p>
                      Reason:{" "}
                      <span className="font-semibold text-dark-900">
                        {returnActionTarget.request.reason}
                      </span>
                    </p>
                    <p>
                      Current State:{" "}
                      <span className="font-semibold text-dark-900">
                        {getReturnStatusLabel(returnActionTarget.request.status)}
                      </span>
                    </p>
                  </div>

                  <div className="mt-4">
                    <label className="text-sm font-semibold text-dark-700 mb-2 block">
                      Next State
                    </label>
                    <select
                      value={returnActionTarget.type}
                      onChange={(e) =>
                        setReturnActionTarget((prev) =>
                          prev ? { ...prev, type: e.target.value as ReturnAdminAction } : prev
                        )
                      }
                      className="w-full px-3 py-2 rounded-lg border border-dark-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      {getReturnActionOptions(returnActionTarget.request.status).map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {(() => {
                      const selectedOption = getReturnActionOptions(
                        returnActionTarget.request.status
                      ).find((option) => option.value === returnActionTarget.type);
                      if (!selectedOption?.helper) return null;
                      return <p className="mt-2 text-xs text-dark-500">{selectedOption.helper}</p>;
                    })()}
                  </div>

                  {(() => {
                    const selectedOption = getReturnActionOptions(
                      returnActionTarget.request.status
                    ).find((option) => option.value === returnActionTarget.type);
                    if (!selectedOption?.requiresComment) return null;
                    return (
                      <div className="mt-4">
                        <label className="text-sm font-semibold text-dark-700 mb-2 block">
                          Admin Comment
                        </label>
                        <textarea
                          rows={4}
                          value={returnActionComment}
                          onChange={(e) => setReturnActionComment(e.target.value)}
                          placeholder="Write your decision note"
                          className="w-full px-3 py-2 rounded-lg border border-dark-300 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
                        />
                      </div>
                    );
                  })()}

                  <div className="flex gap-3 pt-5">
                    <button
                      onClick={handleSubmitReturnAction}
                      disabled={returnActionSubmitting}
                      className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
                    >
                      {returnActionSubmitting
                        ? "Processing..."
                        : returnActionTarget.type === "APPROVE"
                          ? "Approve Return"
                          : returnActionTarget.type === "REJECT"
                            ? "Reject Return"
                            : "Mark Picked Up"}
                    </button>
                    <button
                      onClick={closeReturnActionModal}
                      disabled={returnActionSubmitting}
                      className="flex-1 px-4 py-2 rounded-lg border border-dark-300 text-dark-700 hover:bg-dark-50 disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {createPortal(
        <AnimatePresence>
          {returnTimelineTarget && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeReturnTimelineModal}
                className="fixed inset-0 bg-black/50 z-[9990]"
              />
              <div className="fixed inset-0 z-[9991] flex items-center justify-center p-4 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-2xl p-6 max-w-xl w-full shadow-xl border border-dark-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-dark-900">Return Timeline</h2>
                      <p className="text-xs text-dark-500 mt-1">
                        Return #{returnTimelineTarget.id} • Item #{returnTimelineTarget.orderItemId}
                      </p>
                    </div>
                    <button onClick={closeReturnTimelineModal}>
                      <FiX size={22} className="text-dark-400 hover:text-dark-900" />
                    </button>
                  </div>

                  {returnTimelineLoading ? (
                    <p className="text-sm text-dark-500 py-6">Loading return timeline...</p>
                  ) : returnTimelineEvents.length === 0 ? (
                    <p className="text-sm text-dark-500 py-6">No return timeline found.</p>
                  ) : (
                    <ol className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                      {returnTimelineEvents.map((event, index) => {
                        const parsedDate = new Date(event.timestamp);
                        const dateLabel =
                          event.timestamp && !Number.isNaN(parsedDate.getTime())
                            ? format(parsedDate, "dd MMM yyyy, hh:mm a")
                            : "—";
                        return (
                          <li
                            key={`${event.status}-${event.timestamp}-${index}`}
                            className="rounded-xl border border-dark-200 bg-white p-3"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getReturnStatusColor(
                                  event.status
                                )}`}
                              >
                                {getReturnStatusLabel(event.status)}
                              </span>
                              <span className="text-xs text-dark-500">{dateLabel}</span>
                            </div>
                            <p className="mt-2 text-xs text-dark-600">
                              {event.message || "Status updated"}
                            </p>
                          </li>
                        );
                      })}
                    </ol>
                  )}

                  <div className="flex justify-end pt-5">
                    <button
                      onClick={closeReturnTimelineModal}
                      className="px-4 py-2 rounded-lg border border-dark-300 text-dark-700 hover:bg-dark-50"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default AdminReturns;
