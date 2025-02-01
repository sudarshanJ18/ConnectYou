import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import Banner from './Banner';
import Overview from './Overview';
import Features from './Features';
import AlumniShowcase from './AlumniShowcase';
import { ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />
      
      {/* Banner */}
      <div className="w-full">
        <Banner onExploreClick={handleExploreClick} />
      </div>

      {/* Overview Section */}
      <motion.section 
        {...fadeIn}
        className="w-full py-16 px-4 md:px-8"
      >
        <Overview showCards={showCards} />
      </motion.section>

      {/* Features Section */}
      <motion.div 
        ref={featuresRef}
        {...fadeIn}
        className="w-full bg-gray-50 py-16 px-4 md:px-8"
      >
        <Features showCards={showCards} />
      </motion.div>

      {/* Alumni Showcase */}
      <section className="w-full py-16 px-4 md:px-8">
        <AlumniShowcase />
      </section>

      {/* Insights Section */}
      <section className="w-full py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* First Insight */}
          <motion.div 
            className="flex flex-col md:flex-row items-center gap-8 mb-16"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-full md:w-1/2">
              <motion.img 
                src="../assets/mentorship.jpg"
                alt="Mentorship and Support"
                className="w-full max-w-lg mx-auto rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">
                How ConnectYou Helps Students
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                ConnectYou provides a platform for students to connect with alumni for mentorship and guidance. Whether you're
                looking for advice on academic projects, career decisions, or personal development, our platform ensures you have
                the support you need.
              </p>
            </div>
          </motion.div>

          {/* Second Insight */}
          <motion.div 
            className="flex flex-col md:flex-row-reverse items-center gap-8"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-full md:w-1/2">
              <motion.img 
                src="../assets/job-insight.jpeg"
                alt="Job Market Insights"
                className="w-full max-w-lg mx-auto rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">
                Get Job Market Insights
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Stay ahead of the curve with real-time insights into the job market. Our platform provides access to job listings,
                networking opportunities with professionals, and resources that help you stay competitive in the job market.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Videos and Blogs Section */}
      <section className="w-full py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Latest Videos and Blogs from ConnectYou
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Video Card */}
            <motion.div 
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
              whileHover={{ y: -5 }}
            >
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
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
                className="bg-white rounded-2xl shadow-lg p-6 space-y-4"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-bold text-gray-900">
                  {blog.title}
                </h3>
                <p className="text-gray-600">
                  {blog.excerpt}
                </p>
                <motion.a
                  href={blog.link}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  whileHover={{ x: 5 }}
                >
                  Read More <ArrowRight className="ml-2 h-4 w-4" />
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