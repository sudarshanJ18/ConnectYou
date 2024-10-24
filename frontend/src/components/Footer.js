import React from 'react';
import './Footer.css'; // CSS file for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Company Information */}
        <div className="footer-section about">
          <h3>ConnectYou</h3>
          <p>Connecting alumni and students for a brighter future.</p>
        </div>

        {/* Contact Information */}
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p>Email: support@connectyou.com</p>
          <p>Phone: +91 12345 67890</p>
          <p>Address: 123, Tech Park, Bengaluru, India</p>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/alumni-blogs">Alumni Blogs</a></li>
            <li><a href="/tech-news">Today's Tech News</a></li>
            <li><a href="/mentorship">Mentorship Programs</a></li>
            <li><a href="/open-projects">Open Projects</a></li>
            <li><a href="/workshops">Workshops & Events</a></li>
          </ul>
        </div>

        {/* Social Links with Icons */}
        <div className="footer-section social">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 ConnectYou. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
