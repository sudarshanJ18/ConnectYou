import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import AlumniNavbar from "./AlumniNavbar";
import { Calendar, Users, MapPin, Clock, Plus } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const AlumniEvents = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [quickEvent, setQuickEvent] = useState({
    title: '',
    date: '',
  });
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    attendees: 0,
    type: 'Networking'
  });
  const [stats, setStats] = useState({
    upcoming: 0,
    attendees: 0,
    hosted: 0
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // You mentioned using /api/projects/ but your backend code shows /api/jobs/
      // Using the jobs endpoint since that's what you shared in your backend code
      const response = await fetch('http://localhost:5000/api/jobs/');
      
      if (response.status === 401) {
        setError('Authentication required. Please log in.');
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        
        // Transform job data to match event format
        const transformedData = data.map(job => ({
          _id: job._id,
          title: job.title,
          date: job.posted || new Date().toLocaleDateString(),
          time: "TBD",
          location: job.location,
          attendees: Math.floor(Math.random() * 50), // Mock data
          type: job.type
        }));
        
        setEvents(transformedData);
        
        // Calculate stats
        setStats({
          upcoming: transformedData.length,
          attendees: transformedData.reduce((sum, event) => sum + (event.attendees || 0), 0),
          hosted: Math.floor(transformedData.length * 1.5) // Mock data for past events
        });
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch events. Please try again later.');
    }
  };
  const [isEditing, setIsEditing] = useState(false);
const [editingId, setEditingId] = useState(null);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleQuickEventChange = (e) => {
    const { name, value } = e.target;
    setQuickEvent({
      ...quickEvent,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    const jobData = {
      title: formData.title,
      company: "Alumni Association",
      location: formData.location,
      type: formData.type,
      salary: "N/A",
      posted: formData.date,
      logo: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=80&h=80&q=80"
    };
  
    try {
      const url = isEditing
        ? `http://localhost:5000/api/jobs/${editingId}`
        : `http://localhost:5000/api/jobs/`;
  
      const method = isEditing ? 'PUT' : 'POST';
  
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
  
      if (response.status === 401) {
        setError('Authentication required. Please log in.');
        return;
      }
  
      if (response.ok) {
        fetchEvents();
        setShowForm(false);
        setIsEditing(false);
        setEditingId(null);
        setFormData({
          title: '',
          date: '',
          time: '',
          location: '',
          attendees: 0,
          type: 'Networking'
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to submit event');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Request failed. Please try again.');
    }
  };

  const handleEditClick = (event) => {
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time || '',
      location: event.location || '',
      attendees: event.attendees || 0,
      type: event.type || 'Networking'
    });
    setEditingId(event._id);
    setIsEditing(true);
    setShowForm(true);
  };
  

  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Create a job with minimal details
    const jobData = {
      title: quickEvent.title,
      company: "Alumni Association",
      location: "TBD",
      type: "Quick Event",
      salary: "N/A",
      posted: quickEvent.date || new Date().toLocaleDateString(),
      logo: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=80&h=80&q=80"
    };
    
    try {
      const response = await fetch('http://localhost:5000/api/jobs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add your authentication token if needed
          // 'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(jobData),
      });

      if (response.status === 401) {
        setError('Authentication required. Please log in to post events.');
        return;
      }

      if (response.ok) {
        fetchEvents();
        setQuickEvent({
          title: '',
          date: ''
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create quick event');
      }
    } catch (error) {
      console.error('Error creating quick event:', error);
      setError('Failed to create quick event. Please try again later.');
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <AlumniNavbar />

      {/* Main Content */}
      <div className="ml-64 p-6 bg-gray-100 min-h-screen w-full">
        {/* Animated Heading */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-6"
        >
          🎉 Events & Workshops
        </motion.h1>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

        <motion.div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Upcoming Alumni Events</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus className="w-4 h-4" />
            {showForm ? "Cancel" : "Create Event"}
          </motion.button>
        </motion.div>

        {/* Event Stats */}
        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.2 } } }}>
          <motion.div variants={cardVariants} className="bg-white p-6 rounded-lg shadow-md">
            <Calendar className="w-6 h-6 text-blue-500 mb-2" />
            <p className="text-3xl font-bold text-blue-600">{stats.upcoming}</p>
            <p className="text-gray-600">Upcoming Events</p>
          </motion.div>
          <motion.div variants={cardVariants} className="bg-white p-6 rounded-lg shadow-md">
            <Users className="w-6 h-6 text-green-500 mb-2" />
            <p className="text-3xl font-bold text-green-600">{stats.attendees}+</p>
            <p className="text-gray-600">Total Attendees</p>
          </motion.div>
          <motion.div variants={cardVariants} className="bg-white p-6 rounded-lg shadow-md">
            <Calendar className="w-6 h-6 text-purple-500 mb-2" />
            <p className="text-3xl font-bold text-purple-600">{stats.hosted}</p>
            <p className="text-gray-600">Events Hosted</p>
          </motion.div>
        </motion.div>

        {/* Event Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-6 rounded-lg shadow-md mt-6 mb-6"
          >
            <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Networking">Networking</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Career Fair">Career Fair</option>
                    <option value="Panel Discussion">Panel Discussion</option>
                    <option value="Social">Social</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Attendees
                  </label>
                  <input
                    type="number"
                    name="attendees"
                    value={formData.attendees}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Create Event
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Quick Event Creation */}
        <motion.div variants={cardVariants} className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-lg font-semibold mb-4">Quick Event</h2>
          <form onSubmit={handleQuickSubmit}>
            <input 
              type="text" 
              name="title"
              value={quickEvent.title}
              onChange={handleQuickEventChange}
              className="w-full p-3 border rounded-lg mb-4" 
              placeholder="Event Title"
              required
            />
            <input 
              type="date" 
              name="date"
              value={quickEvent.date}
              onChange={handleQuickEventChange}
              className="w-full p-3 border rounded-lg mb-4"
              required
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Schedule Event
            </motion.button>
          </form>
        </motion.div>

        {/* Event Listings */}
        <motion.div className="mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5 } }}>
          <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map(event => (
                <motion.div
                  key={event._id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-lg shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          {event.time || "TBD"}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="w-4 h-4" />
                          {event.attendees} Attendees
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {event.type}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                  <motion.button
                     whileHover={{ scale: 1.05 }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                   onClick={() => handleEditClick(event)}
                      >
                        Edit Event
                      </motion.button>


                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="flex-1 border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
                    >
                      View Details
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-6">No events found. Create your first event!</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AlumniEvents;