import React, { useEffect, useState, useRef } from 'react';
import './LandingPage.css'; // Ensure you have the CSS for landing page styling
import Banner from './Banner';
import Overview from './Overview';
import Features from './Features';


const LandingPage = () => {
  const [showCards, setShowCards] = useState(false);
  const featuresRef = useRef(null); // Create a ref for the features section

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCards(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleExploreClick = () => {
    // Logic to slide in the card section
    setShowCards(true);
    // Scroll to the features section
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    
    <div className="landing-page">
      
      <Banner onExploreClick={handleExploreClick} />

      {/* Overview Section */}
      <Overview showCards={showCards} />

      {/* New Interactive Features Section */}
      <div ref={featuresRef}>
        <Features showCards={showCards} />
      </div>

      {/* Interactive Overview Section */}
      <div className="interactive-overview">
        <h2><b>Interactive Overview of the Application</b></h2>
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
