import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AlumniELearningPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    duration: '',
    level: 'Beginner',
    price: '',
    tags: '',
    isPublished: false,
    modules: []
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [message, setMessage] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(240);

  useEffect(() => {
    fetchCourses();
    
    // Check if mobile and listen for window resize
    const checkIfMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      // Default sidebar width is 240px when expanded, 72px when collapsed
      setSidebarWidth(isMobileView ? 0 : 240);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    // Listen for custom event that navbar might emit when toggled
    const handleSidebarToggle = (e) => {
      if (e.detail && typeof e.detail.width === 'number') {
        setSidebarWidth(e.detail.width);
      }
    };
    
    window.addEventListener('sidebarToggle', handleSidebarToggle);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
      window.removeEventListener('sidebarToggle', handleSidebarToggle);
    };
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load courses');
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      duration: '',
      level: 'Beginner',
      price: '',
      tags: '',
      isPublished: false,
      modules: []
    });
    setThumbnail(null);
    setThumbnailPreview('');
    setIsEditing(false);
    setCurrentCourseId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      // Append form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'modules') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Append thumbnail if exists
      if (thumbnail) {
        formDataToSend.append('thumbnail', thumbnail);
      }

      let response;
      if (isEditing && currentCourseId) {
        // Update existing course
        response = await axios.put(`http://localhost:5000/api/courses/${currentCourseId}`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setMessage('Course updated successfully!');
      } else {
        // Create new course
        response = await axios.post('http://localhost:5000/api/courses', formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setMessage('Course created successfully!');
      }

      // Refresh course list
      fetchCourses();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (course) => {
    setIsEditing(true);
    setCurrentCourseId(course._id);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category,
      duration: course.duration,
      level: course.level,
      price: course.price,
      tags: course.tags.join(','),
      isPublished: course.isPublished,
      modules: course.modules || []
    });
    
    if (course.thumbnail) {
      setThumbnailPreview(`/${course.thumbnail}`);
    }
  };

  const levelOptions = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const categoryOptions = ['Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'Other'];

  // Style for main content that adjusts based on sidebar width
  const mainContentStyle = {
    marginLeft: `${sidebarWidth}px`,
    width: `calc(100% - ${sidebarWidth}px)`,
    transition: 'margin-left 0.3s, width 0.3s'
  };

  return (
    <div className="min-h-screen bg-gray-50" style={mainContentStyle}>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800">E-Learning Course Management</h1>
        </div>
        
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
              <h2 className="text-xl font-bold mb-4 text-blue-800">{isEditing ? 'Edit Course' : 'Create New Course'}</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Course Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    >
                      <option value="">Select Category</option>
                      {categoryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows="4"
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Duration (hours)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Level
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      {levelOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="e.g. javascript, react, web development"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Course Thumbnail
                  </label>
                  <div className="flex items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Select Image
                    </label>
                    <span className="ml-3 text-gray-600 text-sm">
                      {thumbnail ? thumbnail.name : 'No file selected'}
                    </span>
                  </div>
                  {thumbnailPreview && (
                    <div className="mt-4">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-gray-700 text-sm font-bold">
                      Publish Course
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : isEditing ? 'Update Course' : 'Create Course'}
                  </button>
                  
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
          
          <div>
            <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
              <h2 className="text-xl font-bold mb-4 text-blue-800">Your Courses</h2>
              
              {isLoading && <p>Loading courses...</p>}
              
              {!isLoading && courses.length === 0 && (
                <p className="text-gray-600">You haven't created any courses yet.</p>
              )}
              
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row">
                      {course.thumbnail && (
                        <div className="w-full md:w-1/4 mb-4 md:mb-0">
                          <img
                           src={`http://localhost:5000/${course.thumbnail}`}
                            alt={course.title}
                            className="w-full h-24 object-cover rounded-md"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/150";
                            }}
                          />
                        </div>
                      )}
                      <div className={course.thumbnail ? "w-full md:w-3/4 md:pl-4" : "w-full"}>
                        <h3 className="font-bold">{course.title}</h3>
                        <p className="text-sm text-gray-600">{course.category}</p>
                        <div className="flex justify-between mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${course.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {course.isPublished ? 'Published' : 'Draft'}
                          </span>
                          <button
                            onClick={() => handleEdit(course)}
                            className="text-blue-600 text-sm hover:text-blue-800"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniELearningPage;