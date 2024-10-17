import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import './Header.css'; // Ensure you have the CSS for header styling
import lpuLogo from '../assets/lpu-logo.png';

const Header = () => {
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = () => {
    navigate('/login'); // Navigate to login page
  };

  const handleSignup = () => {
    navigate('/signup'); // Navigate to signup page
  };

  return (
    <header className="header-container">
      <div className="logo-container">
        <img src={lpuLogo} alt="LPU Logo" className="logo" />
        <div className="title-container">
          <h1 className="main-heading">ConnectYou</h1>
          <p className="sub-heading">Alumni & Student Engagement Hub</p>
        </div>
      </div>
      <div className="auth-buttons">
        <button className="login-btn" onClick={handleLogin}>Login</button>
        <button className="signup-btn" onClick={handleSignup}>Signup</button>
      </div>
    </header>
  );
};

export default Header;
