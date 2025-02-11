import React, { useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  Plus, 
  Filter, 
  Search 
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import CourseContent from '../../components/CourseContent';

// Internal UI Components
const Card = ({ children, className = '', ...props }) => (
  <div 
    className={`bg-white rounded-lg shadow ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
);

const Input = ({ className = '', ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Button = ({ 
  variant = 'default',
  size = 'default',
  className = '',
  children,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground'
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Select = ({ children, value, onValueChange }) => {
  const [open, setOpen] = useState(false);
  return React.Children.map(children, child =>
    React.cloneElement(child, { open, setOpen, value, onValueChange })
  );
};

const SelectTrigger = ({ children, className = '', open, setOpen, ...props }) => (
  <button
    className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    onClick={() => setOpen(!open)}
    {...props}
  >
    {children}
  </button>
);

const SelectContent = ({ children, open, value, onValueChange, className = '' }) => {
  if (!open) return null;
  return (
    <div className={`relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 ${className}`}>
      <div className="p-1">
        {React.Children.map(children, child =>
          React.cloneElement(child, { value, onValueChange })
        )}
      </div>
    </div>
  );
};

const SelectItem = ({ children, value: itemValue, onValueChange, className = '' }) => (
  <div
    className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`}
    onClick={() => onValueChange(itemValue)}
  >
    {children}
  </div>
);

const SelectValue = ({ placeholder, children }) => (
  <span>{children || placeholder}</span>
);

const ELearningPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [userRole] = useState('student');

  const categories = [
    'All',
    'Web Development',
    'Data Science',
    'Cloud Computing',
    'Mobile Development',
    'DevOps',
    'Career Skills',
    'Industry Insights',
    'Personal Development'
  ];

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedLevel !== 'All') params.append('level', selectedLevel);
      if (searchTerm) params.append('search', searchTerm);

      const response = await axios.get(`/api/courses?${params.toString()}`);
      setCourses(response.data);
    } catch (error) {
      toast.error('Failed to fetch courses. Please try again.');
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedLevel, searchTerm]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleEnroll = async (courseId, event) => {
    event.stopPropagation();
    try {
      await axios.post(`/api/courses/${courseId}/enroll`);
      const response = await axios.get(`/api/courses/${courseId}`);
      setSelectedCourse(response.data);
      toast.success('Successfully enrolled in the course!');
    } catch (error) {
      toast.error('Failed to enroll in the course. Please try again.');
      console.error('Error enrolling in course:', error);
    }
  };

  const handleContentComplete = async (contentId) => {
    if (!selectedCourse) return;
    
    try {
      await axios.put(`/api/courses/${selectedCourse._id}/progress`, {
        contentId,
        completed: true
      });
      
      const response = await axios.get(`/api/courses/${selectedCourse._id}`);
      setSelectedCourse(response.data);
      toast.success('Progress updated successfully!');
    } catch (error) {
      toast.error('Failed to update progress. Please try again.');
      console.error('Error updating progress:', error);
    }
  };

  const renderHeader = () => (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">E-Learning Platform</h1>
            <p className="mt-2 text-purple-100">Expand your knowledge with courses from industry experts</p>
          </div>
          {userRole === 'admin' && (
            <Button
              variant="secondary"
              size="lg"
              className="flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Course
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const renderFilters = () => (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="flex gap-4">
        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Level" />
          </SelectTrigger>
          <SelectContent>
            {levels.map(level => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </Button>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
      {categories.map(category => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => setSelectedCategory(category)}
          className="whitespace-nowrap"
        >
          {category}
        </Button>
      ))}
    </div>
  );

  const renderCourseCard = (course) => (
    <Card
      key={course._id}
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => setSelectedCourse(course)}
    >
      <div className="relative">
        <img 
          src="/api/placeholder/400/200" 
          alt={course.title} 
          className="w-full h-48 object-cover" 
        />
        <span className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-medium text-purple-600">
          {course.level}
        </span>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-purple-600">{course.category}</span>
          <span className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            {course.duration}
          </span>
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Users className="w-4 h-4 text-gray-400 mr-1" />
            <span className="text-sm text-gray-500">
              {course.enrolled?.length || 0} students
            </span>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{course.rating.toFixed(1)}</span>
          </div>
        </div>

        <Button 
          className="w-full flex items-center justify-center gap-2"
          onClick={(e) => handleEnroll(course._id, e)}
        >
          <Play className="w-4 h-4" />
          Start Learning
        </Button>
      </CardContent>
    </Card>
  );

  const renderCourseDetail = () => (
    <div className="space-y-6">
      <Button
        variant="ghost"
        className="text-purple-600"
        onClick={() => setSelectedCourse(null)}
      >
        ← Back to Courses
      </Button>
      
      <Card>
        <div className="relative h-64">
          <img
            src="/api/placeholder/1200/400"
            alt={selectedCourse.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h2 className="text-3xl font-bold mb-2">{selectedCourse.title}</h2>
            <p className="text-lg opacity-90">{selectedCourse.description}</p>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-400 mr-2" />
              <span>{selectedCourse.duration}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 text-gray-400 mr-2" />
              <span>{selectedCourse.enrolled?.length || 0} enrolled</span>
            </div>
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 mr-2" />
              <span>{selectedCourse.rating.toFixed(1)}</span>
            </div>
          </div>

          <CourseContent
            content={selectedCourse.content}
            progress={selectedCourse.enrolled?.find(e => e.student === 'currentUserId')}
            onComplete={handleContentComplete}
          />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {renderHeader()}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {selectedCourse ? (
          renderCourseDetail()
        ) : (
          <>
            {renderFilters()}
            {renderCategories()}
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(renderCourseCard)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ELearningPage;