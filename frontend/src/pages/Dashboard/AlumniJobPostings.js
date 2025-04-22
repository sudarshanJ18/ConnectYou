import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import Navbar from '../../components/shared/Navbar';
import { Briefcase, Building2, MapPin, Clock } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const AlumniJobPostings = () => {
  const [showForm, setShowForm] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    posted: '1 day ago',
    logo: ''
  });

  useEffect(() => {
    // Fetch jobs from API
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/jobs/');
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  const [editMode, setEditMode] = useState(false);
  const [editJobId, setEditJobId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const jobData = {
      ...formData,
      posted: '1 day ago'
    };
  
    try {
      const url = editMode
        ? `http://localhost:5000/api/jobs/${editJobId}`
        : 'http://localhost:5000/api/jobs/';
  
      const method = editMode ? 'PUT' : 'POST';
  
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
  
      if (response.ok) {
        const updatedJob = await response.json();
  
        if (editMode) {
          // Replace the job in the list
          setJobs(jobs.map((job) => (job._id === editJobId ? updatedJob : job)));
        } else {
          setJobs([...jobs, updatedJob]);
        }
  
        // Reset form
        setFormData({
          title: '',
          company: '',
          location: '',
          type: 'Full-time',
          salary: '',
          posted: '1 day ago',
          logo: ''
        });
        setEditMode(false);
        setEditJobId(null);
        setShowForm(false);
      } else {
        console.error('Failed to save job');
      }
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };
  
  const handleDelete = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setJobs(jobs.filter(job => job._id !== jobId));
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const calculateApplicationStats = () => {
    // Simple mock statistics based on number of jobs
    return {
      total: jobs.length * 5, // Mock: average 5 applications per job
      shortlisted: Math.floor(jobs.length * 2), // Mock: average 2 shortlisted per job
      interviews: Math.floor(jobs.length * 1) // Mock: average 1 interview per job
    };
  };

  const applications = calculateApplicationStats();

  return (
    <div className="flex min-h-screen">
      <div className="flex-none">
        <Navbar type="alumni" />
      </div>
      <main className="flex-1 p-6 bg-gray-100 ml-64">
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
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Post New Job"}
          </motion.button>
        </motion.div>

        {/* Job Posting Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-6 rounded-lg shadow-md mb-6"
          >
            <h2 className="text-xl font-semibold mb-4">Post a New Job</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
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
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
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
                    Job Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="e.g. $80k - $120k"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Logo URL
                  </label>
                  <input
                    type="text"
                    name="logo"
                    value={formData.logo}
                    onChange={handleInputChange}
                    placeholder="https://example.com/logo.png"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Submit Job Posting
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Job Listings Section */}
        <motion.div className="grid grid-cols-1 gap-6" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.2 } } }}>
          {/* Active Job Postings */}
          <motion.div variants={cardVariants} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Your Active Postings</h2>
            
            {jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <motion.div key={job._id} whileHover={{ scale: 1.02 }} className="border rounded-lg p-4 hover:border-blue-200 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        {job.logo && (
                          <img 
                            src={job.logo} 
                            alt={`${job.company} logo`} 
                            className="w-12 h-12 rounded-full mr-4 object-cover"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <div className="flex items-center gap-2 text-gray-600 mt-2">
                            <Building2 className="w-4 h-4" />
                            <span>{job.company}</span>
                            <MapPin className="w-4 h-4 ml-2" />
                            <span>{job.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.1 }} 
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => {
                            setFormData(job);
                            setEditMode(true);
                            setEditJobId(job._id);
                            setShowForm(true);
                          }}
                        >
                          Edit
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1 }} 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(job._id)}
                        >
                          Delete
                        </motion.button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <p className="text-gray-600">
                          {job.type} • {job.salary}
                        </p>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>Posted {job.posted}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">You haven't posted any jobs yet.</p>
            )}
          </motion.div>

          {/* Applications Overview */}
          <motion.div variants={cardVariants} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Applications Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div whileHover={{ scale: 1.05 }} className="p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">{applications.total}</p>
                <p className="text-gray-600">Total Applications</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">{applications.shortlisted}</p>
                <p className="text-gray-600">Shortlisted</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="p-4 bg-purple-50 rounded-lg">
                <p className="text-3xl font-bold text-purple-600">{applications.interviews}</p>
                <p className="text-gray-600">Interviews Scheduled</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default AlumniJobPostings;