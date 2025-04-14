import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LineChart, GraduationCap, Users, Briefcase, MessageSquare, 
  Calendar, BookOpen, HelpCircle, User 
} from 'lucide-react';

const menuItems = [
  { name: "Dashboard", icon: LineChart, path: "/dashboard" },
  { name: "E-Learning", icon: GraduationCap, path: "/dashboard/e-learning" },
  { name: "Mentorship", icon: Users, path: "/dashboard/mentorship" },
  { name: "Jobs & Internships", icon: Briefcase, path: "/dashboard/jobs" },
  { name: "Messages", icon: MessageSquare, path: "/dashboard/messages" },
  { name: "Events", icon: Calendar, path: "/dashboard/events" },
  { name: "Open-Projects", icon: BookOpen, path: "/dashboard/open-projects" },
  { name: "AI Assistant", icon: HelpCircle, path: "/dashboard/ai-assistant" },
  { name: "Workshops", icon: Users, path: "/dashboard/workshops" },
  { name: "Profile", icon: User, path: "/dashboard/profile" }
];

const StudentNavbar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white shadow-xl h-screen fixed left-0 top-0 flex flex-col border-r">
      <div className="p-6 border-b">
        <h1 className="text-3xl font-extrabold text-purple-600 tracking-tight">Connect<span className="text-purple-400">You</span></h1>
        <p className="text-sm text-gray-400 mt-1">Empowering students</p>
      </div>

      <nav className="flex-1 overflow-y-auto mt-2 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 relative
                ${isActive
                  ? "bg-purple-100 text-purple-700 font-semibold shadow-inner"
                  : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                }`}
              
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-purple-700" : "text-gray-500"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t text-xs text-center text-gray-400">
        © {new Date().getFullYear()} ConnectYou
      </div>
    </div>
  );
};

export default StudentNavbar;
