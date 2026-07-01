import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import {
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

import logo from '../../assets/logo.png';
import heroOne from '../../assets/saree1.png';
import heroTwo from '../../assets/img1.png';
// import lehngaFront from '../../assets/jacket1.jpg';
// import sareeGown from '../../assets/saree-gown.jpg';

import { useAuth, useAppDispatch } from '../../hooks/useAuth';
import { login } from '../../store/slices/authSlice';
import { mergeGuestCartAfterLogin } from '../../utils/cartMerge';

type LoginLocationState = {
  prefillEmail?: string;
};

type Slide = {
  image: string;
  title: string;
  caption: string;
  position?: string;
};

const sliderImages: Slide[] = [
  {
    image: heroOne,
    // title: 'New Edit',
    // caption: 'Premium custom styling and tailoring for every occasion.',
    position: 'center',
    title: '',
    caption: ''
  },
  {
    image: heroTwo,
    title: '',
    caption: '',
    position: 'center',
  },
  // {
  //   image: lehngaFront,
  //   title: '',
  //   caption: '',
  //   position: 'center',
  // },
  // {
  //   image: sareeGown,
  //   title: 'Classic Revival',
  //   caption: 'Traditional saree art transformed into modern statement pieces.',
  //   position: 'center',
  // },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const formItemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

const FullPageLoader = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-sage/40 backdrop-blur-sm"
  >
    <motion.div
      initial={{ scale: 0.94, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-[220px] rounded-xl bg-white/90 p-6 shadow-xl"
    >
      <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-sage border-t-transparent" />
      <p className="text-center text-sm font-medium text-slate">Logging you in...</p>
    </motion.div>
  </motion.div>
);

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLoading, dispatch, isAdmin } = useAuth();
  const reduxDispatch = useAppDispatch();
  const locationState = location.state as LoginLocationState | null;
  const prefilledEmail =
    typeof locationState?.prefillEmail === 'string' ? locationState.prefillEmail : '';

  const [formData, setFormData] = useState({
    email: prefilledEmail,
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!loginSuccess || isLoading) {
      return;
    }

    if (isAdmin) {
      navigate('/admin', { replace: true });
      return;
    }

    navigate('/', { replace: true });
  }, [loginSuccess, isLoading, isAdmin, navigate]);

  useEffect(() => {
    if (searchParams.get('expired') === '1') {
      toast.error('Your session has expired. Please log in again.');
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 2000);

    return () => window.clearInterval(timer);
  }, []);

  const goToPreviousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const validateField = (name: keyof typeof formData, value: string) => {
    if (name === 'email') {
      if (!value) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
      return '';
    }

    if (name === 'password') {
      if (!value) return 'Password is required';
      if (value.length < 6) return 'Password must be at least 6 characters';
    }

    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = name as keyof typeof formData;

    setFormData((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  };

  const handleBlur = (field: keyof typeof formData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, formData[field]) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ email: true, password: true });

    const newErrors = {
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
    };

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(login(formData)).unwrap();
      await mergeGuestCartAfterLogin(reduxDispatch);
      toast.success('Login successful!');
      setLoginSuccess(true);
    } catch (error: unknown) {
      const message =
        typeof error === 'string'
          ? error
          : error instanceof Error
            ? error.message
            : 'Login failed';
      toast.error(message);
      setIsSubmitting(false);
    }
  };

  if (isLoading || isSubmitting) {
    return <FullPageLoader />;
  }

  const currentSlideData = sliderImages[currentSlide];
  const slideCount = String(sliderImages.length).padStart(2, '0');
  const slideNumber = String(currentSlide + 1).padStart(2, '0');

  return (
    <div className="h-[100dvh] overflow-hidden">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="show"
        className="relative h-full w-full overflow-hidden bg-black"
      >
        {sliderImages.map((slide, index) => (
          <motion.img
            key={slide.image}
            src={slide.image}
            alt={slide.title}
            style={{ objectPosition: slide.position ?? 'center' }}
            className="absolute inset-0 h-full w-full object-cover"
            initial={false}
            animate={{ opacity: index === currentSlide ? 1 : 0 }}
            transition={{ duration: 0.65, ease: 'easeInOut' }}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-white/88 via-white/72 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />

        <div className="relative z-10 grid h-full md:grid-cols-[1.08fr_0.92fr]">
          <section className="flex h-full flex-col justify-center px-4 py-4 sm:px-5 sm:py-5 md:order-1">
            <div className="text-left">
              {/* <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-600">Largest Fashion Store</p> */}
              {/* <h1 className="mt-3 font-serif text-[1.62rem] leading-tight text-neutral-900 sm:text-[1.9rem]">
                OFFERS POWERED
                <br />
                BY <span className="text-sage">DESIGNERS</span>
                <br />
                AROUND THE WORLD.
              </h1> */}
              <div className="mt-4 flex flex-col items-start gap-1.5">
                {/* <p className="text-sm text-neutral-700">Don&apos;t have an account?</p>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900 transition hover:text-sage"
                >
                  Create account <FiArrowRight size={14} />
                </Link>
                <Link to="/" className="text-xs text-neutral-700 transition hover:text-neutral-900">
                  Back to home
                </Link> */}
              </div>
            </div>
          </section>

          <section className="flex h-full items-center justify-center px-4 py-4 sm:px-5 sm:py-5 md:order-2">
            <div className="w-full max-w-[400px] rounded-[18px] border border-white/30 bg-sage/80 p-3.5 shadow-[0_18px_30px_rgba(40,58,34,0.45)] backdrop-blur-md">
              <div className="mb-3 flex items-center justify-center">
                <img src={logo} alt="Styliste" className="h-11 w-80 object-contain" />
              </div>

              <motion.form
                onSubmit={handleSubmit}
                initial="hidden"
                animate="show"
                className="w-full rounded-[16px] border border-black/5 bg-white/95 p-4 shadow-[0_12px_22px_rgba(17,14,11,0.18)]"
              >
                <motion.h2
                  variants={formItemVariants}
                  className="text-center text-[13px] font-semibold text-neutral-700"
                >
                  Welcome back! Please login to your account.
                </motion.h2>

                <div className="mt-4 space-y-4">
                  <motion.div variants={formItemVariants}>
                    <label htmlFor="email" className="text-sm font-semibold text-[#242748]">
                      Email
                    </label>
                    <div className="relative mt-2">
                      <FiMail
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8f93a2]"
                        size={16}
                      />
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('email')}
                        placeholder="Enter Email"
                        className="w-full rounded-xl bg-[#f1f2f8] py-3 pl-10 pr-4 text-sm text-[#1f2336] outline-none ring-1 ring-transparent transition placeholder:text-[#a0a5b8] focus:ring-[#d5d9e8]"
                        autoComplete="email"
                        required
                      />
                    </div>
                    {errors.email ? <p className="mt-1 text-xs text-red-500">{errors.email}</p> : null}
                  </motion.div>

                  <motion.div variants={formItemVariants}>
                    <div className="mb-2 flex items-center justify-between">
                      <label htmlFor="password" className="text-sm font-semibold text-[#242748]">
                        Password
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-[13px] font-semibold text-[#6d6fde] transition hover:text-[#5658c6]"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <FiLock
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8f93a2]"
                        size={16}
                      />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('password')}
                        placeholder="Enter Password"
                        className="w-full rounded-xl bg-[#f1f2f8] py-3 pl-10 pr-10 text-sm text-[#1f2336] outline-none ring-1 ring-transparent transition placeholder:text-[#a0a5b8] focus:ring-[#d5d9e8]"
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f93a2] transition hover:text-[#4f5266]"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                      </button>
                    </div>
                    {errors.password ? (
                      <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                    ) : null}
                  </motion.div>
                </div>

                <motion.button
                  variants={formItemVariants}
                  type="submit"
                  className="mt-4 w-full rounded-full bg-sage/100 py-2 text-sm font-medium text-white transition hover:bg-sage/80"
                >
                  Login
                </motion.button>

                <motion.div variants={formItemVariants} className="mt-3 text-center text-xs text-neutral-500">
                  <span>Need an account? </span>
                  <Link to="/signup" className="font-medium text-neutral-900 transition hover:text-sage">
                    Create account
                  </Link>
                </motion.div>

                <motion.div variants={formItemVariants} className="mt-2 text-center">
                  <Link to="/" className="text-[11px] text-neutral-600 transition hover:text-neutral-900">
                    Back to home
                  </Link>
                </motion.div>
              </motion.form>
            </div>
          </section>
        </div>

        <div className="absolute left-4 top-4 z-20 rounded-full bg-white/85 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-700">
          {currentSlideData.title}
        </div>
        <p className="absolute left-4 top-14 z-20 max-w-[220px] text-xs text-white/95 sm:text-sm">
          {currentSlideData.caption}
        </p>

        <div className="absolute bottom-4 left-4 z-20 text-sm font-medium tracking-wide text-white">
          {slideNumber}/{slideCount}
        </div>
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={goToPreviousSlide}
            className="grid h-8 w-8 place-items-center rounded-full border border-white/70 bg-white/20 text-white backdrop-blur transition hover:bg-white/35"
            aria-label="Previous slide"
          >
            <FiChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={goToNextSlide}
            className="grid h-8 w-8 place-items-center rounded-full border border-white/70 bg-white/20 text-white backdrop-blur transition hover:bg-white/35"
            aria-label="Next slide"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
