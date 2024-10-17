import React, { useEffect } from 'react';
import './Banner.css'; // Ensure you have the CSS for banner styling
import bannerImage from '../assets/banner-image.jpeg'; // Replace with your banner image path


const Banner = ({ onExploreClick }) => {
  // Add slide-in effect for text and button
  useEffect(() => {
    const timeout = setTimeout(() => {
      const bannerContent = document.querySelector('.banner-content');
      if (bannerContent) {
        bannerContent.classList.add('slide-in');
      }
    }, 500); // Delay for effect

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="banner-section" style={{ backgroundImage: `url(${bannerImage})` }}>
      <div className="overlay"></div>
      <div className="banner-content">
        <h1>
          Welcome to <span className="highlight">Connect</span><span className="highlight-2">You</span>
        </h1>
        <button className="explore-btn" onClick={onExploreClick}>
          Explore <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>

     
    </div>
  );
};

export default Banner;
