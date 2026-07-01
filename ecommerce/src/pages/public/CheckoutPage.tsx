import { useEffect, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiBriefcase,
  FiEdit2,
  FiHome,
  FiLock,
  FiMapPin,
  FiPlus,
  FiTrash2,
  FiX,
} from 'react-icons/fi';
import Navbar from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useAppSelector, useAppDispatch } from '../../hooks/useAuth';
import { useAuth } from '../../hooks/useAuth';
import { clearCart } from '../../store/slices/cartSlice';
import { orderApi } from '../../api/orderApi';
import cartApi from '../../api/cartApi';
import {
  userProfileApi,
  type AddressPayload,
  type UserAddress,
} from '../../api/userProfileApi';
import { formatINR } from '../../utils/currency';
import {
  getRazorpayConstructor,
  getRazorpayFailureReason,
  loadRazorpayScript,
  type PaymentStatusState,
  type RazorpayPaymentSuccessResponse,
} from '../../utils/razorpay';
import toast from 'react-hot-toast';

const PAYMENT_STATUS_STORAGE_KEY = 'latestPaymentStatus';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const IMAGE_BASE_URL =
  import.meta.env.VITE_API_IMG_URL ||
  (API_BASE_URL ? API_BASE_URL.replace(/\/api\/?$/i, '') : 'http://localhost:8090');

type AddressType = 'HOME' | 'WORK' | 'OTHER';

type AddressMeta = {
  contactName: string;
  landmark?: string;
  addressType: AddressType;
};

type AddressFormState = AddressPayload & {
  contactName: string;
  landmark: string;
  addressType: AddressType;
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAuth();
  const { items, totalPrice } = useAppSelector((state) => state.cart);

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [formData, setFormData] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: user?.phone || '',
  });

  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null);
  const [defaultAddress, setDefaultAddress] = useState<UserAddress | null>(null);
  const [activeAddressId, setActiveAddressId] = useState<number | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddEditAddressModal, setShowAddEditAddressModal] = useState(false);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [isAddressSaving, setIsAddressSaving] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [deletingAddressId, setDeletingAddressId] = useState<number | null>(null);
  const [addressMeta, setAddressMeta] = useState<Record<number, AddressMeta>>({});
  const [shippingCharges, setShippingCharges] = useState(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [addressForm, setAddressForm] = useState<AddressFormState>({
    contactName: user?.name || '',
    contactPhone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false,
    landmark: '',
    addressType: 'HOME',
  });

  const finalTotal = totalPrice + shippingCharges;

  const addressTypeOptions = [
    { value: 'HOME' as const, label: 'Home', icon: FiHome },
    { value: 'WORK' as const, label: 'Work', icon: FiBriefcase },
    { value: 'OTHER' as const, label: 'Other', icon: FiMapPin },
  ];

  const normalizePhone = (value: string) => value.replace(/\\D/g, '').slice(0, 10);
  const normalizePincode = (value: string) => value.replace(/\\D/g, '').slice(0, 6);

  const getApiErrorDetails = (error: unknown) => {
    if (error && typeof error === 'object') {
      const candidate = error as {
        status?: unknown;
        message?: unknown;
        error?: unknown;
      };
      const status =
        typeof candidate.status === 'number' ? candidate.status : undefined;
      const message =
        typeof candidate.message === 'string'
          ? candidate.message
          : typeof candidate.error === 'string'
            ? candidate.error
            : '';
      return { status, message };
    }
    return { status: undefined, message: '' };
  };

  const getCartItemImageUrl = (path?: string) => {
    if (!path) return '/placeholder.jpg';
    if (path.startsWith('http') || path.startsWith('blob:')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${IMAGE_BASE_URL}${cleanPath}`;
  };

  const getAddressMeta = (address: UserAddress): AddressMeta => {
    if (addressMeta[address.id]) return addressMeta[address.id];
    return {
      contactName: user?.name || 'Customer',
      landmark: '',
      addressType: address.isDefault ? 'HOME' : 'OTHER',
    };
  };

  const resetAddressForm = (overrides: Partial<AddressFormState> = {}) => {
    setAddressForm({
      contactName: user?.name || '',
      contactPhone: user?.phone || '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      isDefault: false,
      landmark: '',
      addressType: 'HOME',
      ...overrides,
    });
  };

  const loadAddresses = async () => {
    if (!user?.id) return;
    setIsAddressLoading(true);
    try {
      const response = await userProfileApi.getAddresses(user.id);
      setAddresses(response);
    } catch (error) {
      toast.error('Failed to load addresses');
    } finally {
      setIsAddressLoading(false);
    }
  };

  const calculateShipping = async (address?: UserAddress) => {
    const targetAddress = address || selectedAddress;
    if (!targetAddress) return;

    setIsCalculatingShipping(true);
    try {
      const response = await orderApi.calculateShipping({
        address: {
          addressLine1: targetAddress.addressLine1,
          addressLine2: targetAddress.addressLine2 || '',
          city: targetAddress.city,
          state: targetAddress.state,
          postalCode: targetAddress.postalCode,
          country: targetAddress.country || 'India',
          contactPhone: targetAddress.contactPhone || '',
        },
        subtotal: totalPrice,
      });
      setShippingCharges(response.shippingCharges);
    } catch (error: any) {
      console.warn('Failed to calculate shipping', error);
      // Fallback to 0 shipping if calculation fails
      setShippingCharges(0);
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;
    loadAddresses();
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      ...prev,
      phone: prev.phone || user.phone || '',
    }));
    setAddressForm((prev) => ({
      ...prev,
      contactName: prev.contactName || user.name || '',
      contactPhone: prev.contactPhone || user.phone || '',
    }));
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (addresses.length === 0) {
      setDefaultAddress(null);
      setSelectedAddress(null);
      setActiveAddressId(null);
      return;
    }

    const defaultAddr = addresses.find((addr) => addr.isDefault) ?? addresses[0];
    setDefaultAddress(defaultAddr ?? null);

    setSelectedAddress((prev) => {
      if (prev && addresses.some((addr) => addr.id === prev.id)) return prev;
      return defaultAddr ?? null;
    });

    setActiveAddressId((prev) => {
      if (prev && addresses.some((addr) => addr.id === prev)) return prev;
      if (selectedAddress && addresses.some((addr) => addr.id === selectedAddress.id)) {
        return selectedAddress.id;
      }
      return defaultAddr?.id ?? null;
    });
  }, [addresses, isAuthenticated, selectedAddress]);

  useEffect(() => {
    if (!selectedAddress) return;
    setFormData({
      addressLine1: selectedAddress.addressLine1,
      addressLine2: selectedAddress.addressLine2 || '',
      city: selectedAddress.city,
      state: selectedAddress.state,
      postalCode: selectedAddress.postalCode,
      country: selectedAddress.country || '',
      phone: selectedAddress.contactPhone || user?.phone || '',
    });
  }, [selectedAddress, user?.phone]);

  useEffect(() => {
    const isOverlayOpen = showAddressModal || showAddEditAddressModal;
    if (isOverlayOpen) {
      document.body.style.overflow = 'hidden';
      return;
    }
    document.body.style.overflow = '';
  }, [showAddressModal, showAddEditAddressModal]);

  useEffect(() => {
    if (paymentMethod === 'razorpay') {
      void loadRazorpayScript();
    }
  }, [paymentMethod]);

  // Calculate shipping when selected address or items change
  useEffect(() => {
    calculateShipping();
  }, [selectedAddress, items.length, totalPrice]);

  const openAddressModal = () => {
    if (addresses.length === 0) {
      setShowAddressModal(true);
      setShowAddEditAddressModal(true);
      return;
    }
    const fallback = selectedAddress ?? defaultAddress ?? addresses[0] ?? null;
    if (fallback) {
      setActiveAddressId(fallback.id);
    } else {
      setActiveAddressId(null);
    }
    setShowAddressModal(true);
    setShowAddEditAddressModal(false);
  };

  const closeAddressOverlay = () => {
    setShowAddressModal(false);
    setShowAddEditAddressModal(false);
  };

  const validateForm = () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      openAddressModal();
      return false;
    }
    if (!formData.addressLine1 || !formData.city || !formData.state || !formData.postalCode) {
      toast.error('Please fill in all required address fields');
      return false;
    }
    if (!formData.phone) {
      toast.error('Please provide a phone number');
      return false;
    }
    if (formData.phone.length !== 10) {
      toast.error('Phone number must be exactly 10 digits');
      return false;
    }
    return true;
  };


  const clearServerCartAfterOrder = async () => {
    try {
      const localBackendItemIds = Array.from(
        new Set(items.map((item) => Number(item.itemId)).filter((id) => Number.isFinite(id) && id > 0))
      );

      let backendItemIds = localBackendItemIds;
      if (backendItemIds.length === 0) {
        const cartResponse = await cartApi.getCart();
        backendItemIds = (cartResponse?.items || [])
          .map((item: { id: number }) => Number(item.id))
          .filter((id: number) => Number.isFinite(id) && id > 0);
      }

      if (backendItemIds.length > 0) {
        await Promise.allSettled(backendItemIds.map((itemId) => cartApi.removeItem(itemId)));
      }
    } catch (cartClearError) {
      console.warn('Order placed, but failed to fully clear server cart.', cartClearError);
    }
  };

  const navigateToPaymentStatus = (paymentState: PaymentStatusState) => {
    sessionStorage.setItem(PAYMENT_STATUS_STORAGE_KEY, JSON.stringify(paymentState));
    navigate('/payment-status', { state: paymentState });
  };

  const finalizeSuccessfulOrder = async (orderId: number) => {
    await clearServerCartAfterOrder();
    dispatch(clearCart());
    toast.success('Order placed successfully!');
    navigate(`/orders/${orderId}`);
  };

  const handlePlaceOrder = async () => {
    // Create order and proceed based on selected payment mode
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      const shippingAddress = {
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || undefined,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        contactPhone: formData.phone,
      };

      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
        })),
        shippingAddress,
        paymentMethod: paymentMethod === 'razorpay' ? 'RAZORPAY' : 'COD',
        shippingCharges,
      };

      const paymentMethodType: "RAZORPAY" | "COD" = paymentMethod === "razorpay" ? "RAZORPAY" : "COD";
      const orderDataWithType = { ...orderData, paymentMethod: paymentMethodType };
      const order = await orderApi.createOrder(orderDataWithType);

      if (paymentMethod === 'razorpay') {
        const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (!razorpayKeyId || razorpayKeyId === 'your_razorpay_key_id') {
          throw new Error('Razorpay key is not configured in .env');
        }

        const paymentInit = await orderApi.initiatePayment(order.id);

        const razorpayLoaded = await loadRazorpayScript();
        if (!razorpayLoaded || !getRazorpayConstructor()) {
          throw new Error('Failed to load Razorpay checkout');
        }

        sessionStorage.setItem('razorpayOrderId', paymentInit.razorpayOrderId);
        sessionStorage.setItem('orderId', String(order.id));
        sessionStorage.setItem('amount', String(paymentInit.amount));
        await new Promise<void>((resolve, reject) => {
          let paymentFlowHandled = false;
          const markHandled = () => {
            if (paymentFlowHandled) return false;
            paymentFlowHandled = true;
            return true;
          };

          const buildPaymentState = (
            status: PaymentStatusState['status'],
            failureReason?: string
          ): PaymentStatusState => ({
            status,
            orderId: order.id,
            amount: paymentInit.amount,
            currency: paymentInit.currency,
            razorpayOrderId: paymentInit.razorpayOrderId,
            failureReason,
            attemptedAt: new Date().toISOString(),
          });

          const options = {
            key: razorpayKeyId,
            order_id: paymentInit.razorpayOrderId,
            name: 'STYLISTE',
            description: `Order #${order.id}`,
            prefill: {
              name: user?.name || '',
              email: user?.email || '',
              contact: formData.phone,
            },
            notes: {
              orderId: String(order.id),
            },
            theme: {
              color: '#6B7D60',
            },
            handler: async (response: RazorpayPaymentSuccessResponse) => {
              if (!markHandled()) return;
              try {
                await orderApi.verifyPayment(order.id, {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                });
                await finalizeSuccessfulOrder(order.id);
                resolve();
              } catch (handlerError) {
                reject(handlerError);
              }
            },
            modal: {
              ondismiss: () => {
                if (!markHandled()) return;
                navigateToPaymentStatus(
                  buildPaymentState('cancelled', 'Payment was cancelled by user')
                );
                resolve();
              },
            },
          };

          const RazorpayConstructor = getRazorpayConstructor();
          if (!RazorpayConstructor) {
            reject(new Error('Failed to load Razorpay checkout'));
            return;
          }

          const razorpayInstance = new RazorpayConstructor(options);
          razorpayInstance.on('payment.failed', (response: unknown) => {
            if (!markHandled()) return;
            const reason = getRazorpayFailureReason(response);
            navigateToPaymentStatus(buildPaymentState('failed', reason));
            resolve();
          });
          razorpayInstance.open();
        });
        return;
      }

      await finalizeSuccessfulOrder(order.id);
    } catch (error: unknown) {
      const { status, message } = getApiErrorDetails(error);
      const normalizedMessage = message.toLowerCase();
      const isStockConflict =
        status === 409 ||
        normalizedMessage.includes('modified by another request') ||
        normalizedMessage.includes('stock');

      if (isStockConflict) {
        toast.error('Stock changed. Please review your cart and try again.');
        navigate('/cart');
      } else {
        toast.error(message || 'Failed to place order');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddressInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'contactPhone') {
      setAddressForm((prev) => ({ ...prev, contactPhone: normalizePhone(value) }));
      return;
    }
    if (name === 'postalCode') {
      setAddressForm((prev) => ({ ...prev, postalCode: normalizePincode(value) }));
      return;
    }
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateAddressForm = () => {
    if (!addressForm.contactName.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (
      !addressForm.addressLine1 ||
      !addressForm.addressLine2 ||
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
      toast.error('Mobile number must be exactly 10 digits');
      return false;
    }
    return true;
  };

  const handleAddressSave = async () => {
    if (!user?.id) return;
    if (!validateAddressForm()) return;

    setIsAddressSaving(true);
    try {
      const payload: AddressPayload = {
        addressLine1: addressForm.addressLine1.trim(),
        addressLine2: addressForm.addressLine2?.trim() || undefined,
        city: addressForm.city.trim(),
        state: addressForm.state.trim(),
        postalCode: addressForm.postalCode.trim(),
        country: addressForm.country || 'USA',
        contactPhone: addressForm.contactPhone.trim(),
        isDefault: addressForm.isDefault,
      };

      if (editingAddressId !== null) {
        const updated = await userProfileApi.updateAddress(user.id, editingAddressId, {
          ...payload,
          id: editingAddressId,
        });
        setAddresses((prev) => prev.map((addr) => (addr.id === updated.id ? updated : addr)));
        setAddressMeta((prev) => ({
          ...prev,
          [updated.id]: {
            contactName: addressForm.contactName.trim(),
            landmark: addressForm.landmark.trim(),
            addressType: addressForm.addressType,
          },
        }));
        setSelectedAddress(updated);
        toast.success('Address updated');
      } else {
        const created = await userProfileApi.addAddress(user.id, payload);
        setAddresses((prev) => [created, ...prev]);
        setAddressMeta((prev) => ({
          ...prev,
          [created.id]: {
            contactName: addressForm.contactName.trim(),
            landmark: addressForm.landmark.trim(),
            addressType: addressForm.addressType,
          },
        }));
        setSelectedAddress(created);
        toast.success('Address added');
      }

      setShowAddEditAddressModal(false);
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
    const meta = getAddressMeta(address);
    setEditingAddressId(address.id);
    setShowAddEditAddressModal(true);
    setShowAddressModal(true);
    setAddressForm({
      contactName: meta.contactName,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country || 'USA',
      contactPhone: address.contactPhone || user?.phone || '',
      isDefault: address.isDefault,
      landmark: meta.landmark || '',
      addressType: meta.addressType,
    });
  };

  const handleAddressCancel = () => {
    setShowAddEditAddressModal(false);
    setEditingAddressId(null);
    resetAddressForm();
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (!user?.id) return;
    const confirmed = window.confirm('Delete this address? This action cannot be undone.');
    if (!confirmed) return;

    setDeletingAddressId(addressId);
    try {
      await userProfileApi.deleteAddress(user.id, addressId);
      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
      setAddressMeta((prev) => {
        const next = { ...prev };
        delete next[addressId];
        return next;
      });
      if (selectedAddress?.id === addressId) {
        setSelectedAddress(null);
      }
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
    setShowAddressModal(true);
    setShowAddEditAddressModal(true);
  };

  const handleAddressSelect = (address: UserAddress) => {
    setActiveAddressId(address.id);
  };

  const handleDeliverHere = (addressId?: number) => {
    const resolvedId = addressId ?? activeAddressId;
    const address = addresses.find((addr) => addr.id === resolvedId);
    if (!address) {
      toast.error('Please select an address');
      return;
    }
    setActiveAddressId(resolvedId ?? null);
    setSelectedAddress(address);
    setShowAddressModal(false);
    setShowAddEditAddressModal(false);
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const orderedAddresses = [...addresses].sort((a, b) => {
    if (a.isDefault === b.isDefault) return 0;
    return a.isDefault ? -1 : 1;
  });
  const isAddressOverlayOpen = showAddressModal || showAddEditAddressModal;
  const selectedMeta = selectedAddress ? getAddressMeta(selectedAddress) : null;

  return (
    <div className="min-h-screen bg-[#F6F4EC]">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8  mx-auto">
        <h1 className="text-4xl font-display font-bold text-dark-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="rounded-2xl border border-sage/20 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center space-x-2">
                  <FiMapPin className="text-sage" size={24} />
                  <h2 className="text-xl font-bold text-dark-900">Shipping Address</h2>
                </div>
                {/* <button
                  type="button"
                  onClick={openAddressModal}
                  className="rounded-full border border-sage/40 px-4 py-2 text-sm font-semibold text-sage hover:bg-sage/10"
                >
                  {selectedAddress ? 'Change Address' : 'Select Delivery Address'}
                </button> */}
              </div>

              <div className="mb-6 rounded-xl border border-sage/20 bg-sage/5 p-4">
                {selectedAddress ? (
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-dark-900">
                          Deliver to {selectedMeta?.contactName || user?.name || 'Customer'}
                        </p>
                        {selectedAddress.isDefault && (
                          <span className="rounded-full bg-sage/20 px-2 py-0.5 text-xs font-semibold text-sage">
                            Default
                          </span>
                        )}
                        {selectedMeta?.addressType && (
                          <span className="rounded-full bg-sage/10 px-2 py-0.5 text-xs font-semibold text-sage/80">
                            {selectedMeta.addressType}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-dark-700">
                        {selectedAddress.addressLine1}
                        {selectedAddress.addressLine2 ? `, ${selectedAddress.addressLine2}` : ''}
                      </p>
                      <p className="text-xs text-dark-700">
                        {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}
                      </p>
                      {selectedMeta?.landmark && (
                        <p className="text-xs text-dark-600">Landmark: {selectedMeta.landmark}</p>
                      )}
                      <p className="text-xs text-dark-600">
                        Mobile: {selectedAddress.contactPhone || user?.phone || 'N/A'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={openAddressModal}
                      className="rounded-full border border-sage/30 px-4 py-2 text-xs font-semibold text-sage hover:bg-sage/10"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-dark-900">No address selected</p>
                      <p className="text-xs text-dark-600">
                        Choose a delivery address to continue with checkout.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={openAddressModal}
                      className="rounded-full bg-sage px-5 py-2 text-sm font-semibold text-white hover:bg-sage/90"
                    >
                      Select Delivery Address
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs font-semibold text-dark-700 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-sage text-[10px] text-white">
                      ✓
                    </span>
                    <span>{items.length}/{items.length} ITEMS SELECTED</span>
                  </div>
                  {/* <div className="text-[10px] uppercase tracking-wide text-dark-500">
                    REMOVE &nbsp;|&nbsp; MOVE TO WISHLIST
                  </div> */}
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-1">
                  {items.map((item) => {
                    const effectivePrice = item.salePrice || item.price;
                    const hasDiscount =
                      typeof item.salePrice === 'number' && item.salePrice < item.price;
                    const discountValue = hasDiscount && item.salePrice ? item.price - item.salePrice : 0;
                    const discountPercent = hasDiscount
                      ? Math.round((discountValue / item.price) * 100)
                      : 0;
                    return (
                      <div
                        key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`}
                        className="flex gap-3 rounded-xl border border-sage/15 bg-white p-3 shadow-sm"
                      >
                        <img
                          src={getCartItemImageUrl(item.image)}
                          alt={item.name}
                          className="w-20 h-24 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.jpg';
                          }}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-dark-900 line-clamp-1">
                            {item.name}
                          </div>
                          <div className="text-xs text-dark-500 line-clamp-1">
                            {item.selectedColor ? `Color: ${item.selectedColor}` : 'Premium Fabric'}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-dark-700">
                            {item.selectedSize && (
                              <span className="rounded border border-sage/30 px-2 py-0.5 font-semibold">
                                Size: {item.selectedSize}
                              </span>
                            )}
                            {item.selectedColor && (
                              <span className="rounded border border-sage/30 px-2 py-0.5 font-semibold">
                                Color: {item.selectedColor}
                              </span>
                            )}
                            <span className="rounded border border-sage/30 px-2 py-0.5 font-semibold">
                              Qty: {item.quantity}
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-bold text-dark-900">
                            <span>{formatINR(effectivePrice * item.quantity)}</span>
                            {hasDiscount && (
                              <>
                                <span className="text-xs font-semibold text-dark-400 line-through">
                                  {formatINR(item.price * item.quantity)}
                                </span>
                                <span className="text-xs font-semibold text-sage">
                                  {formatINR(discountValue * item.quantity)} OFF
                                  {discountPercent > 0 ? ` (${discountPercent}%)` : ''}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-2xl border border-sage/20 bg-white p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-6">
                <FiLock className="text-sage" size={24} />
                <h2 className="text-xl font-bold text-dark-900">Payment Method</h2>
              </div>

              <div className="space-y-3">
                <label
                  htmlFor="razorpay"
                  className={`flex items-center space-x-3 rounded-xl border p-4 transition ${
                    paymentMethod === 'razorpay'
                      ? 'border-sage bg-sage/10'
                      : 'border-sage/20 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    id="razorpay"
                    name="payment"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="accent-[#6B7D60]"
                  />
                  <div className="flex-1 cursor-pointer">
                    <div className="font-semibold text-dark-900">Razorpay</div>
                    <div className="text-sm text-dark-600">
                      Pay securely with Razorpay (Cards, UPI, Wallets)
                    </div>
                  </div>
                  <img
                    src="https://razorpay.com/assets/razorpay-glyph.svg"
                    alt="Razorpay"
                    className="h-8"
                  />
                </label>
                <label
                  htmlFor="cod"
                  className={`flex items-center space-x-3 rounded-xl border p-4 transition ${
                    paymentMethod === 'cod'
                      ? 'border-sage bg-sage/10'
                      : 'border-sage/20 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    id="cod"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-[#6B7D60]"
                  />
                  <div className="flex-1 cursor-pointer">
                    <div className="font-semibold text-dark-900">Cash on Delivery</div>
                    <div className="text-sm text-dark-600">
                      Pay with cash when your order is delivered.
                    </div>
                  </div>
                </label>

                <div className="rounded-xl border border-sage/20 bg-sage/10 p-4">
                  <p className="text-sm text-sage">
                    Your payment information is secure and encrypted
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Price Details */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-sage/20 bg-white p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-dark-900 mb-6">Price Details</h2>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 border-t border-sage/20 pt-4">
                <div className="flex justify-between text-dark-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatINR(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-dark-700">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {isCalculatingShipping ? (
                      <span className="text-dark-500 animate-pulse">Calculating...</span>
                    ) : shippingCharges === 0 ? (
                      <span className="text-sage">FREE</span>
                    ) : (
                      formatINR(shippingCharges)
                    )}
                  </span>
                </div>
                <div className="border-t border-sage/20 pt-3">
                  <div className="flex justify-between text-dark-900 text-xl font-bold">
                    <span>Total</span>
                    <span className="text-sage">{formatINR(finalTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlaceOrder}
                disabled={loading || !selectedAddress}
                className="w-full rounded-full bg-sage py-3 text-sm font-semibold text-white hover:bg-sage/90 disabled:opacity-50"
              >
                {loading ? 'Processing...' : `Place Order - ${formatINR(finalTotal)}`}
              </motion.button>

              {!selectedAddress && (
                <p className="text-xs text-sage text-center mt-3">
                  Select a delivery address to place your order.
                </p>
              )}

              <p className="text-xs text-dark-600 text-center mt-4">
                By placing your order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>

      {isAddressOverlayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border border-sage/20 bg-white text-dark-900 shadow-xl"
          >
            {showAddEditAddressModal ? (
              <div className="max-h-[85vh] overflow-y-auto p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-dark-900">
                      {editingAddressId ? 'Edit Address' : 'Add New Address'}
                    </h2>
                    <p className="text-sm text-dark-500">
                      Enter your delivery details exactly as you want them on the package.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeAddressOverlay}
                    className="p-2 rounded-full hover:bg-sage/10 text-dark-700"
                  >
                    <FiX size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-dark-700 mb-2 block">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      value={addressForm.contactName}
                      onChange={handleAddressInputChange}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-dark-700 mb-2 block">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={addressForm.contactPhone}
                      onChange={handleAddressInputChange}
                      inputMode="numeric"
                      maxLength={10}
                      className="input-field"
                    />
                    <p className="text-xs text-dark-500 mt-1">10 digits only</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-dark-700 mb-2 block">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={addressForm.postalCode}
                      onChange={handleAddressInputChange}
                      inputMode="numeric"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-dark-700 mb-2 block">
                      House / Flat / Block *
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
                      Area / Street *
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

                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-dark-700 mb-2 block">
                      Landmark
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={addressForm.landmark}
                      onChange={handleAddressInputChange}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-semibold text-dark-700 mb-2">Address Type</p>
                  <div className="flex flex-wrap gap-2">
                    {addressTypeOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = addressForm.addressType === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            setAddressForm((prev) => ({
                              ...prev,
                              addressType: option.value,
                            }))
                          }
                          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                            isSelected
                              ? 'border-sage bg-sage/10 text-sage'
                              : 'border-dark-200 text-dark-500 hover:border-sage/60'
                          }`}
                        >
                          <Icon size={14} />
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleAddressSave}
                    disabled={isAddressSaving}
                    className="rounded-full bg-sage px-6 py-2 text-sm font-semibold text-white hover:bg-sage/90 disabled:opacity-50"
                  >
                    {isAddressSaving
                      ? 'Saving...'
                      : editingAddressId
                      ? 'Update Address'
                      : 'Save Address'}
                  </button>
                  <button
                    type="button"
                    onClick={handleAddressCancel}
                    className="rounded-full border border-dark-200 px-6 py-2 text-sm font-semibold text-dark-600 hover:border-sage/60 hover:text-sage"
                  >
                    Cancel
                  </button>
                  {showAddressModal && (
                    <button
                      type="button"
                      onClick={() => setShowAddEditAddressModal(false)}
                      className="rounded-full border border-dark-200 px-6 py-2 text-sm font-semibold text-dark-600 hover:border-sage/60 hover:text-sage"
                    >
                      Back to Addresses
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="max-h-[85vh] overflow-y-auto p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-dark-900">
                      Select Delivery Address
                    </h2>
                    <p className="text-sm text-dark-500">
                      Choose where you want your order delivered.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeAddressOverlay}
                    className="p-2 rounded-full hover:bg-sage/10 text-dark-700"
                  >
                    <FiX size={18} />
                  </button>
                </div>


                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <p className="text-sm font-semibold text-dark-700">
                    SAVED ADDRESS
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenAddAddress}
                    className="rounded-full border border-sage/40 px-4 py-2 text-xs font-semibold text-sage hover:bg-sage/10 flex items-center gap-2"
                  >
                    <FiPlus size={14} />
                    Add New Address
                  </button>
                </div>

                {isAddressLoading && (
                  <div className="space-y-3">
                    {[...Array(2)].map((_, idx) => (
                      <div key={idx} className="h-24 rounded-xl bg-dark-100 animate-pulse" />
                    ))}
                  </div>
                )}

                {!isAddressLoading && orderedAddresses.length === 0 && (
                  <div className="rounded-xl border border-dashed border-sage/30 p-6 text-sm text-dark-600">
                    No saved addresses yet. Add a new address to continue.
                  </div>
                )}

                {!isAddressLoading && orderedAddresses.length > 0 && (
                  <div
                    className={`space-y-3 ${
                      orderedAddresses.length > 2
                        ? 'max-h-96 overflow-y-auto pr-2 custom-scrollbar'
                        : ''
                    }`}
                  >
                    {orderedAddresses.map((address) => {
                      const meta = getAddressMeta(address);
                      const isSelected = address.id === activeAddressId;
                      const isDeliveringHere = selectedAddress?.id === address.id;
                      return (
                        <div
                          key={address.id}
                          className={`rounded-xl border p-4 transition ${
                            isSelected
                              ? 'border-sage bg-sage/10'
                              : 'border-dark-200 bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="selectedAddress"
                              checked={isSelected}
                              onChange={() => handleAddressSelect(address)}
                              className="mt-1 accent-[#6B7D60]"
                            />
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-semibold text-dark-900">
                                  {meta.contactName || user?.name || 'Customer'}
                                </p>
                                {address.isDefault && (
                                  <span className="rounded-full bg-sage/20 px-2 py-0.5 text-xs font-semibold text-sage">
                                    Default
                                  </span>
                                )}
                                <span className="rounded-full bg-sage/10 px-2 py-0.5 text-xs font-semibold text-sage/80">
                                  {meta.addressType}
                                </span>
                              </div>
                              <div className="mt-2 space-y-1 text-xs text-dark-600">
                                <p>{address.addressLine1}</p>
                                {address.addressLine2 && <p>{address.addressLine2}</p>}
                                <p>
                                  {address.city}, {address.state} {address.postalCode}
                                </p>
                                <p>{address.country}</p>
                                {meta.landmark && <p>Landmark: {meta.landmark}</p>}
                                <p className="text-dark-500">
                                  Mobile: {address.contactPhone || user?.phone || 'N/A'}
                                </p>
                              </div>
                              <div className="mt-3 flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleDeliverHere(address.id)}
                                  disabled={isDeliveringHere}
                                  className={`rounded-full px-4 py-2 text-xs font-semibold ${
                                    isDeliveringHere
                                      ? 'bg-sage/20 text-sage'
                                      : 'bg-sage text-white hover:bg-sage/90'
                                  } disabled:opacity-50`}
                                >
                                  {isDeliveringHere ? 'Delivering Here' : 'Deliver Here'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEditAddress(address)}
                                  className="rounded-full border border-dark-200 px-4 py-2 text-xs font-semibold text-dark-600 hover:border-sage/60 hover:text-sage flex items-center gap-2"
                                >
                                  <FiEdit2 size={14} />
                                  Edit
                                </button>
                                {!address.isDefault && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteAddress(address.id)}
                                    disabled={deletingAddressId === address.id}
                                    className="rounded-full border border-dark-200 px-4 py-2 text-xs font-semibold text-red-600 hover:border-red-300 flex items-center gap-2 disabled:opacity-50"
                                  >
                                    <FiTrash2 size={14} />
                                    {deletingAddressId === address.id ? 'Deleting...' : 'Delete'}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleOpenAddAddress}
                  className="mt-6 w-full rounded-xl border-2 border-dashed border-sage/40 py-4 text-sm font-semibold text-dark-600 hover:border-sage hover:text-sage"
                >
                  ADD NEW ADDRESS
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CheckoutPage;
