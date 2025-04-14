import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Github as GitHub, Linkedin, Twitter, MapPin, Edit2, Save } from 'lucide-react';
import { getProfile, updateProfile } from "../../utils/api";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await getProfile();
        console.log("✅ Profile Data:", response);
        setProfile(response);
        setEditedProfile(response);
      } catch (error) {
        console.error("❌ Error fetching profile:", error.response?.data || error.message);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError(error.response?.data?.message || "Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await updateProfile(editedProfile);
      console.log("✅ Profile Updated:", response);
      setProfile(response);
      setIsEditing(false);
    } catch (error) {
      console.error("❌ Error updating profile:", error.response?.data || error.message);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <motion.div
      className="max-w-4xl mx-auto py-8 px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="relative h-32 bg-gradient-to-r from-purple-500 to-blue-500">
          {isEditing && (
            <button
              onClick={handleSave}
              className="absolute top-4 right-4 bg-white text-purple-600 p-2 rounded-full shadow-md hover:bg-purple-50 transition-colors"
              disabled={loading}
            >
              <Save className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="relative px-6 pb-6">
          <div className="flex flex-col items-center -mt-16">
            <motion.div
              className="w-32 h-32 bg-purple-200 rounded-full border-4 border-white shadow-lg flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <User className="w-16 h-16 text-purple-600" />
            </motion.div>

            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold text-gray-800">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className="text-center border-b-2 focus:outline-none focus:border-purple-500"
                  />
                ) : (
                  profile.name
                )}
              </h1>
              <p className="text-gray-600 mt-1">{profile.role}</p>
              <p className="flex items-center justify-center text-gray-500 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {profile.location}
              </p>
            </motion.div>
          </div>

          {/* Social Links */}
          {profile.social && (
            <div className="flex justify-center space-x-4 mt-4">
              {Object.entries(profile.social).map(([platform, link]) => {
                if (!link) return null;
                const Icon = {
                  github: GitHub,
                  linkedin: Linkedin,
                  twitter: Twitter
                }[platform];

                return Icon ? (
                  <motion.a
                    key={platform}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-purple-600 transition-colors"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.a>
                ) : null;
              })}
            </div>
          )}

          {/* Bio */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2">About Me</h3>
            {isEditing ? (
              <textarea
                value={editedProfile.bio}
                onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:border-purple-500"
                rows="4"
              />
            ) : (
              <p className="text-gray-600">{profile.bio}</p>
            )}
          </div>

          {/* Skills */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills?.map((skill, index) => (
                <motion.span
                  key={skill}
                  className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Experience */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-3">Experience</h3>
            {profile.experience?.map((exp, index) => (
              <motion.div
                key={index}
                className="mb-4 p-4 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <h4 className="font-semibold">{exp.company}</h4>
                <p className="text-gray-600">{exp.title}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(exp.from).toLocaleDateString()} - 
                  {exp.current ? 'Present' : new Date(exp.to).toLocaleDateString()}
                </p>
                <p className="text-gray-600 mt-2">{exp.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Edit Button */}
          <motion.button
            className="fixed bottom-8 right-8 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(!isEditing)}
            disabled={loading}
          >
            <Edit2 className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;