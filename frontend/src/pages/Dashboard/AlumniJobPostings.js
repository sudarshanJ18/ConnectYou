import React from 'react';
import { motion } from "framer-motion";
import AlumniNavbar from "./AlumniNavbar";
import { Briefcase, Building2, MapPin, Clock } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const AlumniJobPostings = () => {
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
          💼 Job Postings
        </motion.h1>

        {/* Post New Job Button */}
        <motion.div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Job Listings</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Post New Job
          </motion.button>
        </motion.div>

        {/* Job Listings Section */}
        <motion.div className="grid grid-cols-1 gap-6" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.2 } } }}>
          {/* Active Job Postings */}
          <motion.div variants={cardVariants} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Your Active Postings</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((job) => (
                <motion.div key={job} whileHover={{ scale: 1.02 }} className="border rounded-lg p-4 hover:border-blue-200 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Software Engineer</h3>
                      <div className="flex items-center gap-2 text-gray-600 mt-2">
                        <Building2 className="w-4 h-4" />
                        <span>Tech Corp</span>
                        <MapPin className="w-4 h-4 ml-2" />
                        <span>San Francisco, CA</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button whileHover={{ scale: 1.1 }} className="text-blue-600 hover:text-blue-700">Edit</motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} className="text-red-600 hover:text-red-700">Delete</motion.button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-600">Full-time • Remote • 5+ years experience</p>
                    <div className="flex items-center gap-2 mt-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>Posted 2 days ago</span>
                      <span className="mx-2">•</span>
                      <span>15 applications</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Applications Overview */}
          <motion.div variants={cardVariants} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Applications Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div whileHover={{ scale: 1.05 }} className="p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">45</p>
                <p className="text-gray-600">Total Applications</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">12</p>
                <p className="text-gray-600">Shortlisted</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="p-4 bg-purple-50 rounded-lg">
                <p className="text-3xl font-bold text-purple-600">5</p>
                <p className="text-gray-600">Interviews Scheduled</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AlumniJobPostings;
