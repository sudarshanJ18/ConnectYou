import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import AlumniNavbar from "./AlumniNavbar";
import { Users, Briefcase, MessageSquare, Calendar, Award } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
};

const activityItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
  hover: {
    scale: 1.02,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

const iconVariants = {
  hover: {
    rotate: 360,
    scale: 1.2,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

const AlumniDashboard = () => {
  const stats = [
    {
      title: "Mentorships",
      count: 12,
      description: "Active Mentees",
      icon: <Users className="w-6 h-6 text-blue-500" />,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Jobs",
      count: 5,
      description: "Active Listings",
      icon: <Briefcase className="w-6 h-6 text-green-500" />,
      bgColor: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      title: "Upcoming Events",
      count: 3,
      description: "This Month",
      icon: <Calendar className="w-6 h-6 text-purple-500" />,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
  ];

  const activities = [
    {
      message: "New message from John Doe",
      time: "2 hours ago",
      icon: <MessageSquare className="w-5 h-5 text-blue-600" />,
      bgColor: "bg-blue-100",
    },
    {
      message: "Mentee completed project milestone",
      time: "1 day ago",
      icon: <Award className="w-5 h-5 text-green-600" />,
      bgColor: "bg-green-100",
    },
  ];

  return (
    <div className="flex">
      <AlumniNavbar />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="ml-64 p-6 bg-gray-100 min-h-screen w-full"
      >
        <motion.h1
          variants={headingVariants}
          className="text-3xl font-bold text-center mb-6 relative"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="inline-block mr-2"
          >
            🎓
          </motion.span>
          Alumni Dashboard
        </motion.h1>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", stiffness: 300 },
              }}
              className={`p-6 rounded-lg shadow-md ${stat.bgColor} transform transition-all duration-300`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{stat.title}</h2>
                <motion.div
                  variants={iconVariants}
                  whileHover="hover"
                  className="transform-gpu"
                >
                  {stat.icon}
                </motion.div>
              </div>
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className={`text-3xl font-bold ${stat.textColor}`}
              >
                {stat.count}
              </motion.p>
              <p className="text-gray-600">{stat.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={cardVariants}
          className="mt-8 bg-white p-6 rounded-lg shadow-md"
        >
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <AnimatePresence>
            <motion.div className="space-y-4">
              {activities.map((activity, index) => (
                <motion.div
                  key={index}
                  variants={activityItemVariants}
                  whileHover="hover"
                  className={`flex items-center gap-4 p-3 ${activity.bgColor} rounded-lg cursor-pointer`}
                >
                  <motion.div
                    variants={iconVariants}
                    whileHover="hover"
                    className={`${activity.bgColor} p-2 rounded-full`}
                  >
                    {activity.icon}
                  </motion.div>
                  <div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 * index }}
                      className="font-medium"
                    >
                      {activity.message}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 * index }}
                      className="text-sm text-gray-600"
                    >
                      {activity.time}
                    </motion.p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};


export default AlumniDashboard;