import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Users, Briefcase, MessageSquare, Calendar, BookOpen, HelpCircle, GraduationCap, User, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

const menuItems = [
  { name: "Dashboard", icon: <LineChart />, path: "/alumni" },
  { name: "Mentorship", icon: <Users />, path: "/alumni/mentorship" },
  { name: "Jobs", icon: <Briefcase />, path: "/alumni/job-postings" },
  { name: "Messages", icon: <MessageSquare />, path: "/alumni/messages", badge: 3 },
  { name: "Events", icon: <Calendar />, path: "/alumni/events" },
  { name: "Knowledge", icon: <BookOpen />, path: "/alumni/knowledge" },
  { name: "AI Assistant", icon: <HelpCircle />, path: "/alumni/ai-assistant" },
  { name: "Projects", icon: <GraduationCap />, path: "/alumni/projects" },
  { name: "Profile", icon: <User />, path: "/alumni/profile" }
];

const AlumniNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  // Animation variants
  const sidebarVariants = {
    expanded: { width: "16rem" },
    collapsed: { width: "5rem" }
  };

  const menuItemVariants = {
    hover: { 
      scale: 1.05, 
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      transition: { duration: 0.2 }
    },
    active: { 
      backgroundColor: "#2563eb",
      color: "#ffffff",
      transition: { duration: 0.3 }
    },
    inactive: { 
      backgroundColor: "transparent",
      color: "#000000",
      transition: { duration: 0.3 }
    }
  };

  const iconVariants = {
    initial: { rotate: 0 },
    hover: { rotate: 5, scale: 1.1, transition: { duration: 0.2 } }
  };

  const logoVariants = {
    initial: { y: 0 },
    animate: { 
      y: [0, -5, 0],
      transition: { 
        repeat: Infinity,
        repeatType: "reverse",
        duration: 2
      }
    }
  };

  const badgeVariants = {
    initial: { scale: 0 },
    animate: { 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 500,
        damping: 15
      }
    }
  };

  const logoutVariants = {
    initial: { backgroundColor: "#dc2626" },
    hover: { 
      backgroundColor: "#b91c1c",
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="h-screen bg-white shadow-md fixed top-0 left-0 flex flex-col overflow-hidden"
      variants={sidebarVariants}
      animate={isCollapsed ? "collapsed" : "expanded"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Collapse Toggle */}
      <div className="absolute right-2 top-4">
        <motion.button
          className="p-1 rounded-full bg-gray-100 text-gray-600"
          onClick={() => setIsCollapsed(!isCollapsed)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </motion.button>
      </div>

      {/* Sidebar Header */}
      <motion.div 
        className="flex justify-center items-center py-6 px-4"
        variants={logoVariants}
        initial="initial"
        animate="animate"
      >
        <motion.span className="text-xl font-bold">
          🎓 {!isCollapsed && "Alumni Portal"}
        </motion.span>
      </motion.div>

      {/* Navigation Menu */}
      <ul className="space-y-2 flex-1 px-3">
        {menuItems.map((item) => (
          <motion.li 
            key={item.path}
            onHoverStart={() => setHoveredItem(item.path)}
            onHoverEnd={() => setHoveredItem(null)}
          >
            <motion.button
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition relative ${
                isCollapsed ? "justify-center" : ""
              }`}
              variants={menuItemVariants}
              initial="inactive"
              animate={location.pathname === item.path ? "active" : hoveredItem === item.path ? "hover" : "inactive"}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                variants={iconVariants}
                initial="initial"
                animate={hoveredItem === item.path ? "hover" : "initial"}
              >
                {item.icon}
              </motion.div>
              
              {!isCollapsed && <span>{item.name}</span>}
              
              {item.badge && (
                <motion.div 
                  className="absolute right-2 top-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  variants={badgeVariants}
                  initial="initial"
                  animate="animate"
                >
                  {item.badge}
                </motion.div>
              )}
            </motion.button>
          </motion.li>
        ))}
      </ul>

      {/* Logout Button */}
      <div className="px-3 pb-4">
        <motion.button 
          className={`w-full bg-red-600 text-white p-3 rounded-lg flex items-center justify-center gap-2`}
          variants={logoutVariants}
          initial="initial"
          whileHover="hover"
          whileTap={{ scale: 0.95 }}
          onClick={() => console.log('Logging out...')}
        >
          <LogOut size={isCollapsed ? 20 : 16} />
          {!isCollapsed && <span>Logout</span>}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AlumniNavbar;