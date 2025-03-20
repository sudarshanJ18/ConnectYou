import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, Github, Linkedin, Facebook } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, facebookProvider } from './firebaseConfig';
import { signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { loginUser } from "../utils/api";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.1,
            duration: 0.6
        }
    },
    exit: {
        opacity: 0,
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
    hover: {
        scale: 1.02,
        transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 },
    initial: { scale: 1 }
};

const Login = ({ togglePage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
        if (!password) newErrors.password = 'Password is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await loginUser({ email, password });

            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('userType', response.userType);

                // Redirect based on user type
                if (response.userType === 'student') {
                    navigate('/dashboard');
                } else {
                    navigate('/alumni-dashboard');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrors({
                submit: error.response?.data?.message || 'Login failed. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setErrors({ email: 'Please enter your email to reset the password' });
            return;
        }

        setIsLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            setShowResetPassword(true);
        } catch (error) {
            setErrors({ submit: 'Failed to send reset email. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        setIsLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            if (result.user) {
                navigate('/dashboard');
            }
        } catch (error) {
            setErrors({ submit: 'Social login failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

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
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center space-y-4"
                        >
                            <div className="p-4 bg-green-50 rounded-lg">
                                <p className="text-green-800">
                                    Password reset link has been sent to your email.
                                    Please check your inbox.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowResetPassword(false)}
                                className="text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                Back to login
                            </button>
                        </motion.div>
                    ) : (
                        <motion.form
                            variants={itemVariants}
                            className="mt-8 space-y-6"
                            onSubmit={handleSubmit}
                        >
                            <div className="space-y-6">
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Enter your email"
                                        />
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Enter your password"
                                        />
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            {errors.submit && (
                                <div className="p-3 bg-red-50 rounded-lg">
                                    <p className="text-sm text-red-600">{errors.submit}</p>
                                </div>
                            )}

                            <motion.button
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
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

                            <div className="grid grid-cols-3 gap-3">
                                <motion.button
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                    type="button"
                                    onClick={() => handleSocialLogin(googleProvider)}
                                    className="flex justify-center items-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Github className="w-5 h-5" />
                                </motion.button>
                                <motion.button
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                    type="button"
                                    onClick={() => handleSocialLogin(facebookProvider)}
                                    className="flex justify-center items-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Facebook className="w-5 h-5" />
                                </motion.button>
                                <motion.button
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                    type="button"
                                    className="flex justify-center items-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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