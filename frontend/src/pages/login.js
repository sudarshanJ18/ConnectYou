import React, { useState } from 'react';
import './login.css'; // Ensure to style the login page

const Login = () => {
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
      console.log('Form submitted:', { email, password });
    } else {
      // Set validation errors
      setErrors(validationErrors);
    }
  };

  return (
    <div className="login-page">
      <h2>Login to ConnectYou</h2>
      
      <form onSubmit={handleSubmit} className="login-form">
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

        <button type="submit" className="login-btn">Login</button>
      </form>

      <div className="divider">or</div>

      {/* Social Media Login Options */}
      <div className="social-login">
        <button className="google-btn">
          <i className="fa-brands fa-google"></i> Continue with Google
        </button>
        <button className="facebook-btn">
          <i className="fa-brands fa-facebook"></i> Continue with Facebook
        </button>
        <button className="x-btn">
          <i className="fa-brands fa-x-twitter"></i> Continue with X
        </button>
      </div>
    </div>
  );
};

export default Login;
