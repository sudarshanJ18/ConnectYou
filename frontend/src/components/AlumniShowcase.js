import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Linkedin, Twitter } from 'lucide-react';

const AlumniShowcase = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const alumni = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer at Google',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
      quote: 'ConnectYou helped me find my dream job through alumni networking.',
      linkedin: '#',
      twitter: '#',
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager at Apple',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
      quote: 'The mentorship I received through this platform was invaluable.',
      linkedin: '#',
      twitter: '#',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Data Scientist at Amazon',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80',
      quote: 'I love giving back to the community through mentoring.',
      linkedin: '#',
      twitter: '#',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div ref={ref} className="max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={containerVariants}
        className="text-center mb-16"
      >
        <motion.h2
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
        >
          Success Stories
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          Meet our accomplished alumni who are making waves in their industries
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {alumni.map((person, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="relative h-48">
              <img
                src={person.image}
                alt={person.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {person.name}
              </h3>
              <p className="text-blue-600 mb-4">{person.role}</p>
              <p className="text-gray-600 mb-6">"{person.quote}"</p>
              <div className="flex space-x-4">
                <a
                  href={person.linkedin}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href={person.twitter}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AlumniShowcase;