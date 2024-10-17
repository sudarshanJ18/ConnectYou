import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import lpuLogo from '../assets/lpu-logo.png'; 
import mentorIcon from '../assets/mentor-icon.png';
import groupIcon from '../assets/group-icon.jpg';
import jobsIcon from '../assets/jobs-icon.png';
import workshopIcon from '../assets/workshop-icon.webp';
import projectsIcon from '../assets/projects-icon.jpg';
import resourcesIcon from '../assets/resources-icon.jpg';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCards(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="landing-page" >
      {/* Logo and Heading Section */}
      <div className="header-container">
        <div className="lpu-logo">
          <img src={lpuLogo} alt="LPU Logo" />
        </div>
        <div className="heading-subtitle">
          <h1 className="main-heading">ConnectYou</h1>
          <p className="sub-heading">Alumni & Student Engagement Hub</p>
        </div>
      </div>

      {/* Banner Section */}
      <div className="banner-section">
        <div className="banner-content">
          <h1>ConnectYou</h1>
          <p>Fostering connections between alumni and students.</p>
          <button className="cta-button">Join Now</button>
        </div>
      </div>

      {/* Authentication Buttons */}
      <div className="auth-buttons">
        <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
        <button className="signup-btn" onClick={() => navigate('/signup')}>Signup</button>
      </div>

      {/* Overview Section */}
      <div className="overview-container">
        <div className={`card ${showCards ? 'fade-in' : ''}`}>
          <h3>About Lovely Professional University</h3>
          <p>
            Lovely Professional University (LPU) is a leading global university, known for its diverse programs 
            and vibrant campus life. It offers a variety of undergraduate, postgraduate, and doctoral programs 
            across multiple disciplines, fostering holistic development through academic excellence and extracurricular activities.
          </p>
        </div>
        <div className={`card ${showCards ? 'fade-in' : ''}`}>
          <h3>About ConnectYou Application</h3>
          <p>
            ConnectYou is an innovative platform designed to bridge the gap between alumni and students. 
            It facilitates meaningful connections, mentorship opportunities, and collaboration on projects, 
            ensuring a vibrant community that supports personal and professional growth.
          </p>
        </div>

        {/* New Interactive Features Section */}
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
      </div>

      {/* Interactive Overview Section */}
      <div className="interactive-overview">
        <h2>Interactive Overview of the Application</h2>
        <p>
          Discover how ConnectYou facilitates connections between alumni and students through our dynamic features.
          Join us for a walkthrough that highlights mentorship matching, job listings, project collaboration, and more!
        </p>

        {/* Embedded YouTube Video */}
        <div className="overview-video">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/wzETdEyoPyU"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
