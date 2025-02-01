import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MessageSquare, Calendar, Award, Target } from 'lucide-react';

interface FeaturesProps {
  showCards: boolean;
}

const Features: React.FC<FeaturesProps> = ({ showCards }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: 'Real-time Chat',
      description: 'Connect instantly with alumni through our secure messaging platform.',
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: 'Event Scheduling',
      description: 'Easily schedule mentoring sessions and networking events.',
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Skill Development',
      description: 'Access resources and workshops to enhance your professional skills.',
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Goal Tracking',
      description: 'Set and track your career goals with guidance from mentors.',
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
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
        className="grid grid-cols-1 md:grid-cols-2 gap-12"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mt-1">{feature.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Features;