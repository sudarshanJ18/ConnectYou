import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, UserSquare2, ArrowLeft, Loader2, BookOpen, Rocket, Trophy, Users } from 'lucide-react';

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

const Features = () => (
  <motion.div 
    variants={itemVariants}
    className="grid grid-cols-2 gap-4 mt-8"
  >
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100"
    >
      <BookOpen className="w-6 h-6 text-purple-600 mb-2" />
      <h3 className="font-semibold text-purple-900">Learn Together</h3>
      <p className="text-sm text-purple-700">Connect with peers and share knowledge</p>
    </motion.div>
    
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100"
    >
      <Rocket className="w-6 h-6 text-blue-600 mb-2" />
      <h3 className="font-semibold text-blue-900">Grow Skills</h3>
      <p className="text-sm text-blue-700">Access resources and workshops</p>
    </motion.div>
    
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100"
    >
      <Trophy className="w-6 h-6 text-green-600 mb-2" />
      <h3 className="font-semibold text-green-900">Get Opportunities</h3>
      <p className="text-sm text-green-700">Find internships and jobs</p>
    </motion.div>
    
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-100"
    >
      <Users className="w-6 h-6 text-orange-600 mb-2" />
      <h3 className="font-semibold text-orange-900">Build Network</h3>
      <p className="text-sm text-orange-700">Connect with alumni and mentors</p>
    </motion.div>
  </motion.div>
);

const Signup = ({ togglePage }) => {
  const [userType, setUserType] = useState('');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    university: '',
    branch: '',
    yearOfStudy: '',
    studentId: '',
    graduationYear: '',
    currentCompany: '',
    jobTitle: '',
    industry: '',
  });
  const [errors, setErrors] = useState({});

  const branches = [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Mechanical',
    'Civil',
    'Chemical',
    'Other'
  ];

  const studyYears = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number format';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (userType === 'student') {
      if (!formData.university) newErrors.university = 'University name is required';
      if (!formData.branch) newErrors.branch = 'Branch is required';
      if (!formData.yearOfStudy) newErrors.yearOfStudy = 'Year of study is required';
      if (!formData.studentId) newErrors.studentId = 'Student ID is required';
    } else {
      if (!formData.graduationYear) newErrors.graduationYear = 'Graduation year is required';
      if (!formData.currentCompany) newErrors.currentCompany = 'Current company is required';
      if (!formData.jobTitle) newErrors.jobTitle = 'Job title is required';
      if (!formData.industry) newErrors.industry = 'Industry is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1 && validateStep1()) {
      setStep(2);
      return;
    }

    if (step === 2 && validateStep2()) {
      setIsLoading(true);
      try {
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        alert('Account created successfully! Please check your email to verify your account.');
        
      } catch (error) {
        console.error('Error during signup:', error);
        setErrors(prev => ({
          ...prev,
          submit: error.message
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const FormField = ({ label, name, type = 'text', value, onChange, error, options = null }) => (
    <motion.div 
      variants={itemVariants}
      className="relative"
    >
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {options ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
        >
          <option value="">Select {label}</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
        />
      )}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-6 left-0 text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );

  if (!userType) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4"
      >
        <div className="max-w-2xl w-full space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
          <motion.div variants={itemVariants} className="text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to ConnectYou
            </h2>
            <p className="mt-2 text-gray-600">Join our community of learners and achievers</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setUserType('student')}
                className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <GraduationCap className="w-6 h-6" />
                <span className="text-lg">Continue as Student</span>
              </motion.button>

              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setUserType('alumni')}
                className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <UserSquare2 className="w-6 h-6" />
                <span className="text-lg">Continue as Alumni</span>
              </motion.button>

              <motion.div variants={itemVariants} className="text-center pt-4">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <button
                    onClick={togglePage}
                    className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              </motion.div>
            </div>

            <Features />
          </div>
        </div>
      </motion.div>
    );
  }

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
            {userType === 'student' ? 'Student Signup' : 'Alumni Signup'}
          </h2>
          <div className="mt-4 flex justify-center space-x-3">
            <motion.div 
              className={`h-2 w-16 rounded-full ${step === 1 ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gray-200'}`}
              animate={{ scale: step === 1 ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div 
              className={`h-2 w-16 rounded-full ${step === 2 ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-200'}`}
              animate={{ scale: step === 2 ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={errors.firstName}
                />
                <FormField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={errors.lastName}
                />
              </div>
              <FormField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
              />
              <FormField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
              />
              <FormField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
              />
              <FormField
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
              />
            </motion.div>
          )}

          {step === 2 && userType === 'student' && (
            <motion.div
              key="step2-student"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <FormField
                label="University Name"
                name="university"
                value={formData.university}
                onChange={handleInputChange}
                error={errors.university}
              />
              <FormField
                label="Branch"
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                error={errors.branch}
                options={branches}
              />
              <FormField
                label="Year of Study"
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleInputChange}
                error={errors.yearOfStudy}
                options={studyYears}
              />
              <FormField
                label="Student ID"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                error={errors.studentId}
              />
            </motion.div>
          )}

          {step === 2 && userType === 'alumni' && (
            <motion.div
              key="step2-alumni"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <FormField
                label="Graduation Year"
                name="graduationYear"
                type="number"
                value={formData.graduationYear}
                onChange={handleInputChange}
                error={errors.graduationYear}
              />
              <FormField
                label="Current Company"
                name="currentCompany"
                value={formData.currentCompany}
                onChange={handleInputChange}
                error={errors.currentCompany}
              />
              <FormField
                label="Job Title"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                error={errors.jobTitle}
              />
              <FormField
                label="Industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                error={errors.industry}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={itemVariants} className="flex items-center justify-between pt-8">
          {step === 2 && (
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </motion.button>
          )}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleSubmit}
            disabled={isLoading}
            className={`flex items-center gap-2 px-6 py-3 ${step === 1 ? 'ml-auto' : ''} bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : null}
            {step === 2 ? "Create Account" : "Next Step"}
          </motion.button>
        </motion.div>

        {errors.submit && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-sm text-center text-red-600"
          >
            {errors.submit}
          </motion.p>
        )}

        <motion.div variants={itemVariants} className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={togglePage}
              className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors"
            >
              Sign in
            </button>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Signup;