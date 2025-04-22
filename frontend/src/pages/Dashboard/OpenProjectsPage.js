import React, { useState, useEffect } from 'react';
import { Search, GitBranch, Star, Clock, Tag } from 'lucide-react';
import axios from 'axios';
import Navbar from '../../components/shared/Navbar';

const OpenProjectsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Web Development', 'Mobile Apps', 'AI/ML', 'DevOps', 'Blockchain'];
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
  
        const params = {};
        if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
        if (searchTerm) params.search = searchTerm;
  
        const response = await axios.get('http://localhost:5000/api/projects', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params
        });
  
        setProjects(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setLoading(false);
      }
    };
  
    fetchProjects();
  }, [selectedCategory, searchTerm]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Fixed Sidebar Navigation */}
      <div className="flex-none">
        <Navbar type="student" />
      </div>

      {/* Main Content Area - Shifted right to accommodate sidebar */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-2">Open Source Projects</h1>
            <p className="text-purple-100">Contribute to exciting projects and build your portfolio</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Projects List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
            </div>
          ) : (
            <div className="space-y-4">
              {projects.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-500 text-lg">No projects found matching your criteria.</p>
                  <button 
                    onClick={() => {
                      setSelectedCategory('All');
                      setSearchTerm('');
                    }}
                    className="mt-4 text-purple-600 hover:text-purple-700"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                projects.map(project => (
                  <div key={project._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold">{project.title}</h3>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center text-gray-600">
                              <Star className="w-4 h-4 mr-1" />
                              <span>{project.stars || 0}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <GitBranch className="w-4 h-4 mr-1" />
                              <span>{project.contributors || 0}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4">{project.description}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tech?.map((tech, index) => (
                            <span key={index} className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
                              {tech}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Tag className="w-4 h-4 mr-1" />
                              {project.difficulty || 'Unknown'}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              Last active {project.lastActive || 'Recently'}
                            </div>
                          </div>

                          {project.maintainer && (
                            <div className="flex items-center gap-2">
                              <img
                                src={project.maintainer.avatar || '/api/placeholder/24/24'}
                                alt={project.maintainer.name}
                                className="w-6 h-6 rounded-full"
                              />
                              <span className="text-sm text-gray-600">
                                Maintained by {project.maintainer.name}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex gap-2">
                          <button className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                            View Project
                          </button>
                          <button className="border border-purple-600 text-purple-600 py-2 px-4 rounded-lg hover:bg-purple-50 transition-colors">
                            Star Project
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpenProjectsPage;