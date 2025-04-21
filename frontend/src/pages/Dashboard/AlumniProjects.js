import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import AlumniNavbar from "./AlumniNavbar";
import axios from 'axios';
import { FolderOpen, Plus, Clock, X } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const AlumniProjects = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  // Form modal states
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tech: '',
    difficulty: '',
    contributors: '',
    stars: '',
    lastActive: '',
  });

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/projects', {
        headers: { Authorization: `Bearer ${token}` },
        params: { category, search }
      });
      setProjects(response.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:5000/api/projects',
        {
          ...formData,
          tech: formData.tech.split(',').map(t => t.trim()), // Convert tech to array
          contributors: Number(formData.contributors),
          stars: Number(formData.stars),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        category: '',
        tech: '',
        difficulty: '',
        contributors: '',
        stars: '',
        lastActive: '',
      });
      fetchProjects();
    } catch (err) {
      console.error('Error adding project:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [search, category]);

  return (
    <div className="flex">
      <AlumniNavbar />

      <div className="ml-64 p-6 bg-gray-100 min-h-screen w-full">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-6"
        >
          🛠️ Alumni Projects
        </motion.h1>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <select
            className="border rounded-lg px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Web Development">Web Development</option>
            <option value="AI/ML">AI/ML</option>
            <option value="Data Science">Data Science</option>
          </select>

          <input
            type="text"
            placeholder="Search projects..."
            className="border rounded-lg px-4 py-2 w-full md:w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            onClick={() => setShowForm(true)}
          >
            <Plus className="w-4 h-4" /> Add Project
          </motion.button>
        </div>

        {/* Project Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg relative shadow-xl">
              <button onClick={() => setShowForm(false)} className="absolute top-3 right-3 text-gray-500 hover:text-black">
                <X />
              </button>
              <h2 className="text-2xl font-semibold mb-4">Add New Project</h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <input name="title" placeholder="Title" value={formData.title} onChange={handleFormChange} className="w-full border p-2 rounded" required />
                <input name="description" placeholder="Description" value={formData.description} onChange={handleFormChange} className="w-full border p-2 rounded" required />
                <input name="category" placeholder="Category" value={formData.category} onChange={handleFormChange} className="w-full border p-2 rounded" required />
                <input name="tech" placeholder="Tech (comma separated)" value={formData.tech} onChange={handleFormChange} className="w-full border p-2 rounded" />
                <input name="difficulty" placeholder="Difficulty" value={formData.difficulty} onChange={handleFormChange} className="w-full border p-2 rounded" />
                <input type="number" name="contributors" placeholder="Contributors" value={formData.contributors} onChange={handleFormChange} className="w-full border p-2 rounded" />
                <input type="number" name="stars" placeholder="Stars" value={formData.stars} onChange={handleFormChange} className="w-full border p-2 rounded" />
                <input name="lastActive" placeholder="Last Active (e.g., 2024-09-01)" value={formData.lastActive} onChange={handleFormChange} className="w-full border p-2 rounded" />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">Submit</button>
              </form>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
          {projects.map((project) => (
            <motion.div
              key={project._id}
              variants={cardVariants}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FolderOpen className="w-4 h-4" /> {project.category || 'General'}
                <Clock className="w-4 h-4 ml-4" /> {new Date(project.createdAt).toLocaleDateString()}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {projects.length === 0 && (
          <div className="text-center text-gray-500 mt-10">No projects found.</div>
        )}
      </div>
    </div>
  );
};

export default AlumniProjects;
