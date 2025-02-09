import React, { useState } from 'react';
import { Play, Clock, Award } from 'lucide-react';

const ELearningPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Web Development', 'Data Science', 'Cloud Computing', 'Mobile Development', 'DevOps'];

  const courses = [
    {
      id: 1,
      title: 'Advanced React Development',
      category: 'Web Development',
      instructor: 'Dr. Sarah Chen',
      duration: '8 weeks',
      level: 'Advanced',
      enrolled: 1234,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      title: 'Machine Learning Fundamentals',
      category: 'Data Science',
      instructor: 'Prof. Michael Brown',
      duration: '10 weeks',
      level: 'Intermediate',
      enrolled: 856,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      title: 'AWS Cloud Architecture',
      category: 'Cloud Computing',
      instructor: 'Emma Watson',
      duration: '6 weeks',
      level: 'Intermediate',
      enrolled: 678,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const filteredCourses = selectedCategory === 'All' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">E-Learning Platform</h1>
        <p className="text-gray-600">Expand your knowledge with our curated courses</p>
      </div>

      {/* Categories */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
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

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-600">{course.category}</span>
                <span className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {course.duration}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-4">By {course.instructor}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">{course.enrolled.toLocaleString()} students</span>
                <div className="flex items-center">
                  <Award className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">{course.rating}</span>
                </div>
              </div>

              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                <Play className="w-4 h-4 mr-2" />
                Start Learning
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ELearningPage;