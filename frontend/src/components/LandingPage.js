import React, { useEffect, useState, useRef } from 'react';
import './LandingPage.css'; 
import Banner from './Banner';
import Overview from './Overview';
import Features from './Features';
import AlumniShowcase from './AlumniShowcase';


const LandingPage = () => {
  const [showCards, setShowCards] = useState(false);
  const featuresRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCards(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleExploreClick = () => {
    setShowCards(true);
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page">
      <Banner onExploreClick={handleExploreClick} />

      {/* Overview Section */}
      <Overview showCards={showCards} />

      {/* Features Section */}
      <div ref={featuresRef}>
        <Features showCards={showCards} />
      </div>

      {/* Alumni Showcase Section */}
      <AlumniShowcase />

      {/* Insights Section */}
      <section className="insights-section">
        <div className="insight">
          <div className="insight-image">
            <img src="../assets/mentorship.jpg" alt="Mentorship and Support" />
          </div>
          <div className="insight-text">
            <h3>How ConnectYou Helps Students</h3>
            <p>
              ConnectYou provides a platform for students to connect with alumni for mentorship and guidance. Whether you're
              looking for advice on academic projects, career decisions, or personal development, our platform ensures you have
              the support you need.
            </p>
          </div>
        </div>

        <div className="insight opposite">
          <div className="insight-text">
            <h3>Get Job Market Insights</h3>
            <p>
              Stay ahead of the curve with real-time insights into the job market. Our platform provides access to job listings,
              networking opportunities with professionals, and resources that help you stay competitive in the job market.
            </p>
          </div>
          <div className="insight-image">
            <img src="../assets/job-insight.jpeg" alt="Job Market Insights" />
          </div>
        </div>
      </section>

      {/* Unified Video and Blogs Section */}
      <section className="videos-blogs-section">
        <h3>Latest Videos and Blogs from ConnectYou</h3>
        <div className="content-grid">
          {/* Video */}
          <div className="content-item video">
            <iframe
              width="100%"
              height="200"
              src="https://www.youtube.com/embed/wzETdEyoPyU"
              title="ConnectYou Overview Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Blogs */}
          <div className="content-item blog">
            <h4>How Alumni Mentorship Boosts Career Success</h4>
            <p>Explore the benefits of connecting with alumni for career advice and mentorship opportunities...</p>
            <a href="/blogs/mentorship" className="read-more">Read More</a>
          </div>

          <div className="content-item blog">
            <h4>Upcoming Tech Trends in 2024</h4>
            <p>Stay updated on the latest trends in technology and how they impact the job market...</p>
            <a href="/blogs/tech-trends" className="read-more">Read More</a>
          </div>

          <div className="content-item blog">
            <h4>Maximizing Networking Opportunities</h4>
            <p>Learn how to leverage your network effectively to open doors in your career...</p>
            <a href="/blogs/networking" className="read-more">Read More</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
