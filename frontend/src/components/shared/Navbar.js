import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Users, Briefcase, MessageSquare, Calendar,
  BookOpen, HelpCircle, User, LogOut, Award,
  ChevronLeft, ChevronRight, Menu, GraduationCap, Lightbulb
} from 'lucide-react';

const Navbar = ({ type = 'student' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = type === 'student' ? [
    { name: "Dashboard", icon: <LineChart />, path: "/dashboard" },
    { name: "E-Learning", icon: <GraduationCap />, path: "/dashboard/e-learning" },
    { name: "Mentorship", icon: <Users />, path: "/dashboard/mentorship" },
    { name: "Jobs & Internships", icon: <Briefcase />, path: "/dashboard/jobs" },
    { name: "Messages", icon: <MessageSquare />, path: "/dashboard/messages", badge: 2 },
    { name: "Events", icon: <Calendar />, path: "/dashboard/events" },
    { name: "Projects", icon: <BookOpen />, path: "/dashboard/projects" },
    { name: "AI Assistant", icon: <HelpCircle />, path: "/dashboard/ai-assistant" },
    { name: "Workshops", icon: <Users />, path: "/dashboard/workshops" },
    { name: "Profile", icon: <User />, path: "/dashboard/profile" }
  ] : [
    { name: "Dashboard", icon: <LineChart />, path: "/alumni" },
    { name: "E-Learning", icon: <GraduationCap />, path: "/alumni/e-learning" },
    { name: "Mentorship", icon: <Users />, path: "/alumni/mentorship" },
    { name: "Job Postings", icon: <Briefcase />, path: "/alumni/job-postings" },
    { name: "Messages", icon: <MessageSquare />, path: "/alumni/messages", badge: 3 },
    { name: "Events", icon: <Calendar />, path: "/alumni/events" },
    { name: "Knowledge Hub", icon: <Lightbulb />, path: "/alumni/knowledge" },
    { name: "AI Assistant", icon: <HelpCircle />, path: "/alumni/ai-assistant" },
    { name: "Projects", icon: <BookOpen />, path: "/alumni/projects" },
    { name: "Profile", icon: <User />, path: "/alumni/profile" }
  ];

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const colors = {
    student: {
      primary: 'from-purple-800 to-purple-900',
      accent: 'purple-800',
      hover: 'rgba(126, 34, 206, 0.1)',
      active: '#7e22ce'
    },
    alumni: {
      primary: 'from-blue-800 to-blue-900',
      accent: 'blue-800',
      hover: 'rgba(30, 58, 138, 0.1)',
      active: '#1e40af'
    }
  };

  const currentColors = colors[type];

  return (
    <>
      {isMobile && mobileOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      {isMobile && (
        <motion.button
          className={`fixed top-4 left-4 z-20 bg-${currentColors.accent} text-white p-2 rounded-full shadow-lg`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Menu size={24} />
        </motion.button>
      )}

      <AnimatePresence>
        <motion.div
          className={`h-screen bg-white shadow-xl fixed top-0 left-0 flex flex-col overflow-hidden z-30 border-r border-gray-200`}
          initial={isMobile ? { x: "-100%" } : { width: "240px" }}
          animate={
            isMobile 
              ? { x: mobileOpen ? 0 : "-100%" }
              : { width: isCollapsed ? "72px" : "240px" }
          }
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className={`flex items-center justify-between px-4 py-5 bg-gradient-to-r ${currentColors.primary}`}>
            <div className="flex items-center">
              {type === 'student' ? (
                <GraduationCap className="text-white h-6 w-6 mr-2" />
              ) : (
                <Award className="text-yellow-400 h-6 w-6 mr-2" />
              )}
              {(!isCollapsed || (isMobile && mobileOpen)) && (
                <span className="font-bold text-white text-lg">
                  {type === 'student' ? 'Student Portal' : 'Alumni Portal'}
                </span>
              )}
            </div>

            {!isMobile && (
              <motion.button
                className={`p-1 rounded-full bg-${currentColors.accent} text-white hover:opacity-80`}
                onClick={() => setIsCollapsed(!isCollapsed)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </motion.button>
            )}
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <motion.li key={item.path}>
                  <motion.button
                    onClick={() => {
                      navigate(item.path);
                      if (isMobile) setMobileOpen(false);
                    }}
                    className={`w-full flex items-center rounded-lg p-3 relative ${
                      isCollapsed && !isMobile ? "justify-center" : "justify-start"
                    }`}
                    whileHover={{
                      backgroundColor: currentColors.hover,
                      scale: 1.02
                    }}
                    animate={{
                      backgroundColor: location.pathname === item.path ? currentColors.active : "transparent",
                      color: location.pathname === item.path ? "#ffffff" : "#4b5563"
                    }}
                  >
                    <span className={`${location.pathname === item.path ? "text-white" : `text-${currentColors.accent}`}`}>
                      {item.icon}
                    </span>
                    
                    {(!isCollapsed || (isMobile && mobileOpen)) && (
                      <span className="ml-3 font-medium text-sm">
                        {item.name}
                      </span>
                    )}
                    
                    {item.badge && (!isCollapsed || (isMobile && mobileOpen)) && (
                      <span className={`absolute right-2 bg-${currentColors.accent} text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold`}>
                        {item.badge}
                      </span>
                    )}
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Logout Button */}
          <div className="p-3 border-t border-gray-200">
            <motion.button 
              className={`w-full bg-white text-${currentColors.accent} border border-${currentColors.accent} p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                localStorage.clear();
                navigate('/login');
              }}
            >
              <LogOut size={18} />
              {(!isCollapsed || (isMobile && mobileOpen)) && <span>Sign Out</span>}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default Navbar;