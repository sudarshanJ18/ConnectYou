import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Users, Star, Calendar, MessageSquare } from "lucide-react";
import Navbar from '../../components/shared/Navbar';

// 🛠 MentorCard Component - Kept unchanged
const MentorCard = ({ mentor, onRequestSession }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
  >
    <div className="relative">
      <img
        src={`http://localhost:5000/${mentor.image}`}  // prepend the server URL to the image path
        alt={mentor.name}
        className="w-full h-48 object-cover rounded-t-lg transition-transform duration-300 hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-semibold">{mentor.name}</h3>
      <p className="text-gray-600">{mentor.role} at {mentor.company}</p>
      <div className="flex items-center mt-2 text-gray-700">
        <Star className="w-4 h-4 text-yellow-400 mr-1" />
        <span>{mentor.rating}</span>
        <span className="mx-2">•</span>
        <Users className="w-4 h-4 text-gray-500 mr-1" />
        <span>{mentor.sessions} sessions</span>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onRequestSession(mentor)}
          className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:bg-purple-700"
        >
          <Calendar className="w-4 h-4 mr-2 inline-block" />
          Book Session
        </button>
        <button className="flex-1 border border-purple-600 text-purple-600 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-purple-50">
          <MessageSquare className="w-4 h-4 mr-2 inline-block" />
          Message
        </button>
      </div>
    </div>
    <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-indigo-50">
      <div className="text-sm text-purple-600">
        <i className="fas fa-magic mr-2"></i>
        AI Match Score: <span className="font-bold">98%</span>
      </div>
    </div>
  </motion.div>
);

// 🏠 Enhanced Mentor Page
const MentorPage = () => {
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading state
    setIsLoading(true);
    
    // Fetch mentors data
    axios.get("http://localhost:5000/api/mentor/")
      .then(res => {
        setMentors(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("❌ Error fetching mentors:", err);
        setIsLoading(false);
      });
  }, []);

  const handleRequestSession = (mentor) => {
    alert(`Session requested with ${mentor.name}!`);
  };

  // Filter mentors based on search term
  const filteredMentors = mentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (mentor.expertise && mentor.expertise.some(skill => 
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  return (
    <div className="flex min-h-screen">
      <div className="flex-none">
        <Navbar type="student" />
      </div>
      <div className="flex-1 ml-64">
        <div className="w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
          <div className="container mx-auto px-4 py-6">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 mb-4 text-center"
            >
              AI-Powered Mentor Matching
            </motion.h1>
            <p className="text-lg text-gray-600 mb-6 text-center">
              Connect with alumni mentors based on your career goals and interests
            </p>

            {/* 🔍 Search Input */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <input
                type="text"
                placeholder="Search by name, expertise, or industry..."
                className="w-full px-6 py-4 text-lg rounded-full border-2 border-purple-200 focus:border-purple-500 focus:outline-none shadow-lg transition-all duration-300 hover:shadow-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search absolute right-6 top-1/2 transform -translate-y-1/2 text-purple-400 text-xl"></i>
            </div>

            {/* 🎯 AI Matching Preferences */}
            <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-lg mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-indigo-800">
                AI Matching Preferences
              </h2>
              <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="text-gray-600 mb-2">Career Interests</label>
                  <select className="p-3 border rounded-lg focus:border-purple-500 focus:outline-none">
                    <option>Software Development</option>
                    <option>Data Science</option>
                    <option>Product Management</option>
                    <option>UX Design</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-600 mb-2">Experience Level</label>
                  <select className="p-3 border rounded-lg focus:border-purple-500 focus:outline-none">
                    <option>Entry Level</option>
                    <option>Mid Level</option>
                    <option>Senior Level</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-600 mb-2">Mentorship Goals</label>
                  <select className="p-3 border rounded-lg focus:border-purple-500 focus:outline-none">
                    <option>Career Guidance</option>
                    <option>Skill Development</option>
                    <option>Industry Insights</option>
                  </select>
                </div>
              </form>
            </div>

            {/* 🧑‍🏫 Mentor List */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } }
              }}
            >
              {isLoading ? (
                // Loading state
                <div className="col-span-3 flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                </div>
              ) : filteredMentors.length > 0 ? (
                // Display mentors when available
                filteredMentors.map(mentor => (
                  <MentorCard 
                    key={mentor._id} 
                    mentor={mentor} 
                    onRequestSession={handleRequestSession} 
                  />
                ))
              ) : (
                // No mentors found state
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {mentors.length === 0 
                      ? "No mentors available at the moment." 
                      : "No mentors match your search criteria."}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorPage;