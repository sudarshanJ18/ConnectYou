import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, LogOut, User, X, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardLayout = ({
  menuItems,
  activeMenuItem,
  setActiveMenuItem,
  userType,
  userName,
  children
}) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [unreadCount, setUnreadCount] = useState(3);
  const [isMounted, setIsMounted] = useState(false);

  // Theme color based on user type
  const getThemeColor = () => {
    return userType === 'student' ? 'purple' : 'blue';
  };

  const themeColor = getThemeColor();

  // Sample notifications
  useEffect(() => {
    setNotifications([
      { id: 1, text: 'New message from Jane Doe', time: '5 minutes ago', read: false },
      { id: 2, text: 'Upcoming event: Virtual Networking', time: '1 hour ago', read: false },
      { id: 3, text: 'Profile view by Tech Company Inc', time: '3 hours ago', read: false },
      { id: 4, text: 'New job posting matches your skills', time: 'Yesterday', read: true },
    ]);
    
    // Set mount state for entrance animations
    setTimeout(() => setIsMounted(true), 100);
    
    // Set time-based greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const markAsRead = (id) => {
    setNotifications(notifications.map(note => 
      note.id === id ? { ...note, read: true } : note
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <button 
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className={`p-2 rounded-full transition-colors duration-300 bg-${themeColor}-100 text-${themeColor}-600`}
        >
          {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div 
        className={`w-64 bg-white shadow-lg md:relative fixed inset-y-0 left-0 z-20 transform transition-transform duration-300 ease-in-out ${
          showMobileMenu ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isMounted ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="p-4 flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-md bg-${themeColor}-600 flex items-center justify-center`}>
            <span className="text-white font-bold">C</span>
          </div>
          <div>
            <h1 className={`text-2xl font-bold text-${themeColor}-600 transition-all duration-300`}>
              ConnectYou
            </h1>
            <p className={`text-sm text-${themeColor}-500 mt-1`}>
              {userType === 'student' ? 'Student Portal' : 'Alumni Portal'}
            </p>
          </div>
        </div>
        <nav className="mt-4">
          {menuItems.map((item, index) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => {
                setActiveMenuItem(item.name);
                setShowMobileMenu(false);
              }}
              className={`w-full flex items-center px-4 py-3 text-sm transition-all duration-300 ease-in-out transform ${
                activeMenuItem === item.name
                  ? `bg-${themeColor}-50 text-${themeColor}-600 border-r-4 border-${themeColor}-600 scale-105`
                  : 'text-gray-600 hover:bg-gray-50 hover:scale-102'
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay for mobile menu */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-opacity duration-500 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <span className="mr-2">{greeting},</span>
              <span className={`text-${themeColor}-600`}>{userName}!</span>
            </h2>
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button 
                  className={`p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 relative ${showNotifications ? `bg-${themeColor}-50` : ''}`}
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className={`h-5 w-5 ${unreadCount > 0 ? `text-${themeColor}-600` : ''}`} />
                  {unreadCount > 0 && (
                    <span className={`absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-${themeColor}-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse`}>
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {/* Notifications Panel */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-30 overflow-hidden animate-fadeIn">
                    <div className="p-3 border-b flex justify-between items-center">
                      <h3 className="font-medium">Notifications</h3>
                      <button 
                        onClick={clearNotifications}
                        className={`text-xs text-${themeColor}-600 hover:text-${themeColor}-800`}
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((note) => (
                          <div 
                            key={note.id} 
                            className={`p-3 border-b hover:bg-gray-50 transition-colors duration-150 ${note.read ? '' : `bg-${themeColor}-50`}`}
                            onClick={() => markAsRead(note.id)}
                          >
                            <p className="text-sm font-medium">{note.text}</p>
                            <p className="text-xs text-gray-500 mt-1">{note.time}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-center text-gray-500 text-sm">
                          No notifications
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                <MessageSquare className="h-5 w-5" />
              </button>
              
              <button className={`p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 hover:text-${themeColor}-600`}>
                <User className="h-5 w-5" />
              </button>
              
              <button 
                className="p-2 hover:bg-red-100 rounded-full transition-colors duration-200 hover:text-red-600"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 overflow-auto">
          <div className="animate-fadeInUp">
            {children}
          </div>
        </main>
      </div>

      {/* Global CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out;
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;