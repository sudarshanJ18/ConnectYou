import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import './login.css';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
      duration: 0.6,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
  initial: { scale: 1 },
};

const FormField = memo(({ label, name, type, value, error, touched, icon: Icon, onChange, onBlur }) => (
  <div className="relative mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-4 py-3 pl-10 rounded-lg border ${
          error && touched ? 'border-red-500' : 'border-gray-300'
        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    </div>
    <AnimatePresence>
      {error && touched && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute -bottom-5 left-0 text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
));

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name);
  }, []);

  const validateField = useCallback(
    (name) => {
      const newErrors = { ...errors };
      switch (name) {
        case 'email':
          if (!formData.email) newErrors.email = 'Email is required';
          else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
          else delete newErrors.email;
          break;
        case 'password':
          if (!formData.password) newErrors.password = 'Password is required';
          else delete newErrors.password;
          break;
        default:
          break;
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData, errors]
  );

  useEffect(() => {
    Object.keys(touched).forEach((field) => {
      if (touched[field]) {
        validateField(field);
      }
    });
  }, [formData, validateField, touched]);

  const validateForm = useCallback(() => {
    const fieldsToValidate = ['email', 'password'];
    let isValid = true;
    fieldsToValidate.forEach((field) => {
      if (!validateField(field)) isValid = false;
    });
    return isValid;
  }, [validateField]);

  const BACKEND_URL = 'http://localhost:5001';

  const loginUser = async (userData) => {
    const response = await fetch(`${BACKEND_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    return await response.json();
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      setIsLoading(true);
      try {
        const response = await loginUser(formData);

        if (response.token) {
          const { token, user } = response;

          localStorage.setItem('token', token);
          localStorage.setItem('userId', user.id);
          localStorage.setItem('userEmail', user.email);
          localStorage.setItem('userType', user.role);
          localStorage.setItem('userName', user.name);

          const redirectUrl = user.role === 'student' ? '/dashboard' : '/alumni';
          navigate(redirectUrl);
        }
      } catch (error) {
        setErrors({
          submit: error.message || 'Login failed. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [formData, validateForm, navigate]
  );

  const handleForgotPassword = useCallback(async () => {
    if (!formData.email) {
      setErrors({ email: 'Please enter your email to reset the password' });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ email: 'Invalid email format' });
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, formData.email);
      setShowResetPassword(true);
    } catch (error) {
      setErrors({ submit: 'Failed to send reset email. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }, [formData.email]);

  return (
    <div className="form-container">
      <div className="info-section">
        <h2>Welcome Back!</h2>
        <p>Login to access your dashboard and stay connected.</p>
      </div>

      <motion.div initial="hidden" animate="visible" exit="exit" variants={containerVariants} className="form-section">
        <div className="w-full max-w-md space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
          <motion.div variants={itemVariants} className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Sign In
            </h2>
            <p className="mt-2 text-gray-600">Sign in to continue your journey</p>
          </motion.div>

          <AnimatePresence mode="wait">
            {showResetPassword ? (
              <motion.div
                key="reset"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-4"
              >
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-green-800">
                    Password reset link has been sent to {formData.email}. Please check your inbox.
                  </p>
                </div>
                <button
                  onClick={() => setShowResetPassword(false)}
                  className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors"
                >
                  Back to login
                </button>
              </motion.div>
            ) : (
              <motion.form key="login" variants={itemVariants} onSubmit={handleSubmit} className="mt-8 space-y-6">
                <FormField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  error={errors.email}
                  touched={touched.email}
                  icon={Mail}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                <FormField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  error={errors.password}
                  touched={touched.password}
                  icon={Lock}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />

                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <AnimatePresence>
                  {errors.submit && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-red-50 rounded-lg border border-red-100"
                    >
                      <p className="text-sm text-red-600">{errors.submit}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In</>}
                </motion.button>

                <div className="text-center text-sm text-gray-600 mt-4">
                  Don’t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/signup')}
                    className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors"
                  >
                    Sign up
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
