import React from 'react';
import { motion } from "framer-motion";
import AlumniNavbar from "./AlumniNavbar";
import { Calendar, Users, MapPin, Clock, Plus } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const events = [
  {
    id: 1,
    title: "Tech Industry Networking Night",
    date: "March 15, 2024",
    time: "6:00 PM",
    location: "Tech Hub, Downtown",
    attendees: 45,
    type: "Networking"
  },
  {
    id: 2,
    title: "Alumni Career Fair",
    date: "March 20, 2024",
    time: "10:00 AM",
    location: "University Campus",
    attendees: 120,
    type: "Career Fair"
  }
];

const AlumniEvents = () => {
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

        <motion.div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Upcoming Alumni Events</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </motion.button>
        </motion.div>

        {/* Event Stats */}
        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.2 } } }}>
          <motion.div variants={cardVariants} className="bg-white p-6 rounded-lg shadow-md">
            <Calendar className="w-6 h-6 text-blue-500 mb-2" />
            <p className="text-3xl font-bold text-blue-600">8</p>
            <p className="text-gray-600">Upcoming Events</p>
          </motion.div>
          <motion.div variants={cardVariants} className="bg-white p-6 rounded-lg shadow-md">
            <Users className="w-6 h-6 text-green-500 mb-2" />
            <p className="text-3xl font-bold text-green-600">250+</p>
            <p className="text-gray-600">Total Attendees</p>
          </motion.div>
          <motion.div variants={cardVariants} className="bg-white p-6 rounded-lg shadow-md">
            <Calendar className="w-6 h-6 text-purple-500 mb-2" />
            <p className="text-3xl font-bold text-purple-600">12</p>
            <p className="text-gray-600">Events Hosted</p>
          </motion.div>
        </motion.div>

        {/* Quick Event Creation */}
        <motion.div variants={cardVariants} className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-lg font-semibold mb-4">Quick Event</h2>
          <input 
            type="text" 
            className="w-full p-3 border rounded-lg mb-4" 
            placeholder="Event Title"
          />
          <input 
            type="date" 
            className="w-full p-3 border rounded-lg mb-4"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Schedule Event
          </motion.button>
        </motion.div>

        {/* Event Listings */}
        <motion.div className="mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5 } }}>
          <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map(event => (
              <motion.div
                key={event.id}
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
                        {event.time}
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
        </motion.div>
      </div>
    </div>
  );
};

export default AlumniEvents;
