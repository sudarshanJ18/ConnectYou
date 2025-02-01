import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Star, Calendar, MessageSquare } from 'lucide-react';

// Mock data for mentors
const MOCK_MENTORS = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    role: "Senior Software Engineer",
    company: "Google",
    expertise: ["React", "Node.js", "System Design"],
    rating: 4.8,
    availability: "Available",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    sessions: 120,
  },
  {
    id: 2,
    name: "Mark Rodriguez",
    role: "Tech Lead",
    company: "Microsoft",
    expertise: ["Python", "Machine Learning", "Cloud Architecture"],
    rating: 4.9,
    availability: "Available next week",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
    sessions: 85,
  },
  // Add more mock mentors as needed
];

const MentorCard = ({ mentor, onRequestSession }) => {
  return (
    <Card className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative">
        <img 
          src={mentor.image} 
          alt={mentor.name} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
          {mentor.availability}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{mentor.name}</h3>
        <p className="text-gray-600 mb-2">{mentor.role} at {mentor.company}</p>
        
        <div className="flex items-center mb-4">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="text-gray-700">{mentor.rating}</span>
          <span className="mx-2">•</span>
          <Users className="w-4 h-4 text-gray-500 mr-1" />
          <span className="text-gray-700">{mentor.sessions} sessions</span>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2">Expertise</h4>
          <div className="flex flex-wrap gap-2">
            {mentor.expertise.map((skill, index) => (
              <span 
                key={index}
                className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={() => onRequestSession(mentor)}
            className="flex-1 bg-purple-600 text-white hover:bg-purple-700"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Session
          </Button>
          <Button 
            variant="outline"
            className="flex-1 border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Message
          </Button>
        </div>
      </div>
    </Card>
  );
};

const MentorPage = () => {
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('');

  useEffect(() => {
    // Simulate API call
    setMentors(MOCK_MENTORS);
  }, []);

  const handleRequestSession = (mentor) => {
    // Implement session booking logic
    console.log('Requesting session with:', mentor.name);
  };

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExpertise = !selectedExpertise || 
                            mentor.expertise.some(exp => exp.toLowerCase() === selectedExpertise.toLowerCase());
    return matchesSearch && matchesExpertise;
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Find Your Mentor</h1>
        <p className="text-gray-600">Connect with experienced professionals who can guide your career journey.</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex gap-4">
        <input
          type="text"
          placeholder="Search mentors..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={selectedExpertise}
          onChange={(e) => setSelectedExpertise(e.target.value)}
        >
          <option value="">All Expertise</option>
          <option value="React">React</option>
          <option value="Python">Python</option>
          <option value="Machine Learning">Machine Learning</option>
          <option value="System Design">System Design</option>
        </select>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map(mentor => (
          <MentorCard
            key={mentor.id}
            mentor={mentor}
            onRequestSession={handleRequestSession}
          />
        ))}
      </div>
    </div>
  );
};

export default MentorPage;