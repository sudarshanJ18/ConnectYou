import React, { useState } from 'react';
import './Signup.css';
import { FaGoogle, FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa'; 
import { auth, googleProvider, facebookProvider } from './firebaseConfig';
import { signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth'; 
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead

const Signup = ({ togglePage }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState(''); // Phone number state
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    let validationErrors = {};

    // Input validation
    if (!name) validationErrors.name = 'Name is required';
    if (!email) validationErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) validationErrors.email = 'Invalid email';
    if (!password) validationErrors.password = 'Password is required';
    else if (password.length < 6) validationErrors.password = 'Password must be at least 6 characters';
    if (!phone) validationErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(phone)) validationErrors.phone = 'Phone number must be 10 digits';

    if (Object.keys(validationErrors).length === 0) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('User signed up:', userCredential.user);
        
        // Save the user's additional details (like name and phone) to your database
        // Make sure to handle this in your database logic (this example assumes Firestore)
        // await saveUserDetails(userCredential.user.uid, { name, phone });

        // Navigate to another page after signup (optional)
        navigate('/dashboard'); // Replace with your desired route

      } catch (error) {
        console.error('Error during signup:', error);
        if (error.code === 'auth/email-already-in-use') {
          setErrors({ email: 'Email already in use' });
        } else {
          setErrors({ email: 'Signup failed, please try again' });
        }
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google Sign In:', result.user);
      navigate('/dashboard'); // Navigate after successful sign-in
    } catch (error) {
      console.error('Error during Google Sign In:', error);
    }
  };

  const handleFacebookSignup = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      console.log('Facebook Sign In:', result.user);
      navigate('/dashboard'); // Navigate after successful sign-in
    } catch (error) {
      console.error('Error during Facebook Sign In:', error);
    }
  };

  return (
    <div className="form-container signup">
      <div className="info-section">
        <h2>Join ConnectYou</h2>
        <p>Connect with alumni and grow your network.</p>
      </div>
      <div className="form-section">
        <div className="social-icons">
          <div className="icon-wrapper" onClick={handleGoogleSignup}>
            <FaGoogle />
          </div>
          <div className="icon-wrapper" onClick={handleFacebookSignup}>
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
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>
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
          <div className="form-group">
            <label>Phone Number:</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your phone number" />
            {errors.phone && <p className="error">{errors.phone}</p>}
          </div>
          <button type="submit" className="submit-btn">Signup</button>
          <p className="toggle-page">Already have an account? <span onClick={togglePage} style={{ color: '#3498db', cursor: 'pointer' }}>Login</span></p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
