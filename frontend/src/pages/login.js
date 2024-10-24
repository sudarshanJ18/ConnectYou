import React, { useState } from 'react';
import './Signup.css'; 
import './login.css';
import { FaGoogle, FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa'; 
import { auth, googleProvider, facebookProvider } from './firebaseConfig';
import { signInWithPopup, sendPasswordResetEmail } from 'firebase/auth'; 

const Login = ({ togglePage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    let validationErrors = {};
    if (!email) validationErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) validationErrors.email = 'Invalid email';
    if (!password) validationErrors.password = 'Password is required';
    else if (password.length < 6) validationErrors.password = 'Password must be at least 6 characters';

    if (Object.keys(validationErrors).length === 0) {
      console.log('Form submitted:', { email, password });
      // Handle the actual login process here (e.g., using signInWithEmailAndPassword)
    } else {
      setErrors(validationErrors);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrors({ email: 'Please enter your email to reset the password' });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset link sent to your email');
    } catch (error) {
      console.error('Error sending password reset email:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google Login:', result.user);
    } catch (error) {
      console.error('Error during Google Login:', error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      console.log('Facebook Login:', result.user);
    } catch (error) {
      console.error('Error during Facebook Login:', error);
    }
  };

  return (
    <div className="form-container login animate">
      <div className="info-section">
        <h2 className='head'>Welcome Back to ConnectYou</h2>
        <p>Login to continue networking.</p>
      </div>
      <div className="form-section">
        <div className="social-icons">
          <div className="icon-wrapper" onClick={handleGoogleLogin}>
            <FaGoogle />
          </div>
          <div className="icon-wrapper" onClick={handleFacebookLogin}>
            <FaFacebookF />
          </div>
          <div className="icon-wrapper">
            <FaLinkedinIn />
          </div>
          <div className="icon-wrapper">
            <FaTwitter />
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <button type="submit" className="submit-btn">Login</button>
          <p className="toggle-page">Don't have an account? <span onClick={togglePage} style={{ color: '#3498db', cursor: 'pointer' }}>Signup</span></p>
          <p className="forgot-password" onClick={handleForgotPassword} style={{ color: '#3498db', cursor: 'pointer' }}>Forgot Password?</p>
        </form>
      </div>
    </div>
  );
};

export default Login;
