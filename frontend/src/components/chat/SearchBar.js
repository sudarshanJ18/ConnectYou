import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ 
  searchTerm, 
  setSearchTerm, 
  placeholder, 
  userType 
}) => {
  const ringColor = userType === 'student' ? 'focus:ring-green-500' : 'focus:ring-blue-500';
  
  return (
    <div className="p-4 border-b">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder || `Search ${userType === 'student' ? 'alumni' : 'students'}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${ringColor}`}
        />
      </div>
    </div>
  );
};

export default SearchBar;