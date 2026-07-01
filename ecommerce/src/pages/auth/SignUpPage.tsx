import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { FiCheck, FiEye, FiEyeOff, FiLock, FiMail, FiPhone, FiUser, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

import logo from '../../assets/logo.png';
import heroOne from '../../assets/saree1.png';
import heroTwo from '../../assets/img1.png';
// import heroThree from '../../assets/jacket1.jpg';
import { useAuth } from '../../hooks/useAuth';
import { signup } from '../../store/slices/authSlice';
import { mergeGuestCartAfterLogin } from '../../utils/cartMerge';

type Slide = {
  image: string;
  position?: string;
};

const sliderImages: Slide[] = [
  { image: heroOne, position: 'center' },
  { image: heroTwo, position: 'center' },
  // { image: heroThree, position: 'center' },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
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
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex w-[220px] flex-col items-center rounded-xl bg-white/90 p-6 shadow-xl"
    >
      <div className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-sage border-t-transparent" />
      <p className="text-sm font-medium text-slate">Signing you up...</p>
    </motion.div>
  </motion.div>
);

const SignUpPage = () => {
  const navigate = useNavigate();
  const { isLoading, dispatch } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
    name: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 2000);

    return () => window.clearInterval(timer);
  }, []);

  const validationRules = {
    email: (value: string) => {
      if (!value) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
      return '';
    },
    phone: (value: string) => {
      if (value && !/^\d{10}$/.test(value)) return 'Phone number must be exactly 10 digits';
      return '';
    },
    password: (value: string) => {
      if (!value) return 'Password is required';
      if (value.length < 8) return 'At least 8 characters';
      if (!/(?=.*[a-z])/.test(value)) return 'One lowercase letter';
      if (!/(?=.*[A-Z])/.test(value)) return 'One uppercase letter';
      if (!/(?=.*\d)/.test(value)) return 'One number';
      if (!/(?=.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?])/.test(value)) return 'One special character';
      return '';
    },
    confirmPassword: (value: string, password: string) => {
      if (!value) return 'Please confirm your password';
      if (value !== password) return 'Passwords do not match';
      return '';
    },
    name: (value: string) => {
      if (!value) return 'Full name is required';
      if (value.length < 2) return 'Name is too short';
      return '';
    },
  };

  const validateField = (name: keyof typeof formData, value: string) => {
    switch (name) {
      case 'email':
        return validationRules.email(value);
      case 'phone':
        return validationRules.phone(value);
      case 'password':
        return validationRules.password(value);
      case 'confirmPassword':
        return validationRules.confirmPassword(value, formData.password);
      case 'name':
        return validationRules.name(value);
      default:
        return '';
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, '');
    const limitedValue = numericValue.slice(0, 10);

    setFormData((prev) => ({ ...prev, phone: limitedValue }));

    if (touched.phone) {
      const error = validateField('phone', limitedValue);
      setErrors((prev) => ({ ...prev, phone: error }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      handlePhoneChange(e);
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name as keyof typeof touched]) {
      const error = validateField(name as keyof typeof formData, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched = Object.keys(touched).reduce(
      (acc, key) => ({
        ...acc,
        [key]: true,
      }),
      {} as typeof touched,
    );
    setTouched(allTouched);

    const newErrors = {
      name: validationRules.name(formData.name),
      email: validationRules.email(formData.email),
      password: validationRules.password(formData.password),
      confirmPassword: validationRules.confirmPassword(formData.confirmPassword, formData.password),
      phone: validationRules.phone(formData.phone),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== '');
    if (hasErrors) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(
        signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
        }),
      ).unwrap();
      await mergeGuestCartAfterLogin(dispatch);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: unknown) {
      const message =
        typeof error === 'string'
          ? error
          : error instanceof Error
            ? error.message
            : 'Signup failed';
      toast.error(message);
      setIsSubmitting(false);
    }
  };

  if (isLoading || isSubmitting) {
    return <FullPageLoader />;
  }

  const passwordStrength = getPasswordStrength(formData.password);

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
            alt="Signup background"
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
            <div className="text-left" />
          </section>

          <section className="flex h-full items-center justify-center px-4 py-2 sm:px-5 sm:py-2 md:order-2">
            <div className="w-full max-w-[430px] rounded-[18px] border border-white/30 bg-sage/80 p-2.5 shadow-[0_18px_30px_rgba(40,58,34,0.45)] backdrop-blur-md">
              <div className="mb-1.5 flex items-center justify-center">
                <img src={logo} alt="Styliste" className="h-11 w-90 object-contain" />
              </div>

              <motion.form
                onSubmit={handleSubmit}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="w-full rounded-[16px] border border-black/5 bg-white/95 p-2.5 shadow-[0_12px_22px_rgba(17,14,11,0.18)]"
              >
                <motion.h2
                  variants={itemVariants}
                  className="text-center text-[11px] font-semibold text-neutral-700"
                >
                  Create your account and start shopping
                </motion.h2>

                <div className="mt-2.5 space-y-2.5">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="name" className="text-[12px] font-semibold text-[#242748]">
                      Full Name
                    </label>
                    <div className="relative mt-1.5">
                      <FiUser
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8f93a2]"
                        size={15}
                      />
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('name')}
                        placeholder="Enter Full Name"
                        className={`w-full rounded-xl bg-[#f1f2f8] py-1.5 pl-9 pr-9 text-[13px] text-[#1f2336] outline-none ring-1 transition placeholder:text-[#a0a5b8] ${
                          errors.name ? 'ring-red-300 focus:ring-red-400' : 'ring-transparent focus:ring-[#d5d9e8]'
                        }`}
                        required
                      />
                      {touched.name ? (
                        errors.name ? (
                          <FiX className="absolute right-2.5 top-1/2 -translate-y-1/2 text-red-500" size={15} />
                        ) : (
                          <FiCheck className="absolute right-2.5 top-1/2 -translate-y-1/2 text-green-500" size={15} />
                        )
                      ) : null}
                    </div>
                    {errors.name ? (
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] text-red-500">
                        <FiX size={11} /> {errors.name}
                      </p>
                    ) : null}
                  </motion.div>

                  <motion.div variants={itemVariants} className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="email" className="text-[12px] font-semibold text-[#242748]">
                        Email
                      </label>
                      <div className="relative mt-1.5">
                        <FiMail
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8f93a2]"
                          size={15}
                        />
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('email')}
                          placeholder="Enter Email"
                          className={`w-full rounded-xl bg-[#f1f2f8] py-1.5 pl-9 pr-9 text-[13px] text-[#1f2336] outline-none ring-1 transition placeholder:text-[#a0a5b8] ${
                            errors.email ? 'ring-red-300 focus:ring-red-400' : 'ring-transparent focus:ring-[#d5d9e8]'
                          }`}
                          required
                        />
                        {touched.email ? (
                          errors.email ? (
                            <FiX className="absolute right-2.5 top-1/2 -translate-y-1/2 text-red-500" size={15} />
                          ) : (
                            <FiCheck className="absolute right-2.5 top-1/2 -translate-y-1/2 text-green-500" size={15} />
                          )
                        ) : null}
                      </div>
                      {errors.email ? (
                        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-red-500">
                          <FiX size={11} /> {errors.email}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label htmlFor="phone" className="text-[12px] font-semibold text-[#242748]">
                        Phone
                      </label>
                      <div className="relative mt-1.5">
                        <FiPhone
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8f93a2]"
                          size={15}
                        />
                        <input
                          id="phone"
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          onBlur={() => handleBlur('phone')}
                          placeholder="Phone Number"
                          className={`w-full rounded-xl bg-[#f1f2f8] py-1.5 pl-9 pr-9 text-[13px] text-[#1f2336] outline-none ring-1 transition placeholder:text-[#a0a5b8] ${
                            errors.phone ? 'ring-red-300 focus:ring-red-400' : 'ring-transparent focus:ring-[#d5d9e8]'
                          }`}
                          inputMode="numeric"
                          pattern="[0-9]*"
                        />
                        {touched.phone && formData.phone ? (
                          errors.phone ? (
                            <FiX className="absolute right-2.5 top-1/2 -translate-y-1/2 text-red-500" size={15} />
                          ) : formData.phone.length === 10 ? (
                            <FiCheck className="absolute right-2.5 top-1/2 -translate-y-1/2 text-green-500" size={15} />
                          ) : null
                        ) : null}
                      </div>
                      {errors.phone ? (
                        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-red-500">
                          <FiX size={11} /> {errors.phone}
                        </p>
                      ) : formData.phone && formData.phone.length < 10 ? (
                        <p className="mt-0.5 text-[11px] text-yellow-500">Enter {10 - formData.phone.length} more digit(s)</p>
                      ) : formData.phone && formData.phone.length === 10 ? (
                        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-green-500">
                          <FiCheck size={11} /> Valid phone number
                        </p>
                      ) : null}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="password" className="text-[12px] font-semibold text-[#242748]">
                        Password
                      </label>
                      <div className="relative mt-1.5">
                        <FiLock
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8f93a2]"
                          size={15}
                        />
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('password')}
                          placeholder="Enter Password"
                          className={`w-full rounded-xl bg-[#f1f2f8] py-1.5 pl-9 pr-9 text-[13px] text-[#1f2336] outline-none ring-1 transition placeholder:text-[#a0a5b8] ${
                            errors.password ? 'ring-red-300 focus:ring-red-400' : 'ring-transparent focus:ring-[#d5d9e8]'
                          }`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8f93a2] transition hover:text-[#4f5266]"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                        </button>
                      </div>

                      {formData.password ? (
                        <div className="mt-1 space-y-0.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-neutral-500">Strength</span>
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
                          <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
                            <div
                              className={`h-full ${passwordStrength.color} transition-all duration-300`}
                              style={{ width: `${passwordStrength.percentage}%` }}
                            />
                          </div>
                        </div>
                      ) : null}

                      {errors.password ? (
                        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-red-500">
                          <FiX size={11} /> {errors.password}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="text-[12px] font-semibold text-[#242748]">
                        Confirm Password
                      </label>
                      <div className="relative mt-1.5">
                        <FiLock
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8f93a2]"
                          size={15}
                        />
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('confirmPassword')}
                          placeholder="Confirm Password"
                          className={`w-full rounded-xl bg-[#f1f2f8] py-1.5 pl-9 pr-9 text-[13px] text-[#1f2336] outline-none ring-1 transition placeholder:text-[#a0a5b8] ${
                            errors.confirmPassword ? 'ring-red-300 focus:ring-red-400' : 'ring-transparent focus:ring-[#d5d9e8]'
                          }`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8f93a2] transition hover:text-[#4f5266]"
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                        </button>
                      </div>
                      {errors.confirmPassword ? (
                        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-red-500">
                          <FiX size={11} /> {errors.confirmPassword}
                        </p>
                      ) : null}
                      {formData.confirmPassword &&
                      formData.password &&
                      !validationRules.password(formData.password) &&
                      formData.confirmPassword === formData.password ? (
                        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-green-500">
                          <FiCheck size={11} /> Passwords match
                        </p>
                      ) : null}
                    </div>
                  </motion.div>
                </div>

                <motion.label variants={itemVariants} className="mt-2.5 flex items-start gap-2 text-[10px] text-neutral-500">
                  <input type="checkbox" className="mt-1 accent-primary" required />
                  <span>
                    I agree to the{' '}
                    <a href="./terms-of-service" className="font-medium text-sage hover:underline">Terms</a> and{' '}
                    <a href="./privacy-policy" className="font-medium text-sage hover:underline">Privacy Policy</a>
                  </span>
                </motion.label>

                <motion.button
                  variants={itemVariants}
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-2.5 w-full rounded-full bg-sage/100 py-1.5 text-[13px] font-medium text-white transition hover:bg-sage/80 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                </motion.button>

                <motion.div variants={itemVariants} className="mt-1.5 text-center text-[11px] text-neutral-500">
                  <span>Already have an account? </span>
                  <Link to="/login" className="font-medium text-neutral-900 transition hover:text-sage">
                    Login
                  </Link>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-0.5 text-center">
                  <Link to="/" className="text-[11px] text-neutral-600 transition hover:text-neutral-900">
                    Back to home
                  </Link>
                </motion.div>
              </motion.form>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
