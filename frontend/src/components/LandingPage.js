import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import Banner from './Banner';
import Overview from './Overview';
import Features from './Features';
import AlumniShowcase from './AlumniShowcase';
import { ArrowRight } from 'lucide-react';
import './LandingPage.css';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const LandingPage = () => {
  const [showCards, setShowCards] = useState(false);
  const featuresRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowCards(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleExploreClick = () => {
    setShowCards(true);
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <Header />
      
      {/* Banner */}
      <div className="banner-container">
        <Banner onExploreClick={handleExploreClick} />
      </div>

      {/* Overview Section */}
      <motion.section 
        {...fadeIn}
        className="overview-section"
      >
        <Overview showCards={showCards} />
      </motion.section>

      {/* Features Section */}
      <motion.div 
        ref={featuresRef}
        {...fadeIn}
        className="features-section"
      >
        <Features showCards={showCards} />
      </motion.div>

      {/* Alumni Showcase */}
      <section className="alumni-section">
        <AlumniShowcase />
      </section>

      {/* Insights Section */}
      <section className="insights-section">
        <div className="container">
          {/* First Insight */}
          <motion.div 
            className="insight-card"
            whileHover={{ scale: 1.02 }}
          >
            <div className="insight-image">
              <motion.img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Mentorship and Support"
                className="rounded-image"
              />
            </div>
            <div className="insight-content">
              <h3 className="insight-title">
                How ConnectYou Helps Students
              </h3>
              <p className="insight-text">
                ConnectYou provides a platform for students to connect with alumni for mentorship and guidance. Whether you're
                looking for advice on academic projects, career decisions, or personal development, our platform ensures you have
                the support you need.
              </p>
            </div>
          </motion.div>

          {/* Second Insight */}
          <motion.div 
            className="insight-card reverse"
            whileHover={{ scale: 1.02 }}
          >
            <div className="insight-image">
              <motion.img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Job Market Insights"
                className="rounded-image"
              />
            </div>
            <div className="insight-content">
              <h3 className="insight-title">
                Get Job Market Insights
              </h3>
              <p className="insight-text">
                Stay ahead of the curve with real-time insights into the job market. Our platform provides access to job listings,
                networking opportunities with professionals, and resources that help you stay competitive in the job market.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Videos and Blogs Section */}
      <section className="resources-section">
        <div className="container">
          <h2 className="section-title">
            Latest Videos and Blogs from ConnectYou
          </h2>
          
          <div className="resources-grid">
            {/* Video Card */}
            <motion.div 
              className="resource-card video-card"
              whileHover={{ y: -5 }}
            >
              <div className="video-container">
                <iframe
                  className="video-frame"
                  src="https://www.youtube.com/embed/wzETdEyoPyU"
                  title="ConnectYou Overview Video"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>

            {/* Blog Cards */}
            {[
              {
                title: "How Alumni Mentorship Boosts Career Success",
                excerpt: "Explore the benefits of connecting with alumni for career advice and mentorship opportunities...",
                link: "/blogs/mentorship"
              },
              {
                title: "Upcoming Tech Trends in 2024",
                excerpt: "Stay updated on the latest trends in technology and how they impact the job market...",
                link: "/blogs/tech-trends"
              }
            ].map((blog, index) => (
              <motion.div
                key={index}
                className="resource-card blog-card"
                whileHover={{ y: -5 }}
              >
                <h3 className="blog-title">
                  {blog.title}
                </h3>
                <p className="blog-excerpt">
                  {blog.excerpt}
                </p>
                <motion.a
                  href={blog.link}
                  className="read-more-link"
                  whileHover={{ x: 5 }}
                >
                  Read More <ArrowRight className="arrow-icon" />
                </motion.a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;