import React, { useState, useEffect } from 'react';
import { MapPin, DollarSign, Clock, Building, Search } from 'lucide-react';

const JobsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [jobs, setJobs] = useState([]); // State to store job data from backend
  const [loading, setLoading] = useState(true); // State to manage loading status

  const jobTypes = ['All', 'Full-time', 'Part-time', 'Internship', 'Contract'];

  useEffect(() => {
    // Fetch job data from backend API
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/jobs'); // Adjust the URL if needed
        const data = await response.json();
        setJobs(data); // Set the jobs data from backend
      } catch (error) {
        console.error('Error fetching job data:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchJobs(); // Call the fetchJobs function when the component mounts
  }, []);

  const filteredJobs = jobs.filter(job =>
    (selectedType === 'All' || job.type === selectedType) &&
    (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Jobs & Internships</h1>
        <p className="text-gray-600">Find your next career opportunity</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search jobs by title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {jobTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedType === type
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map(job => (
          <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <img src={job.logo} alt={job.company} className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <span className="text-sm text-gray-500">{job.posted}</span>
                </div>
                
                <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-1" />
                    {job.company}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {job.salary}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {job.type}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                    Apply Now
                  </button>
                  <button className="border border-purple-600 text-purple-600 py-2 px-4 rounded-lg hover:bg-purple-50 transition-colors">
                    Save Job
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

export default JobsPage;
