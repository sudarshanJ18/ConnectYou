import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
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
    <header className="flex justify-between items-center w-full p-4 bg-black">
      <div className="flex items-center">
        <img src={lpuLogo} alt="LPU Logo" className="w-24 h-auto mr-2" />
        <div className="flex flex-col">
          <h1 className="text-2xl text-white">ConnectYou</h1>
          <p className="text-gray-400">Alumni & Student Engagement Hub</p>
        </div>
      </div>
      <div className="flex space-x-4">
        <button 
          onClick={handleLogin} 
          className="bg-blue-400 hover:bg-blue-500 text-black py-2 px-4 rounded"
        >
          Login
        </button>
        <button 
          onClick={handleSignup} 
          className="bg-blue-800 hover:bg-blue-900 text-white py-2 px-4 rounded"
        >
          Signup
        </button>
      </div>
    </header>
  );
};

export default Header;
