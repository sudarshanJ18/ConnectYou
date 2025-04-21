import React, { useEffect, useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";

// Events Page Component
const EventsPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events");
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
      <div className="grid gap-6">
        {events.map((event) => (
          <div key={event.title} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-600"><Calendar className="inline w-4 h-4 mr-2" />{event.date}</p>
                <p className="text-gray-600"><Clock className="inline w-4 h-4 mr-2" />{event.time}</p>
              </div>
              <div>
                <p className="text-gray-600"><MapPin className="inline w-4 h-4 mr-2" />{event.location}</p>
              </div>
            </div>
            <p className="text-gray-700">{event.description}</p>
            <button className="mt-4 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors duration-200">
              Register Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
