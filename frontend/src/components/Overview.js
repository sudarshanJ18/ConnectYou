import React, { useState } from 'react';
import './Overview.css'; // Make sure the path is correct

// Import images
import LPUImage from '../assets/LPU.jpg'; // Ensure correct image path
import LPUImage2 from '../assets/LPU2.jpeg'; // Ensure correct image path

const Overview = ({ showCards }) => {
  const [openCard, setOpenCard] = useState(null);

  const toggleCard = (index) => {
    setOpenCard(openCard === index ? null : index);
  };

  return (
    <div className="overview-container">
      <div className={`card ${showCards ? 'fade-in' : ''}`}>
        <div className={`image-container ${openCard === 0 ? 'slide-up' : ''}`}>
          <img src={LPUImage} alt="LPU" className="card-image" />
        </div>
        <button className="arrow-button" onClick={() => toggleCard(0)}>
          <span className={`arrow ${openCard === 0 ? 'open' : ''}`}>▼</span>
        </button>
        <div className={`card-text ${openCard === 0 ? 'open' : ''}`}>
          <h3><b>About Lovely Professional University</b></h3>
          <p>
            Lovely Professional University (LPU) is a leading global university, known for its diverse programs and vibrant campus life.
            It offers a variety of undergraduate, postgraduate, and doctoral programs across multiple disciplines, fostering holistic
            development through academic excellence and extracurricular activities.
          </p>
        </div>
      </div>

      <div className={`card ${showCards ? 'fade-in' : ''}`}>
        <div className={`image-container ${openCard === 1 ? 'slide-up' : ''}`}>
          <img src={LPUImage2} alt="ConnectYou" className="card-image" />
        </div>
        <button className="arrow-button" onClick={() => toggleCard(1)}>
          <span className={`arrow ${openCard === 1 ? 'open' : ''}`}>▼</span>
        </button>
        <div className={`card-text ${openCard === 1 ? 'open' : ''}`}>
          <h3><b>About ConnectYou Application</b></h3>
          <p>
            <i className="fa-solid fa-arrow-right"></i> ConnectYou is an innovative platform designed to bridge the gap between alumni and students. 
            It facilitates meaningful connections, mentorship opportunities, and collaboration on projects, ensuring a vibrant community that supports personal and professional growth.
            <br /><i className="fa-solid fa-arrow-right"></i> ConnectYou is to create a platform that fosters connections and enhances communication among users, potentially within a community or network. 
            It could serve various purposes, such as facilitating social interaction, professional networking, or collaboration.
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default Overview;
