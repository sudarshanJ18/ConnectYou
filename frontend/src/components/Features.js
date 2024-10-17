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
      <h3>What You Can Do in ConnectYou</h3>
      <div className="features-grid">
        <div className="feature-card">
          <img src={mentorIcon} alt="Mentorship" />
          <h4>Mentorship</h4>
          <p>Connect with alumni for guidance and support.</p>
        </div>
        <div className="feature-card">
          <img src={groupIcon} alt="Groups" />
          <h4>Join Groups</h4>
          <p>Engage in interest-based groups for collaboration.</p>
        </div>
        <div className="feature-card">
          <img src={jobsIcon} alt="Job Listings" />
          <h4>Job Listings</h4>
          <p>Explore job opportunities and internships.</p>
        </div>
        <div className="feature-card">
          <img src={workshopIcon} alt="Workshops" />
          <h4>Workshops</h4>
          <p>Participate in skill development workshops.</p>
        </div>
        <div className="feature-card">
          <img src={projectsIcon} alt="Projects" />
          <h4>Collaborate</h4>
          <p>Work together on group projects and initiatives.</p>
        </div>
        <div className="feature-card">
          <img src={resourcesIcon} alt="Resources" />
          <h4>Resources</h4>
          <p>Access valuable resources for career growth.</p>
        </div>
      </div>
    </div>
  );
};

export default Features;
