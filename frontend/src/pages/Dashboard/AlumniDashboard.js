import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Briefcase, 
  MessageSquare, 
  Calendar, 
  Award, 
  Building2, 
  MapPin, 
  Clock, 
  Bell,
  GraduationCap,
  BookOpen,
  Plus,
  ExternalLink,
  ChevronRight
} from "lucide-react";

// Animation variants remain the same
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const iconVariants = {
  hover: {
    rotate: 360,
    scale: 1.2,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

const AlumniDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      setSidebarOpen(!isMobileView);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    // Get username from localStorage
    const getUsername = () => {
      try {
        const storedName = localStorage.getItem('userName');
        
        if (storedName) {
          setUserName(storedName);
        }
      } catch (error) {
        console.error("Error getting username from localStorage:", error);
      }
    };
    
    // Fetch courses from API
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/courses');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const coursesData = await response.json();
        setCourses(coursesData);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setError("Failed to load courses. Please try again later.");
        
        // Set fallback data if API fails
        setCourses([
          {
            id: 1,
            title: "Web Development for Beginners",
            category: "Programming",
            progress: 75,
            students: 24,
            instructor: "Jane Smith",
            duration: "8 weeks",
            level: "Beginner",
            description: "Learn the fundamentals of web development including HTML, CSS, and JavaScript."
          },
          {
            id: 2,
            title: "Advanced Data Science",
            category: "Data Science",
            progress: 60,
            students: 18,
            instructor: "Robert Johnson",
            duration: "10 weeks",
            level: "Advanced",
            description: "Explore advanced data analysis techniques, machine learning algorithms, and data visualization."
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    getUsername();
    fetchCourses();
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Mock data with all stats set to 0
  const stats = [
    {
      title: "Mentorships",
      count: 0,
      description: "Active Mentees",
      icon: <Users className="w-6 h-6 text-blue-500" />,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Job Listings",
      count: 0,
      description: "Active Listings",
      icon: <Briefcase className="w-6 h-6 text-green-500" />,
      bgColor: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      title: "Upcoming Events",
      count: 0,
      description: "This Month",
      icon: <Calendar className="w-6 h-6 text-purple-500" />,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      title: "Learning",
      count: courses.length || 0,
      description: "Your Courses",
      icon: <BookOpen className="w-6 h-6 text-orange-500" />,
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
    },
  ];

  // Sidebar toggle
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.div 
        className={`bg-white shadow-md h-full z-20 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}
        animate={{ width: sidebarOpen ? 256 : 80 }}
        style={{ position: 'fixed', left: 0, top: 0 }}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {sidebarOpen && (
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xl font-bold text-blue-800"
            >
              Alumni Portal
            </motion.h1>
          )}
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            {sidebarOpen ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5 transform rotate-180" />
            )}
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 rounded-full p-3">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            {sidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="ml-3"
              >
                <p className="font-medium">{userName || 'Alumni'}</p>
                <p className="text-sm text-gray-600">Class of 2022</p>
              </motion.div>
            )}
          </div>
          
          <nav className="space-y-2">
            {[
              { id: "overview", name: "Dashboard", icon: <Users className="w-5 h-5" /> },
              { id: "courses", name: "My Courses", icon: <BookOpen className="w-5 h-5" /> },
              { id: "events", name: "Events", icon: <Calendar className="w-5 h-5" /> },
              { id: "jobs", name: "Job Postings", icon: <Briefcase className="w-5 h-5" /> },
            ].map((item) => (
              <button
                key={item.id}
                className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-100 text-blue-800"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <div className="flex items-center justify-center">
                  {item.icon}
                </div>
                {sidebarOpen && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="ml-3 font-medium"
                  >
                    {item.name}
                  </motion.span>
                )}
              </button>
            ))}
          </nav>
          
          {/* Logout button at bottom of sidebar */}
          {sidebarOpen && (
            <div className="absolute bottom-4 left-0 w-full px-4">
              <button 
                onClick={handleLogout}
                className="w-full p-3 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="flex-1 overflow-auto"
        animate={{ 
          marginLeft: sidebarOpen ? '256px' : '80px',
          width: sidebarOpen ? 'calc(100% - 256px)' : 'calc(100% - 80px)' 
        }}
        transition={{ duration: 0.3 }}
        style={{ position: 'relative' }}
      >
        {/* Header */}
        <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">
              {activeTab === "overview" && "Alumni Dashboard"}
              {activeTab === "courses" && "My Learning"}
              {activeTab === "events" && "Alumni Events"}
              {activeTab === "jobs" && "Job Postings"}
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-800 font-medium">
                  {userName ? userName.charAt(0) : 'S'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                  <p>{error}</p>
                </div>
              )}
            
              {activeTab === "overview" && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  {/* Welcome Section with personalized greeting */}
                  <motion.div 
                    variants={cardVariants}
                    className="bg-white p-6 rounded-lg shadow-md mb-6"
                  >
                    <h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome back, {userName || 'Student'}!</h1>
                    <p className="text-gray-600">
                      Check your course progress and continue learning.
                    </p>
                  </motion.div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        variants={cardVariants}
                        whileHover={{
                          scale: 1.03,
                          transition: { type: "spring", stiffness: 300 },
                        }}
                        className={`p-6 rounded-lg shadow-md ${stat.bgColor} transform transition-all duration-300`}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-lg font-semibold">{stat.title}</h2>
                          <motion.div
                            variants={iconVariants}
                            whileHover="hover"
                            className="transform-gpu"
                          >
                            {stat.icon}
                          </motion.div>
                        </div>
                        <motion.p
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 }}
                          className={`text-3xl font-bold ${stat.textColor}`}
                        >
                          {stat.title === "Learning" ? courses.length : stat.count}
                        </motion.p>
                        <p className="text-gray-600">{stat.description}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* My Courses - Featured section showing only courses */}
                  <motion.div
                    variants={cardVariants}
                    className="bg-white p-6 rounded-lg shadow-md mb-6"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">My Courses</h2>
                      <button 
                        className="text-blue-600 text-sm hover:underline"
                        onClick={() => setActiveTab("courses")}
                      >
                        View All
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {courses.length > 0 ? (
                        courses.slice(0, 2).map((course) => (
                          <motion.div
                            key={course.id}
                            whileHover={{ scale: 1.02 }}
                            className="p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-medium">{course.title}</h3>
                                <p className="text-sm text-gray-600">{course.category} • {course.level}</p>
                              </div>
                              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {course.students} students
                              </span>
                            </div>
                            
                            <div className="mt-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Course Progress</span>
                                <span>{course.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full" 
                                  style={{ width: `${course.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-6 bg-gray-50 rounded-lg">
                          <p className="text-gray-600">No courses found. Explore our catalog to get started!</p>
                          <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            Browse Courses
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Courses Tab */}
              {activeTab === "courses" && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  className="space-y-6"
                >
                  {/* Courses Header with personalized greeting */}
                  <motion.div 
                    variants={cardVariants}
                    className="bg-white p-6 rounded-lg shadow-md mb-6"
                  >
                    <h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome back, {userName || 'Student'}!</h1>
                    <p className="text-gray-600">
                      Track your progress and continue your learning journey.
                    </p>
                  </motion.div>
                  
                  {/* Courses Grid */}
                  {courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {courses.map((course) => (
                        <motion.div
                          key={course.id}
                          variants={cardVariants}
                          whileHover={{ scale: 1.02 }}
                          className="bg-white p-6 rounded-lg shadow-md"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold">{course.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{course.category}</p>
                            </div>
                            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                              {course.level}
                            </span>
                          </div>
                          
                          <p className="text-gray-700 text-sm mt-3">
                            {course.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-blue-600" />
                              <span>{course.students} students</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-blue-600" />
                              <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <GraduationCap className="w-4 h-4 text-blue-600" />
                              <span>{course.instructor}</span>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Course Progress</span>
                              <span>{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <button className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            Continue Learning
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-white rounded-lg shadow-md">
                      <BookOpen className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">No courses enrolled</h3>
                      <p className="text-gray-600 max-w-md mx-auto mb-6">
                        You haven't enrolled in any courses yet. Browse our catalog to find courses that match your interests.
                      </p>
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Browse Course Catalog
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Placeholder for other tabs */}
              {activeTab === "events" && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Events Management</h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    This tab would show the Alumni Events functionality.
                  </p>
                </div>
              )}
              
              {activeTab === "jobs" && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Job Postings</h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    This tab would show the Job Postings functionality.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AlumniDashboard;