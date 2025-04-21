import React, { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, ExternalLink } from 'lucide-react';

const WorkshopsPage = () => {
  const [workshops, setWorkshops] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/workshops/')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setWorkshops(data))
      .catch(error => console.error('Error fetching workshops:', error));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Upcoming Workshops</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200">
          Browse All Workshops
        </button>
      </div>

      <div className="grid gap-6">
        {workshops.map((workshop) => (
          <div
            key={workshop._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="md:flex">
              <div className="md:w-1/3">
                <img
                  src={workshop.image}
                  alt={workshop.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6 md:w-2/3">
                <h3 className="text-xl font-semibold mb-2">{workshop.title}</h3>
                <p className="text-gray-600 mb-4">{workshop.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{workshop.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{workshop.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{workshop.enrolled} / {workshop.capacity} enrolled</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <span>{workshop.time}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Instructor:</p>
                    <p className="font-semibold">{workshop.instructor}</p>
                  </div>
                  <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200">
                    Register Now
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

export default WorkshopsPage;
