import React from 'react';
import mentorIcon from '../assets/mentor-icon.png';
import groupIcon from '../assets/group-icon.jpg';
import jobsIcon from '../assets/jobs-icon.png';
import workshopIcon from '../assets/workshop-icon.webp';
import projectsIcon from '../assets/projects-icon.jpg';
import resourcesIcon from '../assets/resources-icon.jpg';
import './Features.css';

const Features = ({ showCards }) => {
  return (
    <div className={`features-section ${showCards ? 'fade-in' : ''}`}>
      <h5 className="offer">
        What ConnectYou Offers
      </h5>
      <div className="flex flex-col sm:flex-row sm:space-x-4">
        <div className="w-full sm:w-1/2 bg-gray-100 rounded-lg p-6 shadow-lg">
          <h6 className="text-2xl font-semibold text-center mb-4">Explore Features</h6>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: mentorIcon, title: 'Mentorship', description: 'Connect with alumni for guidance and support.', glowColor: 'rgba(255, 193, 7, 0.5)' },
              { icon: groupIcon, title: 'Join Groups', description: 'Engage in interest-based groups for collaboration.', glowColor: 'rgba(40, 167, 69, 0.5)' },
              { icon: jobsIcon, title: 'Job Listings', description: 'Explore job opportunities and internships.', glowColor: 'rgba(23, 162, 184, 0.5)' },
            ].map((feature, index) => (
              <div
                key={index}
                className="feature-card transition duration-300 relative border rounded-lg shadow-md overflow-hidden p-4 hover:shadow-lg"
                style={{ '--glow-color': feature.glowColor }}
              >
                <div className="glow-card"></div>
                <img src={feature.icon} alt={feature.title} className="w-16 h-16 mb-4 mx-auto" />
                <h4 className="text-xl font-semibold text-center mb-2">{feature.title}</h4>
                <p className="text-gray-700 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full sm:w-1/2 bg-gray-200 rounded-lg p-6 shadow-lg">
          <h6 className="text-2xl font-semibold text-center mb-4">More Features</h6>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: workshopIcon, title: 'Workshops', description: 'Participate in skill development workshops.', glowColor: 'rgba(255, 0, 0, 0.5)' },
              { icon: projectsIcon, title: 'Collaborate', description: 'Work together on group projects and initiatives.', glowColor: 'rgba(255, 87, 34, 0.5)' },
              { icon: resourcesIcon, title: 'Resources', description: 'Access valuable resources for career growth.', glowColor: 'rgba(0, 123, 255, 0.5)' },
            ].map((feature, index) => (
              <div
                key={index}
                className="feature-card transition duration-300 relative border rounded-lg shadow-md overflow-hidden p-4 hover:shadow-lg"
                style={{ '--glow-color': feature.glowColor }}
              >
                <div className="glow-card"></div>
                <img src={feature.icon} alt={feature.title} className="w-16 h-16 mb-4 mx-auto" />
                <h4 className="text-xl font-semibold text-center mb-2">{feature.title}</h4>
                <p className="text-gray-700 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
