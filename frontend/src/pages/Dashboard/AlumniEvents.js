import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import Navbar from '../../components/shared/Navbar';
import { Calendar, MapPin, Clock, Plus, Users, Calendar as CalendarIcon, X, Edit, Trash2, ExternalLink } from 'lucide-react';
import axios from 'axios';

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const AlumniEvents = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  // Form data now includes meetingLink
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    meetingLink: ''
  });

  // Stats derived from events
  const [stats, setStats] = useState({
    upcoming: 0,
    past: 0,
    total: 0
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/events');
      setEvents(response.data);
      
      // Calculate stats
      const now = new Date();
      const upcoming = response.data.filter(event => new Date(event.date) >= now).length;
      const past = response.data.length - upcoming;
      
      setStats({
        upcoming,
        past,
        total: response.data.length
      });
    } catch (err) {
      setError('Failed to fetch events. Please try again later.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/events/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/events', formData);
      }
      
      // Reset form and state
      setFormData({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        meetingLink: ''
      });
      setShowForm(false);
      setIsEditing(false);
      setEditingId(null);
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event');
      console.error('Error submitting form:', err);
    }
  };

  const handleEditClick = (event) => {
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      meetingLink: event.meetingLink || ''
    });
    setEditingId(event._id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteClick = async (id) => {
    if (deleteConfirm === id) {
      try {
        await axios.delete(`http://localhost:5000/api/events/${id}`);
        setDeleteConfirm(null);
        fetchEvents();
      } catch (err) {
        setError('Failed to delete event');
        console.error('Error deleting event:', err);
      }
    } else {
      setDeleteConfirm(id);
      // Auto reset after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  // Format date to be human-readable
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Navbar type="alumni" />

      <div className="w-full md:ml-64 p-4 md:p-8">
        <motion.div 
          initial={fadeIn.hidden}
          animate={fadeIn.visible}
          className="max-w-7xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-0"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Alumni Events
              </span>
            </motion.h1>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-md"
              onClick={() => {
                setIsEditing(false);
                setEditingId(null);
                setFormData({
                  title: '',
                  date: '',
                  time: '',
                  location: '',
                  description: '',
                  meetingLink: ''
                });
                setShowForm(!showForm);
              }}
            >
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? "Cancel" : "Add Event"}
            </motion.button>
          </div>

          {/* Display error message if any */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700 rounded"
            >
              <p>{error}</p>
            </motion.div>
          )}

          {/* Event Stats */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div variants={cardVariants} className="bg-white p-6 rounded-xl shadow-sm flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{stats.upcoming}</p>
                <p className="text-sm text-gray-600">Upcoming Events</p>
              </div>
            </motion.div>
            
            <motion.div variants={cardVariants} className="bg-white p-6 rounded-xl shadow-sm flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <CalendarIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{stats.past}</p>
                <p className="text-sm text-gray-600">Past Events</p>
              </div>
            </motion.div>
            
            <motion.div variants={cardVariants} className="bg-white p-6 rounded-xl shadow-sm flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Events</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Event Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-6 rounded-xl shadow-md mb-8"
            >
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                {isEditing ? "Edit Event" : "Create New Event"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter event title"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Event location"
                      required
                    />
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your event"
                    required
                  ></textarea>
                </div>

                {/* New meetingLink field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meeting Link (Optional)
                  </label>
                  <input
                    type="url"
                    name="meetingLink"
                    value={formData.meetingLink}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://meet.google.com/... or other meeting URL"
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setIsEditing(false);
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {isEditing ? "Update Event" : "Create Event"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Events List */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">{stats.upcoming > 0 ? 'Upcoming Events' : 'All Events'}</h2>
            </div>
            
            {/* Loading state */}
            {loading && (
              <div className="flex justify-center items-center h-60">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* No events state */}
            {!loading && events.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl p-8 text-center"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">No events found</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first event!</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Create Event
                </button>
              </motion.div>
            )}
            
            {/* Events grid */}
            {!loading && events.length > 0 && (
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              >
                {events.map((event) => {
                  const isConfirmingDelete = deleteConfirm === event._id;
                  const eventDate = new Date(event.date);
                  const isPast = eventDate < new Date();
                  
                  return (
                    <motion.div
                      key={event._id}
                      variants={cardVariants}
                      className={`bg-white rounded-xl shadow-sm overflow-hidden border-l-4 ${
                        isPast ? 'border-gray-400' : 'border-blue-500'
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold text-gray-800 mb-3">{event.title}</h3>
                          {isPast && (
                            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                              Past
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                        
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">{formatDate(event.date)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">{event.time}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-gray-600 col-span-2">
                            <MapPin className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">{event.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <button 
                            onClick={() => handleEditClick(event)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition"
                          >
                            <Edit className="w-4 h-4" /> Edit
                          </button>
                          
                          <button 
                            onClick={() => handleDeleteClick(event._id)}
                            className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition ${
                              isConfirmingDelete 
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" /> 
                            {isConfirmingDelete ? 'Confirm' : 'Delete'}
                          </button>
                          
                          {/* Updated External Link Button */}
                          <button 
                            onClick={() => event.meetingLink ? window.open(event.meetingLink, '_blank') : null}
                            className={`px-3 py-2 rounded-lg transition flex items-center justify-center ${
                              event.meetingLink 
                                ? 'bg-blue-100 hover:bg-blue-200 text-blue-800' 
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                            disabled={!event.meetingLink}
                            title={event.meetingLink ? "Open meeting link" : "No meeting link available"}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AlumniEvents;