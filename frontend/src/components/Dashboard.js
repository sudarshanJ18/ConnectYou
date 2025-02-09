import React, { useState, useEffect } from "react";
import {
  Bell, MessageSquare, LogOut, ChevronRight, User, BookOpen, 
  Briefcase, Calendar, Users, HelpCircle, LineChart, GraduationCap, 
  Play, Book, Award, Clock, MapPin
} from "lucide-react";
import { 
 
  Routes, 
  Route, 
  Link, 
  Navigate 
} from "react-router-dom";

// Import page components
import AIAssistantPage from "../pages/Dashboard/AIAssistantPage";
import ELearningPage from "../pages/Dashboard/ELearningPage";
import JobsPage from "../pages/Dashboard/JobsPage";
import MentorPage from "../pages/Dashboard/MentorPage";
import MessagesPage from "../pages/Dashboard/MessagesPage";
import OpenProjectsPage from "../pages/Dashboard/OpenProjectsPage";
import WorkshopsPage from "../pages/Dashboard/WorkshopsPage";

// Dashboard Content Component
const DashboardContent = () => {
  const notifications = [
    { id: 1, text: 'New mentor match available!', type: 'success' },
    { id: 2, text: 'Upcoming workshop: Advanced React', type: 'info' },
    { id: 3, text: 'Career fair next week', type: 'warning' }
  ];

  const featuredServices = [
    {
      title: 'Mentorship Matching',
      description: 'Connect with industry professionals who can guide your career journey',
      icon: <Users className="w-8 h-8" />,
      action: 'Find Mentor'
    },
    {
      title: 'Job Opportunities',
      description: 'Explore latest positions matching your skills and interests',
      icon: <Briefcase className="w-8 h-8" />,
      action: 'View Jobs'
    },
    {
      title: 'Skill Workshops',
      description: 'Join interactive sessions to enhance your professional skills',
      icon: <BookOpen className="w-8 h-8" />,
      action: 'Browse Workshops'
    }
  ];

  const courses = [
    {
      title: 'Advanced React Development',
      progress: 75,
      duration: '8 weeks',
      instructor: 'Dr. Sarah Chen',
      nextLesson: 'State Management with Redux',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Cloud Architecture Fundamentals',
      progress: 45,
      duration: '10 weeks',
      instructor: 'Mark Rodriguez',
      nextLesson: 'Microservices Architecture',
      image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Data Science Masterclass',
      progress: 30,
      duration: '12 weeks',
      instructor: 'Dr. Emily Watson',
      nextLesson: 'Machine Learning Basics',
      image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const instructors = [
    {
      name: 'Dr. Sarah Chen',
      role: 'AI Research Lead',
      company: 'TechCorp',
      expertise: 'Machine Learning, Neural Networks',
      availability: 'Available for mentoring',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Mark Rodriguez',
      role: 'Senior Software Architect',
      company: 'GlobalTech',
      expertise: 'System Design, Cloud Architecture',
      availability: 'Available for workshops',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Data Science Director',
      company: 'DataCo',
      expertise: 'Big Data, Analytics',
      availability: 'Available for project review',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    
    <>
      {/* Notifications Section */}
      <div className="space-y-2 mb-6">
        {notifications.map((notification, index) => (
          <div 
            key={notification.id} 
            className={`p-4 rounded-lg transform transition-all duration-300 hover:scale-[1.02] ${
              notification.type === 'success' ? 'bg-green-50 text-green-700' :
              notification.type === 'info' ? 'bg-blue-50 text-blue-700' :
              'bg-yellow-50 text-yellow-700'
            }`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {notification.text}
          </div>
        ))}
      </div>

      {/* Courses Section */}
      <h3 className="text-lg font-semibold mb-4">Your Learning Journey</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {courses.map((course, index) => (
          <div 
            key={course.title} 
            className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <img src={course.image} alt={course.title} className="w-full h-40 object-cover" />
            <div className="p-6">
              <h4 className="text-lg font-semibold mb-2">{course.title}</h4>
              <p className="text-sm text-gray-600 mb-4">Instructor: {course.instructor}</p>
              
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <span className="text-xs font-semibold inline-block text-purple-600">
                    Progress: {course.progress}%
                  </span>
                  <span className="text-xs font-semibold inline-block text-purple-600">
                    {course.duration}
                  </span>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                  <div 
                    style={{ width: `${course.progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-600 transition-all duration-500"
                  ></div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">Next: {course.nextLesson}</p>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center">
                <Play className="w-4 h-4 mr-2" />
                Continue Learning
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Services Section */}
      <h3 className="text-lg font-semibold mb-4">Featured Services</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {featuredServices.map((service, index) => (
          <div 
            key={service.title} 
            className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="mb-2">{service.icon}</div>
            <h4 className="text-lg font-semibold mb-2">{service.title}</h4>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center">
              {service.action}
              <ChevronRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        ))}
      </div>

      {/* Instructors Section */}
      <h3 className="text-lg font-semibold mb-4">Featured Instructors</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instructors.map((instructor, index) => (
          <div 
            key={instructor.name} 
            className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <img src={instructor.image} alt={instructor.name} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h4 className="text-lg font-semibold">{instructor.name}</h4>
              <p className="text-gray-600">{instructor.role} at {instructor.company}</p>
              <div className="flex items-center mt-4">
                <Award className="w-4 h-4 text-purple-600 mr-2" />
                <p className="text-sm text-gray-600">{instructor.expertise}</p>
              </div>
              <div className="flex items-center mt-2">
                <Book className="w-4 h-4 text-green-600 mr-2" />
                <p className="text-sm text-green-600">{instructor.availability}</p>
              </div>
              <button className="w-full mt-4 border border-purple-600 text-purple-600 py-2 px-4 rounded hover:bg-purple-50 transition-colors duration-200">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

// Profile Page Component
const ProfilePage = () => {
  const userProfile = {
    name: "Alex Johnson",
    role: "Software Developer",
    email: "alex.j@example.com",
    location: "San Francisco, CA",
    skills: ["React", "Node.js", "Python", "AWS"],
    education: "MS Computer Science",
    interests: ["AI/ML", "Web Development", "Cloud Architecture"]
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-6">
          <div className="w-24 h-24 bg-purple-200 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-purple-600" />
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-bold">{userProfile.name}</h2>
            <p className="text-gray-600">{userProfile.role}</p>
            <p className="text-gray-500">{userProfile.location}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <p className="text-gray-600 mb-2">Email: {userProfile.email}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Education</h3>
            <p className="text-gray-600">{userProfile.education}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {userProfile.skills.map(skill => (
              <span key={skill} className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {userProfile.interests.map(interest => (
              <span key={interest} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Events Page Component
const EventsPage = () => {
  const events = [
    {
      title: "Tech Career Fair 2025",
      date: "March 15, 2025",
      time: "10:00 AM - 4:00 PM",
      location: "Virtual Event",
      description: "Connect with top tech companies and explore career opportunities."
    },
    {
      title: "Web Development Workshop",
      date: "March 20, 2025",
      time: "2:00 PM - 5:00 PM",
      location: "Online",
      description: "Learn modern web development practices and tools."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
      <div className="grid gap-6">
        {events.map((event) => (
          <div key={event.title} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-600"><Calendar className="inline w-4 h-4 mr-2" />{event.date}</p>
                <p className="text-gray-600"><Clock className="inline w-4 h-4 mr-2" />{event.time}</p>
              </div>
              <div>
                <p className="text-gray-600"><MapPin className="inline w-4 h-4 mr-2" />{event.location}</p>
              </div>
            </div>
            <p className="text-gray-700">{event.description}</p>
            <button className="mt-4 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors duration-200">
              Register Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("Dashboard");
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: <LineChart className="w-4 h-4" />, path: "/" },
    { name: "E-Learning", icon: <GraduationCap className="w-4 h-4" />, path: "/e-learning" },
    { name: "Mentorship", icon: <Users className="w-4 h-4" />, path: "/mentorship" },
    { name: "Jobs & Internships", icon: <Briefcase className="w-4 h-4" />, path: "/jobs" },
    { name: "Messages", icon: <MessageSquare className="w-4 h-4" />, path: "/messages" },
    { name: "Events", icon: <Calendar className="w-4 h-4" />, path: "/events" },
    { name: "Open-Projects", icon: <BookOpen className="w-4 h-4" />, path: "/open-projects" },
    { name: "AI Assistant", icon: <HelpCircle className="w-4 h-4" />, path: "/ai-assistant" },
    { name: "Workshops", icon: <Users className="w-4 h-4" />, path: "/workshops" },
    { name: "Profile", icon: <User className="w-4 h-4" />, path: "/profile" }
  ];
  

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-purple-600 animate-fade-in">ConnectYou</h1>
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setActiveMenuItem(item.name)}
              className={`w-full flex items-center px-4 py-3 text-sm transition-all duration-200 ease-in-out ${
                activeMenuItem === item.name
                  ? "bg-purple-50 text-purple-600 border-r-4 border-purple-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Welcome back, Alex!</h2>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                <User className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Routes */}
        <main className="p-6">
        <Routes>
              <Route path="/" element={<DashboardContent />} />
              <Route path="/e-learning" element={<ELearningPage />} />
              <Route path="/mentorship" element={<MentorPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/open-projects" element={<OpenProjectsPage />} />
              <Route path="/ai-assistant" element={<AIAssistantPage />} />
              <Route path="/workshops" element={<WorkshopsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;