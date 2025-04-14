import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  LineChart, GraduationCap, Users, Briefcase, MessageSquare,
  Calendar, BookOpen, HelpCircle, User
} from 'lucide-react';

import DashboardLayout from '../components/shared/DashboardLayout';
import AIAssistantPage from '../pages/Dashboard/AlumniAIAssistant';
import ELearningPage from '../pages/Dashboard/ELearningPage';
import JobsPage from '../pages/Dashboard/JobsPage';
import MentorPage from '../pages/Dashboard/MentorPage';
import MessagesPage from '../pages/Dashboard/MessagesPage';
import OpenProjectsPage from '../pages/Dashboard/OpenProjectsPage';
import ProfilePage from '../pages/Dashboard/ProfilePage';
import WorkshopsPage from '../pages/Dashboard/WorkshopsPage';
import EventsPage from '../pages/Dashboard/EventsPage';

const Dashboard = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("Dashboard");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: <LineChart className="w-4 h-4" />, path: "/" },
    { name: "E-Learning", icon: <GraduationCap className="w-4 h-4" />, path: "/dashboard/e-learning" },
    { name: "Mentorship", icon: <Users className="w-4 h-4" />, path: "/dashboard/mentorship" },
    { name: "Jobs & Internships", icon: <Briefcase className="w-4 h-4" />, path: "/dashboard/jobs" },
    { name: "Messages", icon: <MessageSquare className="w-4 h-4" />, path: "/dashboard/messages" },
    { name: "Events", icon: <Calendar className="w-4 h-4" />, path: "/dashboard/events" },
    { name: "Open-Projects", icon: <BookOpen className="w-4 h-4" />, path: "/dashboard/open-projects" },
    { name: "AI Assistant", icon: <HelpCircle className="w-4 h-4" />, path: "/dashboard/ai-assistant" },
    { name: "Workshops", icon: <Users className="w-4 h-4" />, path: "/dashboard/workshops" },
    { name: "Profile", icon: <User className="w-4 h-4" />, path: "/dashboard/profile" }
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeMenuItem={activeMenuItem}
      setActiveMenuItem={setActiveMenuItem}
      userType="student"
      userName="Alex"
    >
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
    </DashboardLayout>
  );
};

// Dashboard Content Component
const DashboardContent = () => {
  const notifications = [
    { id: 1, text: 'New course available: Advanced React', type: 'success' },
    { id: 2, text: 'Upcoming workshop: Web Development', type: 'info' },
    { id: 3, text: 'Assignment deadline tomorrow', type: 'warning' }
  ];

  const courses = [
    {
      title: 'Web Development Fundamentals',
      progress: 60,
      instructor: 'John Doe',
      nextLesson: 'CSS Layouts',
      image: 'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Data Structures & Algorithms',
      progress: 45,
      instructor: 'Jane Smith',
      nextLesson: 'Binary Trees',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Mobile App Development',
      progress: 30,
      instructor: 'Mike Johnson',
      nextLesson: 'UI Components',
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <div className="space-y-2">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg transform transition-all duration-300 hover:scale-[1.02] ${
              notification.type === 'success' ? 'bg-green-50 text-green-700' :
              notification.type === 'info' ? 'bg-blue-50 text-blue-700' :
              'bg-yellow-50 text-yellow-700'
            }`}
          >
            {notification.text}
          </div>
        ))}
      </div>

      {/* Courses */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Your Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.title}
              className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-[1.02]"
            >
              <img src={course.image} alt={course.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h4 className="font-semibold mb-2">{course.title}</h4>
                <p className="text-sm text-gray-600 mb-4">Instructor: {course.instructor}</p>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <span className="text-xs font-semibold inline-block text-purple-600">
                      Progress: {course.progress}%
                    </span>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                    <div
                      style={{ width: `${course.progress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-600"
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">Next: {course.nextLesson}</p>
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors duration-200">
                  Continue Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;