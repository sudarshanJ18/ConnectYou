import React, { useEffect, useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import Navbar from "../../components/shared/Navbar";

// Events Page Component
const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/events");
        const data = await response.json();
        setEvents(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching events:", err);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Fixed Sidebar Navigation */}
      <div className="flex-none">
        <Navbar type="student" />
      </div>

      {/* Main Content Area - Shifted right to accommodate sidebar */}
      <div className="flex-1 ml-64 p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg mb-6">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">Events & Networking</h1>
            <p className="text-purple-100">
              Connect with alumni and participate in upcoming events
            </p>
          </div>
        </div>

        {/* Events List */}
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Upcoming Events</h2>
            <div className="flex space-x-2">
              <select className="border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                <option>All Categories</option>
                <option>Networking</option>
                <option>Workshops</option>
                <option>Webinars</option>
              </select>
              <select className="border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                <option>All Locations</option>
                <option>Online</option>
                <option>On-Campus</option>
                <option>Off-Campus</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
            </div>
          ) : (
            <div className="grid gap-6">
              {events.map((event) => (
                <div key={event.title} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-gray-600 flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />{event.date}
                          </p>
                          <p className="text-gray-600 flex items-center">
                            <Clock className="w-4 h-4 mr-2" />{event.time}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />{event.location}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700">{event.description}</p>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-center">
                      <div className="text-center mb-3">
                        <span className="block text-2xl font-bold text-purple-600">
                          {new Date(event.date).getDate()}
                        </span>
                        <span className="block text-sm text-gray-500">
                          {new Date(event.date).toLocaleString('default', { month: 'short' })}
                        </span>
                      </div>
                      <button className="w-full bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors duration-200">
                        Register Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;