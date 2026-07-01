import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiCheckCircle, FiClock, FiCreditCard, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Navbar from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useAppDispatch, useAppSelector } from '../../hooks/useAuth';
import { useAuth } from '../../hooks/useAuth';
import { clearCart } from '../../store/slices/cartSlice';
import cartApi from '../../api/cartApi';
import { orderApi } from '../../api/orderApi';
import { formatINR } from '../../utils/currency';
import {
  getRazorpayConstructor,
  getRazorpayFailureReason,
  loadRazorpayScript,
  type PaymentStatusState,
  type RazorpayPaymentSuccessResponse,
} from '../../utils/razorpay';

const PAYMENT_STATUS_STORAGE_KEY = 'latestPaymentStatus';

const parsePaymentStatusState = (value: unknown): PaymentStatusState | null => {
  if (!value || typeof value !== 'object') return null;

  const candidate = value as Partial<PaymentStatusState>;
  if (
    typeof candidate.orderId !== 'number' ||
    typeof candidate.amount !== 'number' ||
    typeof candidate.currency !== 'string' ||
    typeof candidate.razorpayOrderId !== 'string' ||
    typeof candidate.attemptedAt !== 'string'
  ) {
    return null;
  }

  if (
    candidate.status !== 'success' &&
    candidate.status !== 'failed' &&
    candidate.status !== 'cancelled'
  ) {
    return null;
  }

  return candidate as PaymentStatusState;
};

const getStoredPaymentState = (): PaymentStatusState | null => {
  const raw = sessionStorage.getItem(PAYMENT_STATUS_STORAGE_KEY);
  if (!raw) return null;
  try {
    return parsePaymentStatusState(JSON.parse(raw));
  } catch {
    return null;
  }
};

const PaymentStatusPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { items } = useAppSelector((state) => state.cart);
  const [retrying, setRetrying] = useState(false);
  const [paymentState, setPaymentState] = useState<PaymentStatusState | null>(() => {
    return parsePaymentStatusState(location.state) || getStoredPaymentState();
  });

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

  useEffect(() => {
    const fromRoute = parsePaymentStatusState(location.state);
    if (!fromRoute) return;
    setPaymentState(fromRoute);
    sessionStorage.setItem(PAYMENT_STATUS_STORAGE_KEY, JSON.stringify(fromRoute));
  }, [location.state]);

  useEffect(() => {
    if (paymentState) return;
    toast.error('Payment details were not found');
    navigate('/checkout', { replace: true });
  }, [navigate, paymentState]);

  const updatePaymentState = (nextState: PaymentStatusState) => {
    sessionStorage.setItem(PAYMENT_STATUS_STORAGE_KEY, JSON.stringify(nextState));
    setPaymentState(nextState);
    navigate('/payment-status', { replace: true, state: nextState });
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
    } catch (error) {
      console.warn('Payment verified, but failed to fully clear server cart.', error);
    }
  };

  const handleRetryPayment = async () => {
    if (!paymentState) return;

    const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKeyId || razorpayKeyId === 'your_razorpay_key_id') {
      toast.error('Razorpay key is not configured in .env');
      return;
    }

    setRetrying(true);
    try {
      const paymentInit = await orderApi.initiatePayment(paymentState.orderId);

      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded || !getRazorpayConstructor()) {
        throw new Error('Failed to load Razorpay checkout');
      }

      sessionStorage.setItem('razorpayOrderId', paymentInit.razorpayOrderId);
      sessionStorage.setItem('orderId', String(paymentState.orderId));
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
          orderId: paymentState.orderId,
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
          description: `Order #${paymentState.orderId}`,
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: user?.phone || '',
          },
          notes: {
            orderId: String(paymentState.orderId),
          },
          theme: {
            color: '#6B7D60',
          },
          handler: async (response: RazorpayPaymentSuccessResponse) => {
            if (!markHandled()) return;
            try {
              await orderApi.verifyPayment(paymentState.orderId, {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              await clearServerCartAfterOrder();
              dispatch(clearCart());
              toast.success('Payment successful!');
              sessionStorage.removeItem(PAYMENT_STATUS_STORAGE_KEY);
              navigate(`/orders/${paymentState.orderId}`, { replace: true });
              resolve();
            } catch (error) {
              reject(error);
            }
          },
          modal: {
            ondismiss: () => {
              if (!markHandled()) return;
              updatePaymentState(buildPaymentState('cancelled', 'Payment was cancelled by user'));
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
          updatePaymentState(buildPaymentState('failed', reason));
          resolve();
        });
        razorpayInstance.open();
      });
    } catch (error: unknown) {
      const { status, message } = getApiErrorDetails(error);
      const normalizedMessage = message.toLowerCase();
      const isStockConflict =
        status === 409 ||
        normalizedMessage.includes('modified by another request') ||
        normalizedMessage.includes('stock');

      if (isStockConflict) {
        toast.error('Stock changed. Please review your cart and place order again.');
        navigate('/cart');
      } else {
        toast.error(message || 'Failed to retry payment');
      }
    } finally {
      setRetrying(false);
    }
  };

  if (!paymentState) return null;

  const isSuccess = paymentState.status === 'success';
  const isCancelled = paymentState.status === 'cancelled';
  const statusTitle = isSuccess
    ? 'Payment Successful'
    : isCancelled
      ? 'Payment Cancelled'
      : 'Payment Failed';
  const statusDescription = isSuccess
    ? 'Your payment has been captured and your order is confirmed.'
    : 'Your order is still pending payment. You can retry now.';

  return (
    <div className="min-h-screen bg-[#F6F4EC]">
      <Navbar />
      <div className="px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-sage/20 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-3">
            {isSuccess ? (
              <FiCheckCircle className="mt-1 h-7 w-7 text-green-600" />
            ) : (
              <FiAlertCircle className="mt-1 h-7 w-7 text-red-500" />
            )}
            <div>
              <h1 className="text-2xl font-bold text-dark-900">{statusTitle}</h1>
              <p className="mt-1 text-sm text-dark-600">{statusDescription}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-sage/15 bg-sage/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-dark-500">Order ID</p>
              <p className="mt-1 text-base font-semibold text-dark-900">#{paymentState.orderId}</p>
            </div>
            <div className="rounded-xl border border-sage/15 bg-sage/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-dark-500">Amount</p>
              <p className="mt-1 text-base font-semibold text-dark-900">
                {formatINR(paymentState.amount)}
              </p>
            </div>
            <div className="rounded-xl border border-sage/15 bg-sage/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-dark-500">
                Razorpay Order ID
              </p>
              <p className="mt-1 break-all text-sm font-medium text-dark-900">
                {paymentState.razorpayOrderId}
              </p>
            </div>
            <div className="rounded-xl border border-sage/15 bg-sage/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-dark-500">
                Payment ID
              </p>
              <p className="mt-1 break-all text-sm font-medium text-dark-900">
                {paymentState.razorpayPaymentId || 'Not captured'}
              </p>
            </div>
            <div className="rounded-xl border border-sage/15 bg-sage/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-dark-500">Status</p>
              <p className="mt-1 text-base font-semibold capitalize text-dark-900">
                {paymentState.status}
              </p>
            </div>
            <div className="rounded-xl border border-sage/15 bg-sage/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-dark-500">Time</p>
              <p className="mt-1 text-sm font-medium text-dark-900">
                {new Date(paymentState.attemptedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {!isSuccess && paymentState.failureReason && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Reason: {paymentState.failureReason}
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {isSuccess ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/orders/${paymentState.orderId}`)}
                  className="inline-flex items-center gap-2 rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage/90"
                >
                  <FiCreditCard className="h-4 w-4" />
                  View Order Details
                </motion.button>
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="inline-flex items-center gap-2 rounded-full border border-sage/35 px-5 py-2.5 text-sm font-semibold text-sage hover:bg-sage/10"
                >
                  Continue Shopping
                </button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: retrying ? 1 : 1.01 }}
                  whileTap={{ scale: retrying ? 1 : 0.98 }}
                  onClick={handleRetryPayment}
                  disabled={retrying}
                  className="inline-flex items-center gap-2 rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiRefreshCw className={`h-4 w-4 ${retrying ? 'animate-spin' : ''}`} />
                  {retrying ? 'Retrying...' : 'Retry Payment'}
                </motion.button>
                <button
                  type="button"
                  onClick={() => navigate('/checkout')}
                  className="inline-flex items-center gap-2 rounded-full border border-sage/35 px-5 py-2.5 text-sm font-semibold text-sage hover:bg-sage/10"
                >
                  <FiClock className="h-4 w-4" />
                  Back to Checkout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentStatusPage;
