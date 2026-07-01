import { useState, useEffect, type ChangeEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiUser, FiCalendar, FiMapPin, FiEdit2, FiPlus, FiEye, FiEyeOff, FiCheck, FiX, FiSearch, FiSliders, FiChevronRight, FiStar, FiImage } from 'react-icons/fi';
import Navbar from '../../components/layout/Navbar';
import { orderApi } from '../../api/orderApi';
import { appointmentApi } from '../../api/appointmentApi';
import { userProfileApi, type UserProfile, type UserAddress, type AddressPayload } from '../../api/userProfileApi';
import reviewApi from '../../api/reviewApi';
import type { Order, Appointment } from '../../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import {formatINR } from "../../utils/currency";



type AccountTab = 'overview' | 'orders' | 'profile' | 'appointments' | 'addresses';
type OrderStatusFilter = 'ALL' | 'ON_THE_WAY' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
type OrderTimeFilter = 'ANYTIME' | 'LAST_30_DAYS' | 'LAST_6_MONTHS' | 'LAST_YEAR';
const RETURN_WINDOW_DAYS = 15;

const UserDashboard = () => {
    const { user, isAuthenticated, isHydrated } = useSelector(
      (state: RootState) => state.auth
    );
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<AccountTab>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [addressForm, setAddressForm] = useState<AddressPayload>({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    contactPhone: user?.phone || '',
    isDefault: false,
  });
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [isAddressSaving, setIsAddressSaving] = useState(false);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [deletingAddressId, setDeletingAddressId] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState({
    old: false,
    next: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(true);
  const [orderSearch, setOrderSearch] = useState('');
  const [isOrderFilterOpen, setIsOrderFilterOpen] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatusFilter>('ALL');
  const [orderTimeFilter, setOrderTimeFilter] = useState<OrderTimeFilter>('ANYTIME');
  const [orderStatusDraft, setOrderStatusDraft] = useState<OrderStatusFilter>('ALL');
  const [orderTimeDraft, setOrderTimeDraft] = useState<OrderTimeFilter>('ANYTIME');
  const [reviewDrafts, setReviewDrafts] = useState<
    Record<string, { rating: number; title: string; body: string }>
  >({});
  const [reviewSubmitting, setReviewSubmitting] = useState<Record<string, boolean>>({});
  const [reviewModal, setReviewModal] = useState<{
    orderId: number;
    item: Order['items'][number];
  } | null>(null);
  const [reviewAttachments, setReviewAttachments] = useState<
    Record<string, { images: File[]; videos: File[] }>
  >({});
  const [reviewIds, setReviewIds] = useState<Record<string, number>>({});
  const [reviewExistingImages, setReviewExistingImages] = useState<Record<string, string[]>>({});
  const [reviewImagesToDelete, setReviewImagesToDelete] = useState<Record<string, string[]>>(
    {}
  );
  const [cancelModal, setCancelModal] = useState<{
    order: Order;
    mode: 'FULL' | 'PARTIAL';
    reason: string;
    selectedItemIds: number[];
  } | null>(null);
  const [cancelSubmitting, setCancelSubmitting] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
  const fallbackImageBaseUrl = apiBaseUrl
    ? apiBaseUrl.replace(/\/api\/?$/i, '')
    : 'http://localhost:8090';
  const IMAGE_BASE_URL = import.meta.env.VITE_API_IMG_URL || fallbackImageBaseUrl;

  const getOrderImageUrl = (path?: string) => {
    if (!path) return '/placeholder.jpg';
    if (path.startsWith('http') || path.startsWith('blob:')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${IMAGE_BASE_URL}${cleanPath}`;
  };

  const getReviewKey = (orderId: number, productId: number) => `${orderId}-${productId}`;

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
    setReviewDrafts((prev) => {
      const current = prev[key] || { rating: 0, title: '', body: '' };
      return {
        ...prev,
        [key]: { ...current, ...patch },
      };
    });
  };

  const updateReviewAttachments = (
    key: string,
    type: 'images' | 'videos',
    files: FileList | File[]
  ) => {
    const list = Array.isArray(files) ? files : Array.from(files);
    setReviewAttachments((prev) => {
      const current = prev[key] || { images: [], videos: [] };
      return {
        ...prev,
        [key]: {
          ...current,
          [type]: [...current[type], ...list],
        },
      };
    });
  };

  const removeReviewAttachment = (
    key: string,
    type: 'images' | 'videos',
    index: number
  ) => {
    setReviewAttachments((prev) => {
      const current = prev[key] || { images: [], videos: [] };
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
    orderId: number,
    productId: number,
    knownReviewId?: number
  ) => {
    try {
      const data = await reviewApi.getProductReviews(productId, 0, 200);
      const reviews = data.content || [];
      if (knownReviewId) {
        const byId = reviews.find((review) => review.id === knownReviewId);
        if (byId) return byId;
      }
      const byOrder = reviews.find((review) => review.orderId === orderId);
      if (byOrder) return byOrder;

      if (!user?.id) return null;
      const normalizedUserName = (user.name || '').trim().toLowerCase();
      return (
        reviews.find(
          (review) =>
            (review.userId === user.id ||
              (normalizedUserName.length > 0 &&
                (review.username || '').trim().toLowerCase() === normalizedUserName)) &&
            (!review.orderId || review.orderId === orderId)
        ) || null
      );
    } catch {
      return null;
    }
  };

  const openReviewModal = async (orderId: number, item: Order['items'][number]) => {
    const key = getReviewKey(orderId, item.productId);
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
    setReviewModal({ orderId, item });

    const existing = await fetchExistingReview(orderId, item.productId, item.reviewId);
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

  const handleSubmitReview = async (orderId: number, item: Order['items'][number]) => {
    if (!user?.id) {
      toast.error('Please log in to submit a review');
      return;
    }
    const reviewKey = getReviewKey(orderId, item.productId);
    const draft = getReviewDraft(reviewKey);
    if (!draft.rating || draft.rating < 1) {
      toast.error('Please select a star rating');
      return;
    }
    if (!draft.body.trim()) {
      toast.error('Please write your review');
      return;
    }

    setReviewSubmitting((prev) => ({ ...prev, [reviewKey]: true }));
    try {
      const attachments = getReviewAttachments(reviewKey);
      const imagesToDelete = getReviewImagesToDelete(reviewKey);
      const knownReviewId = item.reviewId || getReviewId(reviewKey);
      const existing = await fetchExistingReview(orderId, item.productId, knownReviewId);
      const reviewId = existing?.id || getReviewId(reviewKey);
      if (existing?.id) {
        setReviewIds((prev) => ({ ...prev, [reviewKey]: existing.id }));
      }

      let persistedReviewId: number | null = null;
      let persistedImages: string[] = [];
      if (reviewId) {
        const updated = await reviewApi.updateReview(
          reviewId,
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
        toast.success('Review updated');
      } else {
        const created = await reviewApi.createReview(
          {
            productId: item.productId,
            orderId,
            rating: draft.rating,
            title: draft.title.trim() || item.productName || 'Review',
            body: draft.body.trim(),
          },
          attachments.images,
          attachments.videos
        );
        persistedReviewId = created.id;
        persistedImages = mapExistingReviewImages(created);
        toast.success('Review submitted');
      }

      if (persistedReviewId) {
        setReviewIds((prev) => ({ ...prev, [reviewKey]: persistedReviewId as number }));
      }

      if (persistedImages.length === 0) {
        const refreshed = await fetchExistingReview(
          orderId,
          item.productId,
          persistedReviewId || reviewId || item.reviewId
        );
        persistedImages = refreshed ? mapExistingReviewImages(refreshed) : [];
      }

      setReviewExistingImages((prev) => ({
        ...prev,
        [reviewKey]: persistedImages,
      }));
      setReviewImagesToDelete((prev) => ({ ...prev, [reviewKey]: [] }));
      setReviewDrafts((prev) => ({
        ...prev,
        [reviewKey]: {
          rating: draft.rating,
          title: draft.title,
          body: draft.body,
        },
      }));
      setReviewAttachments((prev) => ({
        ...prev,
        [reviewKey]: { images: [], videos: [] },
      }));
      setReviewModal(null);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting((prev) => ({ ...prev, [reviewKey]: false }));
    }
  };

    useEffect(() => {
      if (!isHydrated) return;        // ? wait until localStorage is loaded
      if (!isAuthenticated) return;  // ? user not logged in
      if (!user) return;             // ? safety guard

      fetchUserData();               // ? API CALLS FIRE HERE
    }, [isHydrated, isAuthenticated, user]);

    useEffect(() => {
      setProfileForm({
        name: profile?.name || user?.name || '',
        phone: profile?.phone || user?.phone || '',
      });
    }, [profile, user]);

    useEffect(() => {
      const nextTab = (location.state as { tab?: AccountTab } | null)?.tab;
      if (nextTab && nextTab !== activeTab) {
        setActiveTab(nextTab);
      }
    }, [location.state, activeTab]);

    useEffect(() => {
      const isModalOpen = isOrderFilterOpen || reviewModal !== null || cancelModal !== null;
      document.body.style.overflow = isModalOpen ? 'hidden' : '';
      return () => {
        document.body.style.overflow = '';
      };
    }, [isOrderFilterOpen, reviewModal, cancelModal]);

    useEffect(() => {
      if (!user?.id || orders.length === 0) return;
      const deliveredItems = orders
        .filter((order) => order.status === 'DELIVERED')
        .flatMap((order) =>
          order.items.map((item) => ({
            orderId: order.id,
            item,
            key: getReviewKey(order.id, item.productId),
          }))
        );
      if (deliveredItems.length === 0) return;

      let active = true;
      const preloadReviews = async () => {
      const nextReviewIds: Record<string, number> = {};
      const nextDrafts: Record<string, { rating: number; title: string; body: string }> = {};
      const nextExistingImages: Record<string, string[]> = {};

      await Promise.all(
        deliveredItems.map(async ({ orderId, item, key }) => {
            const existing = await fetchExistingReview(
              orderId,
              item.productId,
              item.reviewId
            );
            if (!existing) return;
            nextReviewIds[key] = existing.id;
            nextExistingImages[key] = mapExistingReviewImages(existing);
            nextDrafts[key] = {
              rating: existing.rating || 0,
              title: existing.title || '',
              body: existing.body || '',
            };
          })
        );

        if (!active) return;
        if (Object.keys(nextReviewIds).length > 0) {
          setReviewIds((prev) => ({ ...prev, ...nextReviewIds }));
        }
        if (Object.keys(nextExistingImages).length > 0) {
          setReviewExistingImages((prev) => ({ ...prev, ...nextExistingImages }));
        }
        if (Object.keys(nextDrafts).length > 0) {
          setReviewDrafts((prev) => {
            const merged = { ...prev };
            Object.entries(nextDrafts).forEach(([key, value]) => {
              const current = prev[key];
              if (!current || (!current.rating && !current.title && !current.body)) {
                merged[key] = value;
              }
            });
            return merged;
          });
        }
      };

      preloadReviews();
      return () => {
        active = false;
      };
    }, [orders, user?.id, user?.name]);


    const resetAddressForm = (overrides: Partial<AddressPayload> = {}) => {
      setAddressForm({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        contactPhone: profile?.phone || user?.phone || '',
        isDefault: false,
        ...overrides,
      });
    };

    const loadAddresses = async () => {
      if (!user?.id) return;
      try {
        const response = await userProfileApi.getAddresses(user.id);
        setAddresses(response);
      } catch (error) {
        console.warn('Failed to fetch addresses', error);
      }
    };

    const fetchUserData = async () => {
    if (!user?.id) return;

    
    setLoading(true);
    try {
      const [ordersRes, appointmentsRes] = await Promise.all([
        orderApi.getMyOrders(0, 10),
        appointmentApi.getUserAppointments(user.id, 0, 10),
      ]);
      setOrders(ordersRes.content);
      setAppointments(appointmentsRes.content);

      try {
        const profileRes = await userProfileApi.getUserProfile(user.id);
        setProfile(profileRes);
      } catch (profileError) {
        console.warn('Failed to fetch user profile', profileError);
      }

      await loadAddresses();
    } catch (error: any) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setProfileForm((prev) => ({ ...prev, [name]: digitsOnly }));
      return;
    }
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async () => {
    if (!user?.id) return;
    if (!profileForm.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (profileForm.phone && profileForm.phone.length !== 10) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    setIsProfileSaving(true);
    try {
      const updated = await userProfileApi.updateUserProfile(user.id, {
        name: profileForm.name.trim(),
        phone: profileForm.phone?.trim() || undefined,
      });
      setProfile(updated);
      window.dispatchEvent(new Event("profile:updated"));
      toast.success('Profile updated');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update profile');
    } finally {
      setIsProfileSaving(false);
    }
  };

  const handleProfileReset = () => {
    setProfileForm({
      name: profile?.name || user?.name || '',
      phone: profile?.phone || user?.phone || '',
    });
  };

  const handlePasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const getPasswordChecks = (password: string) => ({
    length: password.length >= 8,
    upper: /(?=.*[A-Z])/.test(password),
    lower: /(?=.*[a-z])/.test(password),
    number: /(?=.*\d)/.test(password),
    special: /(?=.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?])/.test(password),
  });

  const getPasswordError = (password: string) => {
    const checks = getPasswordChecks(password);
    if (!checks.length) return 'At least 8 characters';
    if (!checks.lower) return 'One lowercase letter';
    if (!checks.upper) return 'One uppercase letter';
    if (!checks.number) return 'One number';
    if (!checks.special) return 'One special character';
    return '';
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/(?=.*[a-z])/.test(password)) score++;
    if (/(?=.*[A-Z])/.test(password)) score++;
    if (/(?=.*\d)/.test(password)) score++;
    if (/(?=.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?])/.test(password)) score++;

    return {
      score,
      percentage: (score / 5) * 100,
      label: score <= 2 ? 'Weak' : score <= 4 ? 'Good' : 'Strong',
      color: score <= 2 ? 'bg-red-500' : score <= 4 ? 'bg-yellow-500' : 'bg-green-500',
    };
  };

  const handleChangePassword = async () => {
    if (!user?.id) return;
    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }
    const passwordError = getPasswordError(passwordForm.newPassword);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsPasswordSaving(true);
    try {
      await userProfileApi.changePassword(user.id, {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password updated');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update password');
    } finally {
      setIsPasswordSaving(false);
    }
  };

  const handleAddressInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'contactPhone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setAddressForm((prev) => ({ ...prev, [name]: digitsOnly }));
      return;
    }
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateAddressForm = () => {
    if (
      !addressForm.addressLine1 ||
      !addressForm.city ||
      !addressForm.state ||
      !addressForm.postalCode ||
      !addressForm.country ||
      !addressForm.contactPhone
    ) {
      toast.error('Please fill in all required address fields');
      return false;
    }
    if (addressForm.contactPhone.length !== 10) {
      toast.error('Contact phone must be exactly 10 digits');
      return false;
    }
    return true;
  };

  const handleAddressSave = async () => {
    if (!user?.id) return;
    if (!validateAddressForm()) return;

    setIsAddressSaving(true);
    try {
      if (editingAddressId !== null) {
        const updated = await userProfileApi.updateAddress(user.id, editingAddressId, {
          ...addressForm,
          id: editingAddressId,
        });
        setAddresses((prev) =>
          prev.map((addr) => (addr.id === updated.id ? updated : addr))
        );
        toast.success('Address updated');
      } else {
        const created = await userProfileApi.addAddress(user.id, addressForm);
        setAddresses((prev) => [created, ...prev]);
        toast.success('Address added');
      }
      setIsAddressFormOpen(false);
      setEditingAddressId(null);
      resetAddressForm();
      await loadAddresses();
    } catch (error: any) {
      console.error('Address save failed', error);
      toast.error(error?.message || 'Failed to save address');
    } finally {
      setIsAddressSaving(false);
    }
  };

  const handleEditAddress = (address: UserAddress) => {
    setEditingAddressId(address.id);
    setIsAddressFormOpen(true);
    setAddressForm({
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country || '',
      contactPhone: address.contactPhone || profile?.phone || user?.phone || '',
      isDefault: address.isDefault,
    });
  };

  const handleAddressCancel = () => {
    setIsAddressFormOpen(false);
    setEditingAddressId(null);
    resetAddressForm();
  };

  const handleSetDefaultAddress = async (addressId: number) => {
    if (!user?.id) return;
    try {
      await userProfileApi.setDefaultAddress(user.id, addressId);
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr.id === addressId,
        }))
      );
      toast.success('Default address updated');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to set default address');
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (!user?.id) return;
    const confirmed = window.confirm('Delete this address? This action cannot be undone.');
    if (!confirmed) return;

    setDeletingAddressId(addressId);
    try {
      await userProfileApi.deleteAddress(user.id, addressId);
      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
      toast.success('Address deleted');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete address');
    } finally {
      setDeletingAddressId(null);
    }
  };

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    resetAddressForm();
    setIsAddressFormOpen(true);
  };

  const openOrderFilters = () => {
    setOrderStatusDraft(orderStatusFilter);
    setOrderTimeDraft(orderTimeFilter);
    setIsOrderFilterOpen(true);
  };

  const applyOrderFilters = () => {
    setOrderStatusFilter(orderStatusDraft);
    setOrderTimeFilter(orderTimeDraft);
    setIsOrderFilterOpen(false);
  };

  const clearOrderFilters = () => {
    setOrderStatusDraft('ALL');
    setOrderTimeDraft('ANYTIME');
    setOrderStatusFilter('ALL');
    setOrderTimeFilter('ANYTIME');
    setIsOrderFilterOpen(false);
  };

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

  const getApiErrorMessage = (error: unknown, fallback: string) => {
    if (error && typeof error === 'object') {
      const maybe = error as { message?: unknown; error?: unknown };
      if (typeof maybe.message === 'string' && maybe.message.trim()) {
        return maybe.message;
      }
      if (typeof maybe.error === 'string' && maybe.error.trim()) {
        return maybe.error;
      }
    }
    return fallback;
  };

  const isOrderCancellable = (status: string) =>
    status === 'PENDING' || status === 'PROCESSING';

  const getItemStatus = (item: Order['items'][number]) =>
    ((item as unknown as { itemStatus?: string }).itemStatus || 'ACTIVE').toUpperCase();

  const getCancellableItems = (order: Order) =>
    (order.items || []).filter((item) => getItemStatus(item) === 'ACTIVE');

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

  const getOrderDeliveredAt = (order: Order): Date | null => {
    const deliveredTimelineEvent = (order.timeline || []).find(
      (event) => event.status === 'DELIVERED'
    );
    const candidateValues = [
      deliveredTimelineEvent?.timestamp,
      (order as unknown as { deliveredAt?: string }).deliveredAt,
      order.updatedAt,
      order.createdAt,
    ];

    for (const value of candidateValues) {
      if (!value) continue;
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }

    return null;
  };

  const getItemReturnWindowEnd = (order: Order, item: Order['items'][number]) => {
    const explicitWindowEnd = item.returnEligibleUntil || item.returnWindowEndsAt;
    if (explicitWindowEnd) {
      const parsed = new Date(explicitWindowEnd);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }

    const deliveredAt = getOrderDeliveredAt(order);
    if (!deliveredAt) return null;
    return new Date(
      deliveredAt.getTime() + RETURN_WINDOW_DAYS * 24 * 60 * 60 * 1000
    );
  };

  const canRequestReturnFromDashboard = (
    order: Order,
    item: Order['items'][number]
  ) =>
    order.status === 'DELIVERED' &&
    getItemStatus(item) === 'ACTIVE' &&
    Number(item.returnedQuantity || 0) < Number(item.quantity || 0) &&
    (() => {
      const windowEnd = getItemReturnWindowEnd(order, item);
      if (!windowEnd) return true;
      return Date.now() <= windowEnd.getTime();
    })();

  const openCancelModal = (order: Order) => {
    setCancelModal({
      order,
      mode: 'FULL',
      reason: '',
      selectedItemIds: [],
    });
  };

  const closeCancelModal = () => {
    if (cancelSubmitting) return;
    setCancelModal(null);
  };

  const toggleCancelItem = (orderItemId: number) => {
    setCancelModal((prev) => {
      if (!prev) return prev;
      const exists = prev.selectedItemIds.includes(orderItemId);
      return {
        ...prev,
        selectedItemIds: exists
          ? prev.selectedItemIds.filter((id) => id !== orderItemId)
          : [...prev.selectedItemIds, orderItemId],
      };
    });
  };

  const handleCancelOrder = async () => {
    if (!cancelModal) return;
    if (!isOrderCancellable(cancelModal.order.status)) {
      toast.error('Order cannot be cancelled after it has been shipped');
      return;
    }
    const reason = cancelModal.reason.trim();
    if (!reason) {
      toast.error('Please enter a cancellation reason');
      return;
    }

    if (cancelModal.mode === 'PARTIAL' && cancelModal.selectedItemIds.length === 0) {
      toast.error('Please select at least one item to cancel');
      return;
    }

    setCancelSubmitting(true);
    try {
      await orderApi.cancelOrder(cancelModal.order.id, {
        reason,
        orderItemIds:
          cancelModal.mode === 'PARTIAL' ? cancelModal.selectedItemIds : undefined,
      });
      toast.success('Order cancellation processed successfully');
      setCancelModal(null);
      await fetchUserData();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, 'Failed to cancel order'));
    } finally {
      setCancelSubmitting(false);
    }
  };

  const isActive = profile?.isActive ?? user?.isActive ?? true;
  const orderedAddresses = [...addresses].sort((a, b) => {
    if (a.isDefault === b.isDefault) return 0;
    return a.isDefault ? -1 : 1;
  });
  const passwordChecks = getPasswordChecks(passwordForm.newPassword);
  const passwordStrength = getPasswordStrength(passwordForm.newPassword);
  const memberSince = profile?.createdAt
    ? format(new Date(profile.createdAt), 'MMMM yyyy')
    : null;
  const profileInitials = (profile?.name || user?.name || 'U')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const accountCards = [
    {
      id: 'profile',
      title: 'Profile',
      description: 'View and edit your personal information',
      icon: FiUser,
    },
    {
      id: 'orders',
      title: 'Orders',
      description: 'Track and manage your orders',
      icon: FiPackage,
      meta: `${profile?.orderCount ?? orders.length} orders`,
    },
    {
      id: 'addresses',
      title: 'Addresses',
      description: 'Manage your shipping addresses',
      icon: FiMapPin,
      meta: `${addresses.length} saved`,
    },
    {
      id: 'appointments',
      title: 'Appointments',
      description: 'Manage your appointments',
      icon: FiCalendar,
      meta: `${profile?.appointmentCount ?? appointments.length} booked`,
    },
  ] ;

  const orderStatusLabels: Record<OrderStatusFilter, string> = {
    ALL: 'All',
    ON_THE_WAY: 'On the way',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    RETURNED: 'Returned',
  };

  const orderTimeLabels: Record<OrderTimeFilter, string> = {
    ANYTIME: 'Anytime',
    LAST_30_DAYS: 'Last 30 days',
    LAST_6_MONTHS: 'Last 6 months',
    LAST_YEAR: 'Last year',
  };

  const normalizedSearch = orderSearch.trim().toLowerCase();
  const filteredOrders = orders.filter((order) => {
    const statusMatch =
      orderStatusFilter === 'ALL'
        ? true
        : orderStatusFilter === 'ON_THE_WAY'
        ? ['PENDING', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY'].includes(order.status)
        : order.status === orderStatusFilter;

    const orderDate = new Date(order.createdAt);
    const isValidDate = !Number.isNaN(orderDate.getTime());
    const diffDays = isValidDate
      ? (Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
      : 0;
    const timeMatch =
      orderTimeFilter === 'ANYTIME'
        ? true
        : orderTimeFilter === 'LAST_30_DAYS'
        ? diffDays <= 30
        : orderTimeFilter === 'LAST_6_MONTHS'
        ? diffDays <= 180
        : diffDays <= 365;

    const searchMatch =
      normalizedSearch.length === 0 ||
      order.id.toString().includes(normalizedSearch) ||
      order.items.some((item) =>
        item.productName?.toLowerCase().includes(normalizedSearch)
      );

    return statusMatch && timeMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 mx-auto">

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {accountCards.map((card) => {
              const Icon = card.icon;
              return (
                <motion.button
                  key={card.title}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                 onClick={() => setActiveTab(card.id as AccountTab)}
                  className="group text-left rounded-2xl border border-[#E6E2D6] bg-white p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-[#F2F0E8] text-[#6B7D60] flex items-center justify-center transition-colors group-hover:bg-[#6B7D60] group-hover:text-white">
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-dark-900">{card.title}</h3>
                      <p className="text-sm text-dark-500">{card.description}</p>
                      {card.meta && (
                        <p className="text-xs text-dark-400 mt-2">{card.meta}</p>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {activeTab !== 'overview' && (
          <div className="max-w-5xl mx-auto">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className="text-sm text-dark-500 hover:text-dark-700 flex items-center gap-2"
            >
              <span className="text-base">&larr;</span>
              Back to Account
            </button>

            <div className="mt-6">
              {/* Content */}
              <div className="rounded-2xl">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-24 glass-card rounded-xl shimmer" />
                    ))}
                  </div>
                ) : (
                  <>
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-display font-bold text-dark-900">My Orders</h2>
                      <p className="text-dark-500">Track and manage your orders</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      <div className="relative flex-1 min-w-[220px]">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                        <input
                          type="text"
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          placeholder="Search in orders"
                          className="input-field pl-10"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={openOrderFilters}
                        className="btn-ghost border border-[#6B7D60] text-[#6B7D60] flex items-center gap-2"
                      >
                        <FiSliders size={16} />
                        Filter
                      </button>
                    </div>
                  </div>

                  {(orderStatusFilter !== 'ALL' || orderTimeFilter !== 'ANYTIME') && (
                    <div className="flex flex-wrap gap-2 text-xs">
                      {orderStatusFilter !== 'ALL' && (
                        <span className="px-3 py-1 rounded-full bg-[#F2F0E8] text-[#6B7D60]">
                          Status: {orderStatusLabels[orderStatusFilter]}
                        </span>
                      )}
                      {orderTimeFilter !== 'ANYTIME' && (
                        <span className="px-3 py-1 rounded-full bg-[#F2F0E8] text-[#6B7D60]">
                          Time: {orderTimeLabels[orderTimeFilter]}
                        </span>
                      )}
                    </div>
                  )}
                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <FiPackage className="mx-auto text-dark-500 mb-4" size={48} />
                      <p className="text-dark-600">No orders yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredOrders.map((order) => {
                        const firstItem = order.items[0];
                        const cancelledItems = (order.items || []).filter(
                          (item) => getItemStatus(item) === 'CANCELLED'
                        );
                        const previewImage = getOrderImageUrl(firstItem?.productImage);
                        const orderDate = new Date(order.createdAt);
                        const isValidDate = !Number.isNaN(orderDate.getTime());
                        const dateText = isValidDate ? format(orderDate, 'MMMM dd, yyyy') : '—';
                        const displayOrderId = order.orderNumber
                          ? String(order.orderNumber)
                          : String(order.id);
                        const orderLabel = displayOrderId.startsWith('ORD-')
                          ? displayOrderId
                          : `ORD-${displayOrderId}`;
                        return (
                          <motion.div
                            key={order.id}
                            whileHover={{ y: -2 }}
                            className="rounded-2xl border border-[#E6E2D6] bg-white p-5 shadow-sm"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-xl bg-[#F2F0E8] overflow-hidden flex items-center justify-center">
                                  <img
                                    src={previewImage}
                                    alt={firstItem?.productName || 'Order item'}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-xs font-semibold text-dark-700">
                                      {orderLabel}
                                    </span>
                                    <span
                                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${getStatusColor(
                                        order.status
                                      )}`}
                                    >
                                      {order.status.replace(/_/g, ' ')}
                                    </span>
                                    {order.paymentMethod && (
                                      <span
                                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                          order.paymentMethod === 'RAZORPAY'
                                            ? order.paymentStatus === 'COMPLETED'
                                              ? 'bg-blue-100 text-blue-700'
                                              : order.paymentStatus === 'FAILED'
                                              ? 'bg-red-100 text-red-700'
                                              : 'bg-amber-100 text-amber-700'
                                            : 'bg-amber-100 text-amber-700'
                                        }`}
                                      >
                                        {order.paymentMethod === 'RAZORPAY'
                                          ? order.paymentStatus === 'COMPLETED'
                                            ? 'Paid via Razorpay'
                                            : order.paymentStatus === 'FAILED'
                                            ? 'Razorpay (Failed)'
                                            : 'Razorpay (Pending)'
                                          : 'Pay on Delivery'}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm font-semibold text-dark-900">
                                    {firstItem?.productName || 'Order items'}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-3 text-xs text-dark-500">
                                    <span>{dateText}</span>
                                    <span className="font-semibold text-dark-700">
                                      {formatINR(order.totalAmount)}
                                    </span>
                                    {order.transactionId && (
                                      <span className="px-2 py-1 rounded-full bg-[#F2F0E8] text-dark-600 font-semibold">
                                        {order.transactionId === 'COD_PENDING'
                                          ? 'Pay on Delivery'
                                          : `Ref: ${order.transactionId.substring(0, 12)}...`}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {isOrderCancellable(order.status) && (
                                  <button
                                    type="button"
                                    onClick={() => openCancelModal(order)}
                                    className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => navigate(`/orders/${order.id}`)}
                                  className="h-9 w-9 rounded-full border border-[#E6E2D6] text-dark-500 hover:text-[#6B7D60] hover:border-[#6B7D60] flex items-center justify-center"
                                  aria-label="View order details"
                                >
                                  <FiChevronRight size={18} />
                                </button>
                              </div>
                            </div>

                            {cancelledItems.length > 0 && (
                              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-red-700">
                                  Cancelled Item{cancelledItems.length > 1 ? 's' : ''}
                                </p>
                                <div className="mt-2 space-y-1">
                                  {cancelledItems.map((item) => (
                                    <div
                                      key={`cancelled-${item.id}`}
                                      className="flex items-center justify-between gap-3 text-xs"
                                    >
                                      <span className="text-red-700 truncate">{item.productName}</span>
                                      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">
                                        Cancelled
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {order.status === 'DELIVERED' && order.items.length > 0 && (
                              <div className="mt-4 border-t border-[#E6E2D6] pt-4 space-y-3">
                                {order.items.map((item) => {
                                  const reviewKey = getReviewKey(order.id, item.productId);
                                  const reviewDraft = getReviewDraft(reviewKey);
                                  const existingReviewId = getReviewId(reviewKey);
                                  const itemImage = getOrderImageUrl(item.productImage);
                                  const itemStatus = getItemStatus(item);
                                  const isItemCancelled = itemStatus === 'CANCELLED';
                                  return (
                                    <div
                                      key={item.id}
                                      className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#E6E2D6] bg-white p-3"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-xl bg-[#F2F0E8] overflow-hidden flex items-center justify-center">
                                          <img
                                            src={itemImage}
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
                                            {item.selectedSize
                                              ? ` · Size: ${item.selectedSize}`
                                              : ''}
                                            {item.selectedColor
                                              ? ` · Color: ${item.selectedColor}`
                                              : ''}
                                          </p>
                                          {itemStatus !== 'ACTIVE' && (
                                            <span
                                              className={`inline-flex mt-2 px-2 py-0.5 rounded-full text-[11px] font-semibold ${getItemStatusBadgeColor(itemStatus)}`}
                                            >
                                              {itemStatus.replace(/_/g, ' ')}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex flex-wrap items-center gap-3">
                                        {isItemCancelled ? (
                                          <span className="text-xs font-semibold text-red-600">
                                            This item was cancelled
                                          </span>
                                        ) : (
                                          <>
                                            <div className="flex items-center gap-1">
                                              {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                  key={star}
                                                  type="button"
                                                  onClick={() => {
                                                    updateReviewDraft(reviewKey, { rating: star });
                                                    openReviewModal(order.id, item);
                                                  }}
                                                  className="p-1"
                                                  aria-label={`Rate ${star} stars`}
                                                >
                                                  <FiStar
                                                    size={16}
                                                    className={
                                                      reviewDraft.rating >= star
                                                        ? 'text-[#6B7D60] fill-[#6B7D60]'
                                                        : 'text-dark-300'
                                                    }
                                                  />
                                                </button>
                                              ))}
                                            </div>
                                            {canRequestReturnFromDashboard(order, item) && (
                                              <button
                                                type="button"
                                                onClick={() => navigate(`/orders/${order.id}`)}
                                                className="text-xs font-semibold text-blue-600 hover:underline"
                                              >
                                                Return Item
                                              </button>
                                            )}
                                            <button
                                              type="button"
                                              onClick={() => openReviewModal(order.id, item)}
                                              className="inline-flex items-center rounded-md border border-[#D5DDCF] px-3 py-1.5 text-xs font-semibold text-[#6B7D60] transition-colors hover:bg-[#F3F6F1]"
                                            >
                                              {existingReviewId ? 'Edit Review' : 'Write Review'}
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {isOrderFilterOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                  <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-dark-900">Filter Orders</h3>
                      <button
                        type="button"
                        onClick={() => setIsOrderFilterOpen(false)}
                        className="text-dark-500 hover:text-dark-700"
                      >
                        &times;
                      </button>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-semibold text-dark-700">Status</p>
                      <div className="mt-3 space-y-2">
                        {[
                          { label: 'All', value: 'ALL' },
                          { label: 'On the way', value: 'ON_THE_WAY' },
                          { label: 'Delivered', value: 'DELIVERED' },
                          { label: 'Cancelled', value: 'CANCELLED' },
                          { label: 'Returned', value: 'RETURNED' },
                        ].map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center gap-3 text-sm text-dark-600"
                          >
                            <input
                              type="radio"
                              name="orderStatus"
                              checked={orderStatusDraft === option.value}
                              onChange={() => setOrderStatusDraft(option.value as OrderStatusFilter)}
                              className="accent-[#6B7D60]"
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 border-t border-[#E6E2D6] pt-4">
                      <p className="text-sm font-semibold text-dark-700">Time</p>
                      <div className="mt-3 space-y-2">
                        {[
                          { label: 'Anytime', value: 'ANYTIME' },
                          { label: 'Last 30 days', value: 'LAST_30_DAYS' },
                          { label: 'Last 6 months', value: 'LAST_6_MONTHS' },
                          { label: 'Last year', value: 'LAST_YEAR' },
                        ].map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center gap-3 text-sm text-dark-600"
                          >
                            <input
                              type="radio"
                              name="orderTime"
                              checked={orderTimeDraft === option.value}
                              onChange={() => setOrderTimeDraft(option.value as OrderTimeFilter)}
                              className="accent-[#6B7D60]"
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button
                        type="button"
                        onClick={clearOrderFilters}
                        className="btn-ghost flex-1 border border-[#E6E2D6]"
                      >
                        Clear Filters
                      </button>
                      <button
                        type="button"
                        onClick={applyOrderFilters}
                        className="btn-primary flex-1"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {cancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                  <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
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
                      Order #{cancelModal.order.orderNumber || cancelModal.order.id}
                    </p>

                    <div className="mt-4">
                      <p className="text-sm font-semibold text-dark-700">Cancellation Type</p>
                      <div className="mt-2 flex gap-3">
                        <label className="flex items-center gap-2 text-sm text-dark-600">
                          <input
                            type="radio"
                            checked={cancelModal.mode === 'FULL'}
                            onChange={() =>
                              setCancelModal((prev) =>
                                prev
                                  ? { ...prev, mode: 'FULL', selectedItemIds: [] }
                                  : prev
                              )
                            }
                            className="accent-[#6B7D60]"
                          />
                          Full Order
                        </label>
                        <label className="flex items-center gap-2 text-sm text-dark-600">
                          <input
                            type="radio"
                            checked={cancelModal.mode === 'PARTIAL'}
                            onChange={() =>
                              setCancelModal((prev) =>
                                prev ? { ...prev, mode: 'PARTIAL' } : prev
                              )
                            }
                            className="accent-[#6B7D60]"
                          />
                          Specific Items
                        </label>
                      </div>
                    </div>

                    {cancelModal.mode === 'PARTIAL' && (
                      <div className="mt-4 max-h-52 overflow-y-auto rounded-xl border border-[#E6E2D6] p-3 space-y-2">
                        {getCancellableItems(cancelModal.order).length === 0 ? (
                          <p className="text-sm text-dark-500">No cancellable items found.</p>
                        ) : (
                          getCancellableItems(cancelModal.order).map((item) => (
                            <label
                              key={item.id}
                              className="flex items-center justify-between gap-3 rounded-lg border border-[#E6E2D6] px-3 py-2"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-dark-900 truncate">
                                  {item.productName}
                                </p>
                                <p className="text-xs text-dark-500">Qty: {item.quantity}</p>
                              </div>
                              <input
                                type="checkbox"
                                checked={cancelModal.selectedItemIds.includes(item.id)}
                                onChange={() => toggleCancelItem(item.id)}
                                className="accent-[#6B7D60]"
                              />
                            </label>
                          ))
                        )}
                      </div>
                    )}

                    <div className="mt-4">
                      <label className="text-sm font-semibold text-dark-700">Reason</label>
                      <textarea
                        rows={3}
                        value={cancelModal.reason}
                        onChange={(e) =>
                          setCancelModal((prev) =>
                            prev ? { ...prev, reason: e.target.value } : prev
                          )
                        }
                        placeholder="Please tell us why you want to cancel this order"
                        className="mt-2 input-field resize-none"
                      />
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button
                        type="button"
                        onClick={closeCancelModal}
                        className="btn-ghost flex-1 border border-[#E6E2D6]"
                        disabled={cancelSubmitting}
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelOrder}
                        className="btn-primary flex-1 disabled:opacity-60"
                        disabled={cancelSubmitting}
                      >
                        {cancelSubmitting ? 'Processing...' : 'Confirm Cancellation'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {reviewModal &&
                (() => {
                  const reviewKey = getReviewKey(
                    reviewModal.orderId,
                    reviewModal.item.productId
                  );
                  const draft = getReviewDraft(reviewKey);
                  const attachments = getReviewAttachments(reviewKey);
                  const existingImages = getReviewExistingImages(reviewKey);
                  const isSubmitting = !!reviewSubmitting[reviewKey];
                  const existingReviewId = getReviewId(reviewKey);
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
                                    onClick={() => updateReviewDraft(reviewKey, { rating: star })}
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

                          <div>
                            <textarea
                              placeholder="Please write product review here."
                              value={draft.body}
                              onChange={(e) =>
                                updateReviewDraft(reviewKey, { body: e.target.value })
                              }
                              className="input-field h-40 resize-none"
                            />
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <label className="relative h-14 w-14 rounded-lg border border-dashed border-[#CFC8B4] bg-[#F9F8F4] flex items-center justify-center cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) =>
                                  updateReviewAttachments(
                                    reviewKey,
                                    'images',
                                    e.target.files || []
                                  )
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
                                  onClick={() => removeExistingReviewImage(reviewKey, index)}
                                  className="absolute -top-2 -right-2 z-20 h-5 w-5 rounded-full bg-[#6B7D60] text-white flex items-center justify-center shadow ring-2 ring-white"
                                  aria-label="Remove existing photo"
                                >
                                  <FiX size={12} />
                                </button>
                              </div>
                            ))}
                            {attachments.images.map((file, index) => (
                              <div
                                key={`${file.name}-${index}`}
                                className="relative h-14 w-14 overflow-visible"
                              >
                                <div className="h-full w-full rounded-lg overflow-hidden border border-[#E6E2D6] bg-white">
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt="Review upload"
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeReviewAttachment(reviewKey, 'images', index)
                                  }
                                  className="absolute -top-2 -right-2 z-20 h-5 w-5 rounded-full bg-[#6B7D60] text-white flex items-center justify-center shadow ring-2 ring-white"
                                  aria-label="Remove photo"
                                >
                                  <FiX size={12} />
                                </button>
                              </div>
                            ))}
                          </div>

                          <p className="text-[11px] text-dark-500">
                            By submitting review you give us consent to publish and process
                            personal information in accordance with our policies.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-3 px-6 py-4 border-t border-[#E6E2D6] bg-white">
                          <button
                            type="button"
                            onClick={closeReviewModal}
                            className="btn-ghost border border-[#E6E2D6]"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleSubmitReview(reviewModal.orderId, reviewModal.item)
                            }
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

              {/* Appointments Tab */}
              {activeTab === 'appointments' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-display font-bold text-dark-900">My Appointments</h2>
                    <p className="text-dark-500">View upcoming visits and consultations</p>
                  </div>

                  {appointments.length === 0 ? (
                    <div className="text-center py-12">
                      <FiCalendar className="mx-auto text-dark-500 mb-4" size={48} />
                      <p className="text-dark-600">No appointments scheduled</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {appointments.map((appointment) => (
                        <motion.div
                          key={appointment.id}
                          whileHover={{ y: -2 }}
                          className="rounded-2xl border border-[#E6E2D6] bg-white p-5 shadow-sm"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-xs text-dark-500">Service</p>
                              <h3 className="text-lg font-semibold text-dark-900">
                                {appointment.serviceType.replace(/_/g, ' ')}
                              </h3>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                appointment.status
                              )}`}
                            >
                              {appointment.status.replace(/_/g, ' ')}
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-dark-600">
                            <div className="flex items-center gap-2">
                              <FiCalendar size={16} className="text-dark-400" />
                              <span>
                                {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}
                              </span>
                            </div>
                            <div className="text-sm text-dark-600">
                              Time: {appointment.appointmentTime}
                            </div>
                          </div>

                          {appointment.notes && (
                            <p className="mt-3 text-sm text-dark-500">Notes: {appointment.notes}</p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-display font-bold text-dark-900">My Profile</h2>
                    <p className="text-dark-500">Manage your personal information</p>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full bg-[#F2F0E8] text-[#6B7D60] flex items-center justify-center text-2xl font-semibold">
                        {profileInitials}
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-[#6B7D60] text-white flex items-center justify-center shadow">
                        <FiEdit2 size={14} />
                      </div>
                    </div>
                    {memberSince && (
                      <span className="px-4 py-1 rounded-full bg-[#F2F0E8] text-xs text-[#6B7D60]">
                        Member since {memberSince}
                      </span>
                    )}
                  </div>

                  <div className="rounded-2xl border border-[#E6E2D6] bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-dark-900">Profile Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="text-sm font-semibold text-dark-700 mb-2 block">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={profileForm.name}
                          onChange={handleProfileInputChange}
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-dark-700 mb-2 block">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profile?.email || user?.email || ''}
                          readOnly
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-dark-700 mb-2 block">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={profileForm.phone}
                          onChange={handleProfileInputChange}
                          inputMode="numeric"
                          pattern="\\d{10}"
                          maxLength={10}
                          className="input-field"
                        />
                        <p className="text-xs text-dark-500 mt-1">10 digits only</p>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-dark-700 mb-2 block">
                          Account Status
                        </label>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-4 py-2 rounded-full text-xs font-semibold ${
                              isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={handleProfileSave}
                        disabled={isProfileSaving}
                        className="btn-primary disabled:opacity-50"
                      >
                        {isProfileSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleProfileReset}
                        className="btn-ghost border border-[#6B7D60] text-[#6B7D60]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#E6E2D6] bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-dark-900">Change Password</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="text-sm font-semibold text-dark-700 mb-2 block">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.old ? 'text' : 'password'}
                            name="oldPassword"
                            value={passwordForm.oldPassword}
                            onChange={handlePasswordInputChange}
                            autoComplete="off"
                            className="input-field pr-10"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword((prev) => ({ ...prev, old: !prev.old }))
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-700"
                          >
                            {showPassword.old ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-dark-700 mb-2 block">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.next ? 'text' : 'password'}
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordInputChange}
                            autoComplete="new-password"
                            className="input-field pr-10"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword((prev) => ({ ...prev, next: !prev.next }))
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-700"
                          >
                            {showPassword.next ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                          </button>
                        </div>
                        {passwordForm.newPassword.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-dark-500">Password strength:</span>
                              <span
                                className={`font-medium ${
                                  passwordStrength.score <= 2
                                    ? 'text-red-500'
                                    : passwordStrength.score <= 4
                                    ? 'text-yellow-500'
                                    : 'text-green-500'
                                }`}
                              >
                                {passwordStrength.label}
                              </span>
                            </div>
                            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                style={{ width: `${passwordStrength.percentage}%` }}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-1 text-xs text-dark-600 mt-2">
                              <div
                                className={`flex items-center gap-1 ${
                                  passwordChecks.length ? 'text-green-500' : ''
                                }`}
                              >
                                {passwordChecks.length ? (
                                  <FiCheck size={12} />
                                ) : (
                                  <FiX size={12} />
                                )}
                                <span>8+ characters</span>
                              </div>
                              <div
                                className={`flex items-center gap-1 ${
                                  passwordChecks.lower ? 'text-green-500' : ''
                                }`}
                              >
                                {passwordChecks.lower ? (
                                  <FiCheck size={12} />
                                ) : (
                                  <FiX size={12} />
                                )}
                                <span>Lowercase letter</span>
                              </div>
                              <div
                                className={`flex items-center gap-1 ${
                                  passwordChecks.upper ? 'text-green-500' : ''
                                }`}
                              >
                                {passwordChecks.upper ? (
                                  <FiCheck size={12} />
                                ) : (
                                  <FiX size={12} />
                                )}
                                <span>Uppercase letter</span>
                              </div>
                              <div
                                className={`flex items-center gap-1 ${
                                  passwordChecks.number ? 'text-green-500' : ''
                                }`}
                              >
                                {passwordChecks.number ? (
                                  <FiCheck size={12} />
                                ) : (
                                  <FiX size={12} />
                                )}
                                <span>Number</span>
                              </div>
                              <div
                                className={`flex items-center gap-1 ${
                                  passwordChecks.special ? 'text-green-500' : ''
                                }`}
                              >
                                {passwordChecks.special ? (
                                  <FiCheck size={12} />
                                ) : (
                                  <FiX size={12} />
                                )}
                                <span>Special character</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-dark-700 mb-2 block">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.confirm ? 'text' : 'password'}
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordInputChange}
                            autoComplete="new-password"
                            className="input-field pr-10"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-700"
                          >
                            {showPassword.confirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                          </button>
                        </div>
                        {passwordForm.confirmPassword &&
                          passwordForm.newPassword &&
                          !getPasswordError(passwordForm.newPassword) &&
                          passwordForm.confirmPassword === passwordForm.newPassword && (
                            <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                              <FiCheck size={12} /> Passwords match
                            </p>
                          )}
                        {passwordForm.confirmPassword &&
                          passwordForm.newPassword &&
                          passwordForm.confirmPassword !== passwordForm.newPassword && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <FiX size={12} /> Passwords do not match
                            </p>
                          )}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={handleChangePassword}
                        disabled={isPasswordSaving}
                        className="btn-primary disabled:opacity-50"
                      >
                        {isPasswordSaving ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-display font-bold text-dark-900">My Addresses</h2>
                      <p className="text-dark-500">Manage your shipping addresses</p>
                    </div>
                    <button
                      className="btn-primary flex items-center gap-2"
                      onClick={() => (isAddressFormOpen ? handleAddressCancel() : handleOpenAddAddress())}
                    >
                      <FiPlus size={16} />
                      {isAddressFormOpen ? 'Close' : 'Add New Address'}
                    </button>
                  </div>

                  {isAddressFormOpen && (
                    <div className="rounded-2xl border border-[#E6E2D6] bg-white p-6 shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="text-sm font-semibold text-dark-700 mb-2 block">
                            Address Line 1 *
                          </label>
                          <input
                            type="text"
                            name="addressLine1"
                            value={addressForm.addressLine1}
                            onChange={handleAddressInputChange}
                            className="input-field"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-sm font-semibold text-dark-700 mb-2 block">
                            Address Line 2
                          </label>
                          <input
                            type="text"
                            name="addressLine2"
                            value={addressForm.addressLine2 || ''}
                            onChange={handleAddressInputChange}
                            className="input-field"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-dark-700 mb-2 block">
                            City *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={addressForm.city}
                            onChange={handleAddressInputChange}
                            className="input-field"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-dark-700 mb-2 block">
                            State *
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={addressForm.state}
                            onChange={handleAddressInputChange}
                            className="input-field"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-dark-700 mb-2 block">
                            Postal Code *
                          </label>
                          <input
                            type="text"
                            name="postalCode"
                            value={addressForm.postalCode}
                            onChange={handleAddressInputChange}
                            className="input-field"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-dark-700 mb-2 block">
                            Country *
                          </label>
                          <input
                            type="text"
                            name="country"
                            value={addressForm.country}
                            onChange={handleAddressInputChange}
                            className="input-field"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-sm font-semibold text-dark-700 mb-2 block">
                            Contact Phone *
                          </label>
                          <input
                            type="tel"
                            name="contactPhone"
                            value={addressForm.contactPhone}
                            onChange={handleAddressInputChange}
                            inputMode="numeric"
                            pattern="\\d{10}"
                            maxLength={10}
                            className="input-field"
                          />
                          <p className="text-xs text-dark-500 mt-1">10 digits only</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          onClick={handleAddressSave}
                          disabled={isAddressSaving}
                          className="btn-primary disabled:opacity-50"
                        >
                          {isAddressSaving
                            ? 'Saving...'
                            : editingAddressId
                            ? 'Update Address'
                            : 'Save Address'}
                        </button>
                        <button onClick={handleAddressCancel} className="btn-ghost">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {orderedAddresses.length === 0 && (
                      <div className="col-span-full text-sm text-dark-600">
                        No saved addresses yet.
                      </div>
                    )}
                    {orderedAddresses.map((address, index) => (
                      <div
                        key={address.id}
                        className="relative rounded-2xl border border-[#E6E2D6] bg-white p-5 shadow-sm"
                      >
                        {address.isDefault && (
                          <span className="absolute -top-3 left-4 px-3 py-1 rounded-full bg-[#6B7D60] text-white text-xs font-semibold">
                            Default
                          </span>
                        )}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-[#F2F0E8] text-[#6B7D60] flex items-center justify-center">
                              <FiMapPin size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-dark-900">
                                Address {index + 1}
                              </p>
                              <p className="text-xs text-dark-500">
                                {address.isDefault ? 'Default address' : 'Saved address'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              className="p-2 rounded-full hover:bg-[#F2F0E8]"
                              onClick={() => handleEditAddress(address)}
                            >
                              <FiEdit2 size={14} className="text-dark-600" />
                            </button>
                            {!address.isDefault && (
                              <button
                                className="p-2 rounded-full hover:bg-red-50"
                                onClick={() => handleDeleteAddress(address.id)}
                                disabled={deletingAddressId === address.id}
                              >
                                {deletingAddressId === address.id ? (
                                  <span className="text-xs text-red-500">...</span>
                                ) : (
                                  <FiX size={16} className="text-red-500" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 space-y-1 text-sm text-dark-700">
                          <p>{address.addressLine1}</p>
                          {address.addressLine2 && <p>{address.addressLine2}</p>}
                          <p>
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                          <p>{address.country}</p>
                          <p className="text-xs text-dark-500">
                            Phone: {address.contactPhone || profile?.phone || user?.phone || 'N/A'}
                          </p>
                        </div>

                        {!address.isDefault && (
                          <button
                            className="mt-4 w-full btn-ghost border border-[#6B7D60] text-[#6B7D60]"
                            onClick={() => handleSetDefaultAddress(address.id)}
                          >
                            Set as Default
                          </button>
                        )}
                      </div>
                    ))}

                    {!isAddressFormOpen && (
                      <button
                        type="button"
                        onClick={handleOpenAddAddress}
                        className="rounded-2xl border-2 border-dashed border-[#E6E2D6] bg-white p-6 text-center text-dark-600 hover:border-[#6B7D60] hover:text-[#6B7D60]"
                      >
                        <div className="mx-auto h-12 w-12 rounded-full bg-[#F2F0E8] text-[#6B7D60] flex items-center justify-center mb-3">
                          <FiPlus size={22} />
                        </div>
                        <p className="text-sm font-semibold">Add New Address</p>
                        <p className="text-xs text-dark-500 mt-1">Save a new shipping address</p>
                      </button>
                    )}
                  </div>

                  <div className="rounded-2xl bg-[#F6F4EC] border border-[#E6E2D6] p-4 text-sm text-dark-600">
                    <span className="font-semibold text-dark-800">Doorstep Service Available</span>
                    <p className="mt-1 text-xs text-dark-500">
                      Our tailor will visit your address for measurements in select areas.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )}
  </div>
</div>

  );
};

export default UserDashboard;
