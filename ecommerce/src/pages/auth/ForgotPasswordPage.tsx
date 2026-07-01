import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowLeft, FiCheck, FiX, FiEye, FiEyeOff, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import authApi from '../../api/authApi';
import logo from '../../assets/logo.png';
import forgotBackground from '../../assets/fg1.png';

/* ================== TYPES ================== */
type ForgotPasswordStage = 'email' | 'otp' | 'reset';

/* ================== ANIMATIONS ================== */
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

/* ================== OTP INPUT COMPONENT ================== */
const OtpInput = ({ digits, onChange }: { digits: string[], onChange: (digits: string[]) => void }) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(6).fill(null));

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    onChange(newDigits);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const newDigits = [...digits];
      newDigits[index - 1] = '';
      onChange(newDigits);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newDigits = pastedData.split('');
      while (newDigits.length < 6) newDigits.push('');
      onChange(newDigits);
    }
  };

  return (
    <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="
            w-12 h-14
            text-center text-2xl font-semibold
            bg-white border-2 border-sage/30
            rounded-lg
            focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20
            transition-all duration-200
          "
        />
      ))}
    </div>
  );
};

/* ================== MAIN COMPONENT ================== */
const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  
  // State
  const [stage, setStage] = useState<ForgotPasswordStage>('email');
  const [isLoading, setIsLoading] = useState(false);
  
  // Form data
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Validation
  const [errors, setErrors] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: ''
  });
  
  // Timer for OTP resend
  const [otpTimer, setOtpTimer] = useState(0);

  const getApiErrorMessage = (error: unknown, fallback: string) => {
    if (typeof error === 'string' && error.trim()) {
      return error;
    }
    if (error && typeof error === 'object' && 'message' in error) {
      const directMessage = (error as { message?: unknown }).message;
      if (typeof directMessage === 'string' && directMessage.trim()) {
        return directMessage;
      }
    }
    if (error && typeof error === 'object' && 'response' in error) {
      const response = (error as { response?: { data?: { message?: string } } }).response;
      if (response?.data?.message) return response.data.message;
    }
    return fallback;
  };
  
  // Email validation
  const validateEmail = (email: string) => {
    if (!email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email';
    return '';
  };
  
  // Password validation
  const validatePassword = (password: string) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    // Optional: Add strong password regex
    // if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) 
    //   return 'Password must contain uppercase, lowercase, number & special character';
    return '';
  };

  // OTP countdown timer
  useEffect(() => {
    if (otpTimer <= 0) return;
    
    const interval = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [otpTimer]);
  
  /* ================== STAGE 1: REQUEST OTP ================== */
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ ...errors, email: emailError });
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await authApi.forgotPassword(email);
      toast.success('OTP sent to your email');
      setStage('otp');
      setOtpTimer(300); // 5 minutes timer
    } catch (err: unknown) {
      const message = getApiErrorMessage(err, 'Failed to send OTP');
      setErrors((prev) => ({ ...prev, email: message }));
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  /* ================== STAGE 2: VERIFY OTP ================== */
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setErrors({ ...errors, otp: 'Please enter a 6-digit OTP' });
      toast.error('Please enter complete OTP');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await authApi.verifyOtp(email, otpString);
      toast.success('OTP verified successfully');
      setStage('reset');
    } catch (err: unknown) {
      const message = getApiErrorMessage(err, 'OTP verification failed');
      setErrors({ ...errors, otp: message });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  /* ================== STAGE 3: RESET PASSWORD ================== */
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordError = validatePassword(password);
    const confirmError = password !== confirmPassword ? 'Passwords do not match' : '';
    
    if (passwordError || confirmError) {
      setErrors({ 
        ...errors, 
        password: passwordError,
        confirmPassword: confirmError 
      });
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await authApi.resetPassword(email, password);
      toast.success('Password reset successful!');
      
      // Redirect to login page with email pre-filled
      navigate('/login', { 
        state: { prefillEmail: email } 
      });
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Password reset failed'));
    } finally {
      setIsLoading(false);
    }
  };
  
  /* ================== RESEND OTP ================== */
  const handleResendOtp = async () => {
    if (otpTimer > 0) {
      toast.error(`Please wait ${otpTimer} seconds before resending`);
      return;
    }
    
    setIsLoading(true);
    
    try {
      await authApi.forgotPassword(email);
      toast.success('OTP resent to your email');
      setOtpTimer(300); // Reset to 5 minutes
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to resend OTP'));
    } finally {
      setIsLoading(false);
    }
  };
  
  /* ================== FORMAT TIMER ================== */
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="h-[100dvh] overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-full w-full overflow-hidden bg-black"
      >
        <img
          src={forgotBackground}
          alt="Forgot password background"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/88 via-white/72 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />

        <div className="relative z-10 flex h-full items-center justify-center px-4 py-4 sm:px-5 sm:py-5">
            <div className="w-full max-w-[430px] rounded-[18px] border border-white/30 bg-sage/80 p-3 shadow-[0_18px_30px_rgba(40,58,34,0.45)] backdrop-blur-md">
              <div className="mb-3 flex items-center justify-center">
                <img src={logo} alt="Styliste" className="h-11 w-80 object-contain" />
              </div>

              <div className="w-full rounded-[16px] border border-black/5 bg-white/95 p-4 shadow-[0_12px_22px_rgba(17,14,11,0.18)]">
                {/* Header */}
                <div className="mb-5 text-center">
                  <h2 className="mb-1 text-2xl font-semibold text-neutral-900">
                    {stage === 'email' && 'Reset Your Password'}
                    {stage === 'otp' && 'Verify OTP'}
                    {stage === 'reset' && 'Create New Password'}
                  </h2>
                  <p className="text-sm text-neutral-600">
                    {stage === 'email' && 'Enter your email to receive a verification code'}
                    {stage === 'otp' && `Enter the 6-digit code sent to ${email}`}
                    {stage === 'reset' && 'Enter your new password'}
                  </p>
                </div>

                {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8">
            {(['email', 'otp', 'reset'] as ForgotPasswordStage[]).map((s, index) => (
              <div key={s} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${stage === s ? 'bg-sage text-white' : 
                    stageIndex(s) < stageIndex(stage) ? 'bg-green-100 text-green-600' : 
                    'bg-sage/20 text-sage/60'}
                  font-medium text-sm
                `}>
                  {stageIndex(s) < stageIndex(stage) ? <FiCheck size={16} /> : index + 1}
                </div>
                {index < 2 && (
                  <div className={`w-16 h-1 mx-2 ${stageIndex(s) < stageIndex(stage) ? 'bg-green-100' : 'bg-sage/20'}`} />
                )}
              </div>
            ))}
          </div>
          
          {/* Form Content */}
          <motion.div
            key={stage}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* STAGE 1: Email Input */}
            {stage === 'email' && (
              <form onSubmit={handleRequestOtp}>
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors({ ...errors, email: '' });
                      }}
                      onBlur={() => setErrors({ ...errors, email: validateEmail(email) })}
                      placeholder="Enter your email"
                      className={`input-field pl-10 pr-8 focus:scale-[1.01] ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                      required
                    />
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    {email && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        {errors.email ? (
                          <FiX className="text-red-500" size={16} />
                        ) : validateEmail(email) === '' ? (
                          <FiCheck className="text-green-500" size={16} />
                        ) : null}
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <FiX size={12} /> {errors.email}
                    </p>
                  )}
                  
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
                  >
                    {isLoading ? 'Sending...' : 'Send OTP'}
                  </motion.button>
                </div>
              </form>
            )}
            
            {/* STAGE 2: OTP Verification */}
            {stage === 'otp' && (
              <form onSubmit={handleVerifyOtp}>
                <div className="space-y-4">
                  {/* OTP Input */}
                  <OtpInput digits={otp} onChange={setOtp} />
                  
                  {/* Timer Display */}
                  {otpTimer > 0 && (
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center gap-2 text-sm text-sage">
                        <FiClock />
                        <span>Code expires in {formatTimer(otpTimer)}</span>
                      </div>
                    </div>
                  )}
                  
                  {errors.otp && (
                    <p className="text-red-500 text-xs text-center mb-4">
                      {errors.otp}
                    </p>
                  )}
                  
                  {/* Verify Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading || otp.join('').length !== 6}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </motion.button>
                  
                  {/* Resend OTP */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={otpTimer > 0}
                      className="text-sm text-sage hover:underline disabled:text-sage/50 disabled:cursor-not-allowed"
                    >
                      {otpTimer > 0 ? `Resend OTP in ${formatTimer(otpTimer)}` : 'Resend OTP'}
                    </button>
                  </div>
                </div>
              </form>
            )}
            
            {/* STAGE 3: Reset Password */}
            {stage === 'reset' && (
              <form onSubmit={handleResetPassword}>
                <div className="space-y-4">
                  {/* Email Display (Read-only) */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate mb-2">
                      Email
                    </label>
                    <div className="
                      w-full p-3 
                      bg-sage/10 border border-sage/20 
                      rounded-lg text-slate
                    ">
                      {email}
                    </div>
                  </div>
                  
                  {/* New Password */}
                  <div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setErrors({ ...errors, password: '' });
                        }}
                        onBlur={() => setErrors({ ...errors, password: validatePassword(password) })}
                        placeholder="New Password"
                        className={`input-field pl-10 pr-10 focus:scale-[1.01] ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                        required
                      />
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <FiX size={12} /> {errors.password}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum 8 characters. Strong password recommended.
                    </p>
                  </div>
                  
                  {/* Confirm Password */}
                  <div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setErrors({ ...errors, confirmPassword: '' });
                        }}
                        onBlur={() => setErrors({ 
                          ...errors, 
                          confirmPassword: password !== confirmPassword ? 'Passwords do not match' : '' 
                        })}
                        placeholder="Confirm Password"
                        className={`input-field pl-10 pr-8 focus:scale-[1.01] ${errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                        required
                      />
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      {confirmPassword && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          {errors.confirmPassword ? (
                            <FiX className="text-red-500" size={16} />
                          ) : password === confirmPassword ? (
                            <FiCheck className="text-green-500" size={16} />
                          ) : null}
                        </div>
                      )}
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <FiX size={12} /> {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                  
                  {/* Reset Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60 mt-4"
                  >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
          
          {/* Navigation Links */}
          <div className="mt-8 space-y-3 text-center">
            {stage !== 'email' && (
              <button
                type="button"
                onClick={() => {
                  if (stage === 'otp') setStage('email');
                  if (stage === 'reset') setStage('otp');
                }}
                className="text-sm text-muted-foreground hover:text-foreground hover:underline flex items-center justify-center gap-2"
              >
                <FiArrowLeft /> Go Back
              </button>
            )}
            
            <div>
              <p className="text-muted-foreground">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-sage font-medium hover:underline"
                >
                  Login
                </button>
              </p>
            </div>
            
            <div>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-sm text-muted-foreground hover:text-foreground hover:underline"
              >
                Back to home
              </button>
            </div>
          </div>
              </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

// Helper function to get stage index
const stageIndex = (stage: ForgotPasswordStage): number => {
  const stages: ForgotPasswordStage[] = ['email', 'otp', 'reset'];
  return stages.indexOf(stage);
};

export default ForgotPasswordPage;

