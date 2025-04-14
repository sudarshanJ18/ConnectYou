import React, { useState, useEffect } from 'react';
import { Play, Clock, Users, Star, Search, Calendar, Bookmark } from 'lucide-react';
import StudentNavbar from './StudentNavbar';

// Button Component
const Button = ({ children, variant = 'primary', className = '', onClick, size = 'default', ...props }) => {
  const baseStyles =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700',
    secondary: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-100',
    ghost: 'hover:bg-gray-100 text-gray-600',
    outline: 'border border-gray-200 hover:bg-gray-100',
  };

  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3',
    lg: 'h-11 px-8',
    icon: 'h-10 w-10',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

// Input Component
const Input = ({ className = '', ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${className}`}
    {...props}
  />
);

// Select Component
const Select = ({ children, value, onChange, className = '' }) => (
  <select
    value={value}
    onChange={onChange}
    className={`flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-purple-400 ${className}`}
  >
    {children}
  </select>
);

// Badge Component
const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-purple-100 text-purple-800',
    outline: 'border border-gray-200 text-gray-800',
    secondary: 'bg-gray-100 text-gray-800',
  };

  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}>{children}</span>;
};

// Course Card Component
const CourseCard = ({ course, onEnroll, recommended = false }) => {
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow">
      <div className="relative">
        <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
        {recommended && <Badge className="absolute top-4 left-4 bg-purple-600 text-white">Recommended</Badge>}
        <Badge className="absolute top-4 right-4 bg-white text-purple-600">{course.level}</Badge>
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
        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img src={course.instructor.avatar} alt={course.instructor.name} className="w-6 h-6 rounded-full mr-2" />
            <span className="text-sm text-gray-700">{course.instructor.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Users className="w-4 h-4 text-gray-400 mr-1" />
              <span className="text-sm text-gray-500">{course.enrolledCount}</span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-sm font-medium">{course.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button className="flex-1" onClick={() => setShowEnrollDialog(true)}>
            <Play className="w-4 h-4 mr-2" />
            {course.isEnrolled ? 'Continue' : 'Enroll Now'}
          </Button>
          <Button variant="outline" size="icon">
            <Bookmark className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// E-Learning Page
const ELearningPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://api.example.com/courses');
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentNavbar />
      <div className="flex-1 ml-64 p-6">
        <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-lg shadow">
          <h1 className="text-4xl font-bold">Expand Your Knowledge</h1>
          <p className="text-purple-100 text-lg">Learn from industry experts and advance your career</p>
        </header>

        <div className="mt-6 flex justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input type="text" placeholder="Search courses..." className="pl-10" />
          </div>
        </div>

        <main className="mt-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ELearningPage;