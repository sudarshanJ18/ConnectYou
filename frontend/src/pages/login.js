import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, Github, Linkedin, Facebook } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, facebookProvider } from './firebaseConfig';
import { signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { loginUser } from "../utils/api";

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.1,
            duration: 0.6,
            ease: 'easeOut'
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.3 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 24
        }
    }
};

const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    initial: { scale: 1 }
};

// Memoize the FormField component to prevent unnecessary re-renders
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

const Login = ({ togglePage }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);

    // Use useCallback to memoize these functions so they don't change on each render
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setTouched(prev => ({ ...prev, [name]: true }));
    }, []);

    const handleBlur = useCallback((e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name);
    }, []);

    const validateField = useCallback((name) => {
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
    }, [formData, errors]);

    // Run validation when formData changes
    useEffect(() => {
        Object.keys(touched).forEach(field => {
            if (touched[field]) {
                validateField(field);
            }
        });
    }, [formData, validateField, touched]);

    const validateForm = useCallback(() => {
        const fieldsToValidate = ['email', 'password'];
        let isValid = true;
        fieldsToValidate.forEach(field => {
            if (!validateField(field)) isValid = false;
        });
        return isValid;
    }, [validateField]);


    const BACKEND_URL = 'http://localhost:5000';

const loginUser = async (userData) => {
    const response = await fetch(`${BACKEND_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
    }

    return await response.json();
};

const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
        const response = await loginUser(formData);

        if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userType', response.user.role);
            localStorage.setItem('userName', response.user.name);

            const redirectUrl = response.user.role === 'student' ? '/dashboard' : '/alumni';
            navigate(redirectUrl);
        }
    } catch (error) {
        setErrors({
            submit: error.response?.data?.message || 'Login failed. Please try again.'
        });
    } finally {
        setIsLoading(false);
    }
}, [formData, validateForm, navigate]);


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

    const handleSocialLogin = useCallback(async (provider) => {
        setIsLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            if (result.user) {
                const userData = {
                    email: result.user.email,
                    socialId: result.user.uid,
                    socialProvider: provider.providerId
                };
                const response = await loginUser(userData);
                if (response.token) {
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('userType', response.userType);
                    
                    navigate(response.userType === 'student' ? '/dashboard' : '/alumni-dashboard');
                }
            }
        } catch (error) {
            setErrors({ submit: 'Social login failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4"
        >
            <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
                <motion.div variants={itemVariants} className="text-center">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Welcome Back
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
                                    Password reset link has been sent to {formData.email}.
                                    Please check your inbox.
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
                        <motion.form
                            key="login"
                            variants={itemVariants}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onSubmit={handleSubmit}
                            className="mt-8 space-y-6"
                        >
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
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </motion.button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <motion.button
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                    type="button"
                                    onClick={() => handleSocialLogin(googleProvider)}
                                    disabled={isLoading}
                                    className="flex justify-center items-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    <Github className="w-5 h-5" />
                                </motion.button>
                                <motion.button
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                    type="button"
                                    onClick={() => handleSocialLogin(facebookProvider)}
                                    disabled={isLoading}
                                    className="flex justify-center items-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    <Facebook className="w-5 h-5" />
                                </motion.button>
                                <motion.button
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                    type="button"
                                    disabled={isLoading}
                                    className="flex justify-center items-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    <Linkedin className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>

                <motion.div variants={itemVariants} className="text-center">
                    <p className="text-gray-600">
                        Don't have an account?{" "}
                        <button
                            onClick={togglePage}
                            className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors"
                        >
                            Sign up
                        </button>
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Login;


