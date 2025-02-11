import React from "react";
import { User } from "lucide-react";

// Profile Page Component
const ProfilePage = () => {
    const userProfile = {
      name: "Alex Johnson",
      role: "Software Developer",
      email: "alex.j@example.com",
      location: "San Francisco, CA",
      skills: ["React", "Node.js", "Python", "AWS"],
      education: "MS Computer Science",
      interests: ["AI/ML", "Web Development", "Cloud Architecture"]
    };
  
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-24 h-24 bg-purple-200 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-purple-600" />
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold">{userProfile.name}</h2>
              <p className="text-gray-600">{userProfile.role}</p>
              <p className="text-gray-500">{userProfile.location}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
              <p className="text-gray-600 mb-2">Email: {userProfile.email}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Education</h3>
              <p className="text-gray-600">{userProfile.education}</p>
            </div>
          </div>
  
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {userProfile.skills.map(skill => (
                <span key={skill} className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
  
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {userProfile.interests.map(interest => (
                <span key={interest} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
export default ProfilePage;