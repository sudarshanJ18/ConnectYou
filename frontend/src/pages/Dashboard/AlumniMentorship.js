import React from 'react';
import { motion } from "framer-motion";
import Navbar from '../../components/shared/Navbar';
import { Users, MessageSquare, Calendar } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const AlumniMentorship = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Navbar type="alumni" />

      {/* Main Content */}
      <div className="ml-64 p-6 bg-gray-100 min-h-screen w-full">
        {/* Animated Heading */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-6"
        >
          🎓 Mentorship Program
        </motion.h1>

        {/* Mentorship Dashboard */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
          {/* Active Mentees */}
          <motion.div variants={cardVariants} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Active Mentees</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((mentee) => (
                <motion.div key={mentee} whileHover={{ scale: 1.02 }} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">Student {mentee}</p>
                    <p className="text-sm text-gray-600">Computer Science</p>
                  </div>
                  <button className="ml-auto text-blue-600 hover:text-blue-700">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Sessions */}
          <motion.div variants={cardVariants} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Upcoming Sessions</h2>
            <div className="space-y-4">
              {[1, 2].map((session) => (
                <motion.div key={session} whileHover={{ scale: 1.02 }} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Career Guidance Session</p>
                    <p className="text-sm text-gray-600">Tomorrow at 3:00 PM</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Mentorship Stats */}
          <motion.div variants={cardVariants} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Your Impact</h2>
            <div className="space-y-6">
              <motion.div whileHover={{ scale: 1.02 }}>
                <p className="text-3xl font-bold text-blue-600">24</p>
                <p className="text-gray-600">Total Sessions Conducted</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }}>
                <p className="text-3xl font-bold text-green-600">15</p>
                <p className="text-gray-600">Students Mentored</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }}>
                <p className="text-3xl font-bold text-purple-600">4.8/5</p>
                <p className="text-gray-600">Average Rating</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AlumniMentorship;
