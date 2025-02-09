import React, { useState } from 'react';
import {  Search, GitBranch, Star, Clock, Tag } from 'lucide-react';

const OpenProjectsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Web Development', 'Mobile Apps', 'AI/ML', 'DevOps', 'Blockchain'];

  const projects = [
    {
      id: 1,
      title: 'Open Source Learning Platform',
      category: 'Web Development',
      description: 'Building a modern e-learning platform with React and Node.js',
      tech: ['React', 'Node.js', 'PostgreSQL'],
      difficulty: 'Intermediate',
      contributors: 12,
      stars: 156,
      lastActive: '2 days ago',
      maintainer: {
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80'
      }
    },
    {
      id: 2,
      title: 'AI-Powered Code Assistant',
      category: 'AI/ML',
      description: 'Developing an AI assistant for code review and suggestions',
      tech: ['Python', 'TensorFlow', 'FastAPI'],
      difficulty: 'Advanced',
      contributors: 8,
      stars: 234,
      lastActive: '1 day ago',
      maintainer: {
        name: 'Mark Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80'
      }
    },
    {
      id: 3,
      title: 'DevOps Automation Tools',
      category: 'DevOps',
      description: 'Collection of tools for automating deployment workflows',
      tech: ['Go', 'Docker', 'Kubernetes'],
      difficulty: 'Intermediate',
      contributors: 15,
      stars: 312,
      lastActive: '3 days ago',
      maintainer: {
        name: 'Emma Watson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80'
      }
    }
  ];

  const filteredProjects = projects.filter(project => 
    (selectedCategory === 'All' || project.category === selectedCategory) &&
    (project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Open Source Projects</h1>
        <p className="text-gray-600">Contribute to exciting projects and build your portfolio</p>
      </div>

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
      <div className="space-y-4">
        {filteredProjects.map(project => (
          <div key={project.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-gray-600">
                      <Star className="w-4 h-4 mr-1" />
                      <span>{project.stars}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <GitBranch className="w-4 h-4 mr-1" />
                      <span>{project.contributors}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map(tech => (
                    <span key={tech} className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 mr-1" />
                      {project.difficulty}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Last active {project.lastActive}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <img
                      src={project.maintainer.avatar}
                      alt={project.maintainer.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-gray-600">
                      Maintained by {project.maintainer.name}
                    </span>
                  </div>
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
        ))}
      </div>
    </div>
  );
};

export default OpenProjectsPage;