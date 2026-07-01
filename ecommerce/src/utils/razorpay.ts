export type RazorpayPaymentSuccessResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export type PaymentStatusType = 'success' | 'failed' | 'cancelled';

export type PaymentStatusState = {
  status: PaymentStatusType;
  orderId: number;
  amount: number;
  currency: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  failureReason?: string;
  attemptedAt: string;
};

export type RazorpayInstance = {
  open: () => void;
  on: (eventName: string, handler: (response: unknown) => void) => void;
};

export type RazorpayCheckoutOptions = {
  key: string;
  order_id: string;
  name: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  handler: (response: RazorpayPaymentSuccessResponse) => void | Promise<void>;
  modal?: {
    ondismiss?: () => void;
  };
};

export type RazorpayConstructor = new (options: RazorpayCheckoutOptions) => RazorpayInstance;

const RAZORPAY_SCRIPT_ID = 'razorpay-checkout-js';

export const loadRazorpayScript = (): Promise<boolean> =>
  new Promise((resolve) => {
    if (getRazorpayConstructor()) {
      resolve(true);
      return;
    }

    const existingScript = document.getElementById(RAZORPAY_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), { once: true });
      existingScript.addEventListener('error', () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = RAZORPAY_SCRIPT_ID;
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export const getRazorpayConstructor = (): RazorpayConstructor | null => {
  const maybeRazorpay = (
    window as Window & {
      Razorpay?: RazorpayConstructor;
    }
  ).Razorpay;

  return maybeRazorpay ?? null;
};

export const getRazorpayFailureReason = (response: unknown): string => {
  if (
    typeof response === 'object' &&
    response !== null &&
    'error' in response &&
    typeof (response as { error?: { description?: string } }).error?.description === 'string'
  ) {
    return (response as { error: { description: string } }).error.description;
  }

  return 'Payment failed';
};

