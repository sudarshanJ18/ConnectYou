import React from 'react';
import './Overview.css'; // Make sure the path is correct

const Overview = ({ showCards }) => {
  return (
    <div className="overview-container">
      <div className={`card ${showCards ? 'fade-in' : ''}`}>
        <h3><b>About Lovely Professional University</b></h3>
        <p>
          Lovely Professional University (LPU) is a leading global university, known for its diverse programs 
          and vibrant campus life. It offers a variety of undergraduate, postgraduate, and doctoral programs 
          across multiple disciplines, fostering holistic development through academic excellence and extracurricular activities.
        </p>
      </div>
      <div className={`card ${showCards ? 'fade-in' : ''}`}>
        <h3><b>About ConnectYou Application</b></h3>
        <p>
          ConnectYou is an innovative platform designed to bridge the gap between alumni and students. 
          It facilitates meaningful connections, mentorship opportunities, and collaboration on projects, 
          ensuring a vibrant community that supports personal and professional growth.
        </p>
      </div>
    </div>
  );
};

export default Overview;
