import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LineChart, Users, Briefcase, MessageSquare, Calendar, BookOpen,
  HelpCircle, GraduationCap, User, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';

const menuItems = [
  { name: "Dashboard", icon: LineChart, path: "/alumni" },
  { name: "Mentorship", icon: Users, path: "/alumni/mentorship" },
  { name: "Jobs", icon: Briefcase, path: "/alumni/job-postings" },
  { name: "Messages", icon: MessageSquare, path: "/alumni/messages", badge: 3 },
  { name: "Events", icon: Calendar, path: "/alumni/events" },
  { name: "Knowledge", icon: BookOpen, path: "/alumni/knowledge" },
  { name: "AI Assistant", icon: HelpCircle, path: "/alumni/ai-assistant" },
  { name: "Projects", icon: GraduationCap, path: "/alumni/projects" },
  { name: "Profile", icon: User, path: "/alumni/profile" }
];

const AlumniNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const sidebarVariants = {
    expanded: { width: "16rem" },
    collapsed: { width: "4.5rem" }
  };

  const logoVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -3, 0],
      transition: { repeat: Infinity, duration: 2 }
    }
  };

  const logoutVariants = {
    initial: { backgroundColor: "#dc2626" },
    hover: { backgroundColor: "#b91c1c", scale: 1.05 }
  };

  return (
    <motion.div
      className="h-screen bg-white shadow-xl fixed top-0 left-0 flex flex-col border-r z-50"
      variants={sidebarVariants}
      animate={isCollapsed ? "collapsed" : "expanded"}
      transition={{ duration: 0.3 }}
    >
      {/* Toggle Button */}
      <div className="absolute top-3 right-2">
        <motion.button
          className="p-1 bg-gray-100 rounded-full"
          onClick={() => setIsCollapsed(!isCollapsed)}
          whileHover={{ scale: 1.1 }}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </motion.button>
      </div>

      {/* Logo/Header */}
      <motion.div
        className="flex items-center justify-center py-6 px-4"
        variants={logoVariants}
        initial="initial"
        animate="animate"
      >
        <span className="text-2xl font-bold text-purple-600">
          🎓 {!isCollapsed && "Alumni Portal"}
        </span>
      </motion.div>

      {/* Nav Menu */}
      <ul className="flex-1 px-2 space-y-2 overflow-y-auto">
        {menuItems.map(({ name, icon: Icon, path, badge }) => {
          const isActive = location.pathname === path;

          return (
            <motion.li
              key={path}
              onHoverStart={() => setHoveredItem(path)}
              onHoverEnd={() => setHoveredItem(null)}
            >
              <motion.button
                onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all relative 
                  ${isCollapsed ? "justify-center" : ""}
                  ${isActive
                    ? "bg-purple-100 text-purple-700 font-semibold shadow-inner"
                    : "hover:bg-purple-50 text-gray-600"}`
                }
                whileTap={{ scale: 0.97 }}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-purple-700" : "text-gray-500"}`} />
                {!isCollapsed && <span>{name}</span>}
                {badge && !isCollapsed && (
                  <motion.div
                    className="absolute right-3 top-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    {badge}
                  </motion.div>
                )}
              </motion.button>
            </motion.li>
          );
        })}
      </ul>

      {/* Logout */}
      <div className="p-3 border-t">
        <motion.button
          className="w-full p-3 bg-red-600 text-white rounded-lg flex items-center justify-center gap-2"
          variants={logoutVariants}
          initial="initial"
          whileHover="hover"
          whileTap={{ scale: 0.96 }}
          onClick={() => console.log("Logging out...")}
        >
          <LogOut size={isCollapsed ? 20 : 16} />
          {!isCollapsed && <span>Logout</span>}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AlumniNavbar;
