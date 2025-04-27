import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  Search,
  Calendar,
  Bookmark
} from 'lucide-react';
import Navbar from '../../components/shared/Navbar';

// Native Button Component
const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick, 
  size = 'default',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700',
    secondary: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-100',
    ghost: 'hover:bg-gray-100 text-gray-600',
    outline: 'border border-gray-200 hover:bg-gray-100'
  };

  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3',
    lg: 'h-11 px-8',
    icon: 'h-10 w-10'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Native Input Component
const Input = ({ className = '', ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

// Native Select Component
const Select = ({ children, value, onChange, className = '' }) => (
  <select
    value={value}
    onChange={onChange}
    className={`flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  >
    {children}
  </select>
);

// Native Badge Component
const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-purple-100 text-purple-800',
    outline: 'border border-gray-200 text-gray-800',
    secondary: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Course Card Component
const CourseCard = ({ course, onEnroll, recommended = false }) => {
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);

  const handleEnrollClick = (e) => {
    e.stopPropagation();
    setShowEnrollDialog(true);
  };

  const handleConfirmEnroll = async () => {
    await onEnroll(course.id);
    setShowEnrollDialog(false);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={`http://localhost:5000/${course.thumbnail}`}
          alt={course.title} 
          className="w-full h-48 object-cover" 
        />
        {recommended && (
          <Badge className="absolute top-4 left-4 bg-purple-600 text-white">
            Recommended
          </Badge>
        )}
        <Badge className="absolute top-4 right-4 bg-white text-purple-600">
          {course.level}
        </Badge>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline">{course.category}</Badge>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            {course.duration}
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img
              src={course.instructor.avatar}
              alt={course.instructor.name}
              className="w-6 h-6 rounded-full mr-2"
            />
            <span className="text-sm text-gray-700">
              {course.instructor.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Users className="w-4 h-4 text-gray-400 mr-1" />
              <span className="text-sm text-gray-500">
                {course.enrolledCount}
              </span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-sm font-medium">
                {course.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            className="flex-1"
            onClick={handleEnrollClick}
          >
            <Play className="w-4 h-4 mr-2" />
            {course.isEnrolled ? 'Continue' : 'Enroll Now'}
          </Button>
          <Button variant="outline" size="icon">
            <Bookmark className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showEnrollDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Enroll in {course.title}</h2>
            <p className="text-gray-600 mb-6">
              This course will take approximately {course.duration} to complete. 
              You'll have lifetime access to the course content.
            </p>
            <div className="flex justify-end gap-2">
              <Button 
                variant="ghost" 
                onClick={() => setShowEnrollDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmEnroll}>
                Enroll Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ELearningPage = () => {
  const [courses, setCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', label: 'All Courses' },
    { id: 'development', label: 'Development' },
    { id: 'design', label: 'Design' },
    { id: 'business', label: 'Business' }
  ];

  const levels = [
    { id: 'all', label: 'All Levels' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' }
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
  
        // Fetching courses
        const coursesResponse = await fetch('http://localhost:5000/api/courses');
        if (!coursesResponse.ok) {
          throw new Error('Failed to fetch courses');
        }
        const coursesData = await coursesResponse.json();
        console.log("Fetched courses data:", coursesData);
        setCourses(coursesData); // assuming API returns array directly
  
        // Fetching course recommendations
        const recommendationsResponse = await fetch('http://localhost:5000/api/courses');
        if (!recommendationsResponse.ok) {
          throw new Error('Failed to fetch recommendations');
        }
        const recommendationsData = await recommendationsResponse.json();
        console.log("Fetched recommendations:", recommendationsData);
        setRecommendedCourses(recommendationsData); // assuming API returns array directly
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [selectedCategory, selectedLevel, searchTerm]);
  
  const handleEnroll = async (courseId) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) throw new Error('Failed to enroll');
  
      const updatedCourse = await response.json();
      setSelectedCourse(updatedCourse);
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };
  
  return (
    <div className="flex min-h-screen">
      <div className="flex-none">
        <Navbar type="student" />
      </div>
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">Expand Your Knowledge</h1>
                <p className="text-purple-100 text-lg">
                  Learn from industry experts and advance your career
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="secondary">
                  <Calendar className="w-5 h-5 mr-2" />
                  Learning Plan
                </Button>
                <Button variant="secondary">
                  <Bookmark className="w-5 h-5 mr-2" />
                  Saved Courses
                </Button>
              </div>
            </div>
          </div>
        </div>
    
        {/* Filters */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-4">
                <Select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-[180px]"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </Select>
                
                <Select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-[180px]"
                >
                  {levels.map(level => (
                    <option key={level.id} value={level.id}>
                      {level.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </div>
    
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
            </div>
          ) : (
            <>
              {/* Recommended Courses */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Recommended for You</h2>
                  <Button variant="ghost" className="text-purple-600">
                    View All
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendedCourses.map(course => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onEnroll={handleEnroll}
                      recommended
                    />
                  ))}
                </div>
              </div>
    
              {/* All Courses */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">All Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map(course => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onEnroll={handleEnroll}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ELearningPage;
