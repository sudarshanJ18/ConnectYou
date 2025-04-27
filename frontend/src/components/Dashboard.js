import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  Briefcase, 
  Users, 
  Bell, 
  Search,
  ChevronRight,
  Star,
  Clock,
  MapPin,
  Building,
  Play,
  TrendingUp,
  BarChart,
  Award,
  LayoutDashboard,
  MessageSquare
} from 'lucide-react';
import Navbar from './shared/Navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    coursesCompleted: 5,
    eventsAttended: 3,
    jobsApplied: 8,
    mentorSessions: 2
  });

  const [chatbotOpen, setChatbotOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get the auth token from localStorage
        const token = localStorage.getItem('token');
        
        // Set up headers with authentication token
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Use Authorization header with Bearer prefix
        };
  
        // Fetch data for all sections in parallel, including auth headers for protected routes
        const [coursesRes, eventsRes, jobsRes, mentorsRes, notificationsRes] = await Promise.all([
          fetch('http://localhost:5000/api/courses'),
          fetch('http://localhost:5000/api/events'),
          fetch('http://localhost:5000/api/jobs'),
          fetch('http://localhost:5000/api/mentor', { headers }), // Add auth headers here
          fetch('http://localhost:5000/api/notifications')
        ]);
  
        // Parse all responses
        const coursesData = await coursesRes.json();
        const eventsData = await eventsRes.json();
        const jobsData = await jobsRes.json();
        
        // Handle mentor data with proper error checking
        let mentorsData = [];
        if (mentorsRes.ok) {
          mentorsData = await mentorsRes.json();
        } else {
          console.error('Error fetching mentors:', mentorsRes.status);
        }
        
        // Handle notifications separately as it might not exist yet
        let notificationsData = [];
        if (notificationsRes.ok) {
          notificationsData = await notificationsRes.json();
        }
  
        // Set state with fetched data
        setCourses(coursesData.slice(0, 6));
        setEvents(eventsData.slice(0, 3));
        setJobs(jobsData.slice(0, 5));
        setMentors(mentorsData.slice(0, 3));
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Handle gracefully - we'll just display placeholders
      } finally {
        setLoading(false);
      }
    };
  
    fetchDashboardData();
    
    // Get user name from localStorage
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  // Format date for events
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if an event is upcoming
  const isUpcoming = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    return eventDate >= today;
  };

  // Toggle chatbot
  const toggleChatbot = () => {
    setChatbotOpen(!chatbotOpen);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <div className="flex-none">
          <Navbar type="student" />
        </div>
        <div className="flex-1 ml-64">
          <div className="p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg mb-6"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-none">
        <Navbar type="student" />
      </div>
      <div className="flex-1 ml-64">
        {/* Header with welcome and search */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome back, {userName || 'Student'}!</h1>
                <p className="text-purple-100">Your learning journey continues today</p>
              </div>
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses, events, jobs..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-white/60"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6 flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Courses Completed</h3>
                <p className="text-2xl font-bold"> 0</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Events Attended</h3>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Jobs Applied</h3>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex items-center">
              <div className="rounded-full bg-amber-100 p-3 mr-4">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Mentor Sessions</h3>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </div>

          {/* Learning Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Current Courses */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Your Courses</h2>
                <button 
                  onClick={() => navigate('/dashboard/e-learning')}
                  className="text-purple-600 hover:text-purple-800 text-sm flex items-center"
                >
                  View all courses
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="p-6">
                {courses.length > 0 ? (
                  <div className="space-y-4">
                    {courses.slice(0, 3).map(course => (
                      <div key={course.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                        <div className="w-16 h-16 flex-shrink-0">
                          <img 
                            src={`http://localhost:5000/${course.thumbnail}`}
                            alt={course.title} 
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-800">{course.category}</span>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {course.duration}
                            </div>
                          </div>
                          <h3 className="mt-1 text-base font-medium text-gray-900 truncate">{course.title}</h3>
                        </div>
                        <button className="flex-shrink-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors">
                          <Play className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">You haven't enrolled in any courses yet</p>
                    <button 
                      onClick={() => navigate('/dashboard/e-learning')}
                      className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Browse Courses
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Learning Stats */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Learning Activity</h2>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Weekly Progress</h3>
                  <div className="flex items-center gap-1 h-20">
                    {/* Simple bar chart representation */}
                    {[40, 25, 60, 35, 80, 55, 30].map((height, index) => (
                      <div key={index} className="flex-1 flex items-end h-full">
                        <div 
                          className="w-full bg-purple-600 rounded-t-sm" 
                          style={{ height: `${height}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Mon</span>
                    <span>Wed</span>
                    <span>Fri</span>
                    <span>Sun</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="rounded-full p-2 bg-purple-100 mr-3">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">0 hrs</div>
                      <div className="text-xs text-gray-500">This week</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="rounded-full p-2 bg-green-100 mr-3">
                      <BarChart className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">+0% growth</div>
                      <div className="text-xs text-gray-500">vs last week</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="rounded-full p-2 bg-amber-100 mr-3">
                      <Award className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">0 certificates</div>
                      <div className="text-xs text-gray-500">Earned this month</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events and Jobs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Upcoming Events</h2>
                <button 
                  onClick={() => navigate('/dashboard/events')}
                  className="text-purple-600 hover:text-purple-800 text-sm flex items-center"
                >
                  View all
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="p-4">
                {events.length > 0 ? (
                  <div className="space-y-4">
                    {events.filter(event => isUpcoming(event.date)).slice(0, 3).map(event => (
                      <div key={event._id} className="flex items-start p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="bg-purple-50 p-3 rounded-lg text-center mr-4 w-16">
                          <div className="text-lg font-bold text-purple-600">
                            {new Date(event.date).getDate()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(event.date).toLocaleString('default', { month: 'short' })}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{event.title}</h3>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {event.time}
                          </div>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <MapPin className="w-3 h-3 mr-1" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No upcoming events</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Jobs */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Recent Job Postings</h2>
                <button 
                  onClick={() => navigate('/dashboard/jobs')}
                  className="text-purple-600 hover:text-purple-800 text-sm flex items-center"
                >
                  View all jobs
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="p-4">
                {jobs.length > 0 ? (
                  <div className="space-y-3">
                    {jobs.slice(0, 5).map(job => (
                      <div key={job.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                        <div className="w-12 h-12 flex-shrink-0 mr-4">
                          <div className="bg-gray-50 p-2 rounded-lg flex items-center justify-center h-full">
                            <img src={job.logo} alt={job.company} className="w-full h-full object-contain" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{job.title}</h3>
                          <div className="flex flex-wrap gap-y-1 gap-x-3 mt-1">
                            <div className="flex items-center text-sm text-gray-500">
                              <Building className="w-3 h-3 mr-1" />
                              {job.company}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="w-3 h-3 mr-1" />
                              {job.location}
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex items-center">
                          <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">{job.type}</span>
                          <span className="text-xs text-gray-500 ml-3">{job.posted}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No job postings available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recommended Mentors and Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mentors */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Recommended Mentors</h2>
                <button 
                  onClick={() => navigate('/dashboard/mentorship')}
                  className="text-purple-600 hover:text-purple-800 text-sm flex items-center"
                >
                  View all mentors
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="p-4">
                {mentors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mentors.slice(0, 3).map(mentor => (
                      <div key={mentor._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative">
                          <img
                            src={`http://localhost:5000/${mentor.image}`}
                            alt={mentor.name}
                            className="w-full h-32 object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold">{mentor.name}</h3>
                          <p className="text-sm text-gray-600">{mentor.role} at {mentor.company}</p>
                          <div className="flex items-center mt-2 text-sm">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span>{mentor.rating}</span>
                            <span className="mx-2">•</span>
                            <span>{mentor.sessions} sessions</span>
                          </div>
                          <div className="mt-3">
                            <button className="w-full bg-purple-600 text-white text-sm px-3 py-1.5 rounded-md hover:bg-purple-700 transition-colors">
                              Connect
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No mentors available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Notifications</h2>
              </div>
              <div className="p-4">
                {notifications.length > 0 ? (
                  <div className="space-y-4">
                    {/* Sample notifications - in a real app, use actual notification data */}
                    <div className="flex items-start p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <Bell className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm">Your course <span className="font-medium">React Fundamentals</span> is 70% complete</p>
                        <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="bg-purple-100 p-2 rounded-full mr-3">
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm">Reminder: <span className="font-medium">AI Workshop</span> starting in 3 hours</p>
                        <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm">Mentor <span className="font-medium">Sarah Johnson</span> accepted your request</p>
                        <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No notifications</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Floating Dashboard & Chatbot Icons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4">
        {/* Dashboard Icon */}
        <button 
          onClick={() => navigate('/dashboard/ai-assistant')} 
          className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors"
          title="Dashboard"
        >
          <LayoutDashboard className="w-6 h-6" />
        </button>
        
        {/* Chatbot Icon */}
        <button 
          onClick={toggleChatbot} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-colors"
          title="Chat with Assistant"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      </div>

      {/* Chatbot Dialog */}
      {chatbotOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          <div className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center">
            <h3 className="font-medium">Learning Assistant</h3>
            <button onClick={toggleChatbot} className="text-white hover:text-gray-200">
              ✕
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {/* Chat messages would go here */}
            <div className="bg-indigo-100 rounded-lg p-3 mb-3 max-w-[80%]">
              <p className="text-sm">Hi there! How can I help with your learning journey today?</p>
            </div>
          </div>
          <div className="border-t border-gray-200 p-3">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button className="bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;