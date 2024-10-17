import React, { useState } from 'react';
import './Signup.css'; // Add similar styling as used in the login page
import { FaGoogle, FaFacebookF, FaTwitter } from 'react-icons/fa'; // Icons for social media

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset previous errors
    setErrors({});

    // Basic validation
    let validationErrors = {};

    if (!name) {
      validationErrors.name = 'Name is required';
    }

    if (!email) {
      validationErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = 'Email address is invalid';
    }

    if (!password) {
      validationErrors.password = 'Password is required';
    } else if (password.length < 6) {
      validationErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(validationErrors).length === 0) {
      // No validation errors, proceed with form submission
      console.log('Form submitted:', { name, email, password });
    } else {
      // Set validation errors
      setErrors(validationErrors);
    }
  };

  return (
    <div className="signup-page">
      <h2>Signup for ConnectYou</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <button type="submit" className="submit-btn">Signup</button>
      </form>

      {/* Social media login options */}
      <div className="social-login">
        <p>Or signup with</p>
        <button className="google-btn">
          <FaGoogle /> Sign up with Google
        </button>
        <button className="facebook-btn">
          <FaFacebookF /> Sign up with Facebook
        </button>
        <button className="twitter-btn">
          <FaTwitter /> Sign up with X
        </button>
      </div>
    </div>
  );
};

export default Signup;
