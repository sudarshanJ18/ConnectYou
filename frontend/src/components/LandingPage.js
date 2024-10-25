import React, { useEffect, useState, useRef } from 'react';
import './LandingPage.css'; 
import Header from './Header'; // Import the Header component
import Footer from './Footer'; // Import the Footer component
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
    <div className="landing-page flex flex-col items-center m-0 p-0">
      <Header /> {/* Include the Header here */}
      
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
      <section className="insights-section flex flex-col my-10 p-5">
        <div className="insight flex items-center mb-10">
          <div className="insight-image flex-1 text-center">
            <img src="../assets/mentorship.jpg" alt="Mentorship and Support" className="max-w-80% h-auto rounded-lg" />
          </div>
          <div className="insight-text flex-1 p-5">
            <h3 className="text-lg font-semibold">How ConnectYou Helps Students</h3>
            <p>
              ConnectYou provides a platform for students to connect with alumni for mentorship and guidance. Whether you're
              looking for advice on academic projects, career decisions, or personal development, our platform ensures you have
              the support you need.
            </p>
          </div>
        </div>

        <div className="insight flex items-center mb-10 flex-row-reverse">
          <div className="insight-text flex-1 p-5">
            <h3 className="text-lg font-semibold">Get Job Market Insights</h3>
            <p>
              Stay ahead of the curve with real-time insights into the job market. Our platform provides access to job listings,
              networking opportunities with professionals, and resources that help you stay competitive in the job market.
            </p>
          </div>
          <div className="insight-image flex-1 text-center">
            <img src="../assets/job-insight.jpeg" alt="Job Market Insights" className="max-w-80% h-auto rounded-lg" />
          </div>
        </div>
      </section>

      {/* Unified Video and Blogs Section */}
      <section className="videos-blogs-section text-center my-10 p-5">
        <h3 className="text-xl font-semibold">Latest Videos and Blogs from ConnectYou</h3>
        <div className="content-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center mt-5">
          {/* Video */}
          <div className="content-item video w-full">
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
          <div className="content-item blog bg-gray-100 p-5 rounded-lg">
            <h4 className="text-lg font-semibold">How Alumni Mentorship Boosts Career Success</h4>
            <p className="text-gray-700">Explore the benefits of connecting with alumni for career advice and mentorship opportunities...</p>
            <a href="/blogs/mentorship" className="read-more text-blue-600 hover:underline mt-2 inline-block">Read More</a>
          </div>

          <div className="content-item blog bg-gray-100 p-5 rounded-lg">
            <h4 className="text-lg font-semibold">Upcoming Tech Trends in 2024</h4>
            <p className="text-gray-700">Stay updated on the latest trends in technology and how they impact the job market...</p>
            <a href="/blogs/tech-trends" className="read-more text-blue-600 hover:underline mt-2 inline-block">Read More</a>
          </div>

          <div className="content-item blog bg-gray-100 p-5 rounded-lg">
            <h4 className="text-lg font-semibold">Maximizing Networking Opportunities</h4>
            <p className="text-gray-700">Learn how to leverage your network effectively to open doors in your career...</p>
            <a href="/blogs/networking" className="read-more text-blue-600 hover:underline mt-2 inline-block">Read More</a>
          </div>
        </div>
      </section>

      <Footer /> {/* Include the Footer here */}
    </div>
  );
};

export default LandingPage;
