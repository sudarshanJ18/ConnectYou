import React, { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, UserSquare2, ArrowLeft, Loader2, BookOpen, Rocket, Trophy, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 }
  }
};

// Features component moved outside main container
const Features = () => (
  <div className="w-full grid grid-cols-2 gap-4 mt-6">
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
  </div>
);

const FormField = memo(({ label, name, type = 'text', value, onChange, onBlur, error, options = null, touched }) => (
  <div className="relative mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {options ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-4 py-3 rounded-lg border ${
          error && touched ? 'border-red-500' : 'border-gray-300'
        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white`}
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
        onBlur={onBlur}
        className={`w-full px-4 py-3 rounded-lg border ${
          error && touched ? 'border-red-500' : 'border-gray-300'
        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
      />
    )}
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

const Signup = memo(({ togglePage }) => {
  const navigate = useNavigate();
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
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name);
  }, []);

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setFormData(prev => ({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      university: type === 'student' ? '' : prev.university,
      branch: type === 'student' ? '' : prev.branch,
      yearOfStudy: type === 'student' ? '' : prev.yearOfStudy,
      studentId: type === 'student' ? '' : prev.studentId,
    }));
    setStep(1);
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (touched[name]) {
      validateField(name);
    }
  }, [touched]);

  const validateField = (name) => {
    const newErrors = { ...errors };
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!formData[name]) newErrors[name] = `${name === 'firstName' ? 'First' : 'Last'} name is required`;
        else delete newErrors[name];
        break;
      case 'email':
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        else delete newErrors.email;
        break;
      case 'password':
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        else delete newErrors.password;
        break;
      case 'confirmPassword':
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        else delete newErrors.confirmPassword;
        break;
      case 'phone':
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number format';
        else delete newErrors.phone;
        break;
      default:
        if (userType === 'student') {
          if (['university', 'branch', 'yearOfStudy', 'studentId'].includes(name) && !formData[name]) {
            newErrors[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
          } else {
            delete newErrors[name];
          }
        } else if (userType === 'alumni') {
          if (['graduationYear', 'currentCompany', 'jobTitle', 'industry'].includes(name) && !formData[name]) {
            newErrors[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
          } else {
            delete newErrors[name];
          }
        }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep = (currentStep) => {
    const fieldsToValidate = currentStep === 1 
      ? ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'phone']
      : userType === 'student'
        ? ['university', 'branch', 'yearOfStudy', 'studentId']
        : ['graduationYear', 'currentCompany', 'jobTitle', 'industry'];
    
    const newTouched = { ...touched };
    fieldsToValidate.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);
    
    let isValid = true;
    fieldsToValidate.forEach(field => {
      if (!validateField(field)) isValid = false;
    });
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataWithUserType = { ...formData, userType };
  
    if (!validateStep(step)) return;
  
    if (step === 1) {
      setStep(2);
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataWithUserType)
      });
  
      if (!response.ok) {
        throw new Error('Registration failed. Please try again.');
      }
  
      console.log('Form submitted successfully');
      window.alert('User registered successfully');
      navigate('/login');
    } catch (error) {
      setErrors(prev => ({ ...prev, submit: error.message || 'Registration failed. Please try again.' }));
      console.error('Error during submission:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignInClick = (e) => {
    e.preventDefault();
    if (togglePage) {
      togglePage();
    }
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Left side info container (now 55% width) */}
      <div className="w-6/12 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 flex flex-col justify-center items-center text-white">
        <div className="max-w-md mx-auto">
          <h2 className="text-4xl font-bold mb-6">Welcome to ConnectYou</h2>
          <p className="text-xl mb-8">Join our community of learners and achievers</p>
          
          {/* Features moved outside main container */}
          <Features />
        </div>
      </div>
      
      {/* Right side form container (now 45% width) */}
      <div className="w-6/12 flex justify-center items-center p-6">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          className="w-full max-w-md"
        >
          {!userType ? (
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Choose Account Type
                </h2>
              </div>
              
              <div className="space-y-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleUserTypeChange('student')}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  <GraduationCap className="w-6 h-6" />
                  <span className="text-lg">Continue as Student</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleUserTypeChange('alumni')}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  <UserSquare2 className="w-6 h-6" />
                  <span className="text-lg">Continue as Alumni</span>
                </motion.button>
              </div>

              {/* Moved "Already have an account" to right container */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <button
                    onClick={handleSignInClick}
                    className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
              <div className="text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {userType === 'student' ? 'Student Signup' : 'Alumni Signup'}
                </h2>
                <div className="mt-4 flex justify-center space-x-3">
                  <div 
                    className={`h-2 w-16 rounded-full ${step === 1 ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gray-200'}`}
                  />
                  <div 
                    className={`h-2 w-16 rounded-full ${step === 2 ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-200'}`}
                  />
                </div>
              </div>

              <div className="space-y-6 mt-6">
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-2 gap-6">
                        <FormField
                          label="First Name"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          error={errors.firstName}
                          touched={touched.firstName}
                        />
                        <FormField
                          label="Last Name"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          error={errors.lastName}
                          touched={touched.lastName}
                        />
                      </div>
                      <FormField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={errors.email}
                        touched={touched.email}
                      />
                      <FormField
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={errors.password}
                        touched={touched.password}
                      />
                      <FormField
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={errors.confirmPassword}
                        touched={touched.confirmPassword}
                      />
                      <FormField
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={errors.phone}
                        touched={touched.phone}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {userType === 'student' ? (
                        <>
                          <FormField
                            label="University Name"
                            name="university"
                            value={formData.university}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            error={errors.university}
                            touched={touched.university}
                          />
                          <FormField
                            label="Branch"
                            name="branch"
                            value={formData.branch}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            error={errors.branch}
                            touched={touched.branch}
                            options={branches}
                          />
                          <FormField
                            label="Year of Study"
                            name="yearOfStudy"
                            value={formData.yearOfStudy}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            error={errors.yearOfStudy}
                            touched={touched.yearOfStudy}
                            options={studyYears}
                          />
                          {/* <FormField
                            label="Student ID"
                            name="studentId"
                            value={formData.studentId}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            error={errors.studentId}
                            touched={touched.studentId}
                          /> */}
                        </>
                      ) : (
                        <>
                          <FormField
                            label="Graduation Year"
                            name="graduationYear"
                            type="number"
                            value={formData.graduationYear}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            error={errors.graduationYear}
                            touched={touched.graduationYear}
                          />
                          <FormField
                            label="Current Company"
                            name="currentCompany"
                            value={formData.currentCompany}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            error={errors.currentCompany}
                            touched={touched.currentCompany}
                          />
                          <FormField
                            label="Job Title"
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            error={errors.jobTitle}
                            touched={touched.jobTitle}
                          />
                          <FormField
                            label="Industry"
                            name="industry"
                            value={formData.industry}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            error={errors.industry}
                            touched={touched.industry}
                          />
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between pt-6">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex items-center gap-2 px-6 py-3 ${step === 1 ? 'ml-auto' : ''} bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1`}
                >
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {step === 2 ? "Create Account" : "Next Step"}
                </button>
              </div>

              <AnimatePresence>
                {errors.submit && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 text-sm text-center text-red-600"
                  >
                    {errors.submit}
                  </motion.p>
                )}
              </AnimatePresence>
              
              {/* Added "Already have an account" to the bottom of the form */}
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={handleSignInClick}
                    className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
});

export default Signup;