import React, { useEffect, useState } from 'react';
import { auth } from '../pages/firebaseConfig'; // Adjust path accordingly
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion'; // Import framer-motion
import './Dashboard.css'; // Import the CSS file

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    'User Registration',
    'Mentorship Matching',
    'Job Listings',
    'Messaging System',
    'Event Management',
    'Open Projects',
    'AI Chatbot',
    'Event Calendar',
    'Workshops',
    'Group Projects',
    'Resource Recommendations',
    'News & Updates',
    'Alumni Spotlights',
    'Career Pathway',
    'Portfolio Creation',
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <motion.div
        className={`sidebar ${isOpen ? 'open' : ''}`}
        initial={{ x: '-100%' }}
        animate={isOpen ? { x: '0%' } : { x: '-100%' }}
        transition={{ duration: 0.3 }}
      >
        <div className="sidebar-header">
          <h1 className="text-2xl font-bold text-center text-white">ConnectYou</h1>
          <button className="toggle-btn" onClick={toggleSidebar}>
            {isOpen ? '❌' : '☰'}
          </button>
        </div>
        <nav className="flex flex-col p-4">
          <AnimatePresence>
            {isOpen && (
              <motion.ul
                className="nav-list"
                initial={{ opacity: 0, maxHeight: 0 }}
                animate={{ opacity: 1, maxHeight: 500 }} // Adjust maxHeight as needed
                exit={{ opacity: 0, maxHeight: 0 }}
                transition={{ duration: 0.3 }}
              >
                {navItems.map((item, index) => (
                  <li key={index} className="nav-item">
                    <a
                      href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} // Change to appropriate routing if needed
                      className="nav-link"
                    >
                      {item}
                    </a>
                    {index < navItems.length - 1 && <div className="divider" />} {/* Divider between items */}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </nav>
      </motion.div>

      {/* Content Area */}
      <main className={`flex-grow bg-gradient-to-r from-blue-500 to-green-500 ${isOpen ? 'md:ml-64' : 'md:ml-16'} transition-all duration-300`}>
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
            {user ? (
              <>
                <h1 className="text-2xl font-bold text-center mb-4">Welcome, {user.displayName}</h1>
                <p className="text-gray-600 text-center mb-4">Here’s what you can do:</p>
                <div className="flex flex-col space-y-4">
                  <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300">
                    View Your Profile
                  </button>
                  <button className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-300">
                    Check Messages
                  </button>
                  <button className="bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 transition duration-300">
                    Explore Opportunities
                  </button>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-center mb-4">Please Sign In</h1>
                <p className="text-gray-600 text-center mb-4">Access personalized features by signing in.</p>
                <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300">
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
