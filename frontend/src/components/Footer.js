import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate(); // ✅ Initialize navigation

  const footerSections = [
    {
      title: "Company",
      links: ["About Us", "Careers", "Press", "Blog"],
    },
    {
      title: "Resources",
      links: ["Documentation", "Help Center", "Privacy Policy", "Terms of Service"],
    },
    {
      title: "Contact",
      items: [
        { icon: <Mail className="h-5 w-5" />, text: "contact@connectyou.com" },
        { icon: <Phone className="h-5 w-5" />, text: "+91 9999999999" },
        { icon: <MapPin className="h-5 w-5" />, text: "LPU, Punjab" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center mb-4">
              <GraduationCap className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">ConnectYou</span>
            </div>
            <p className="text-gray-400">
              Connecting students with alumni for better career opportunities and mentorship.
            </p>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {"links" in section
                  ? section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <motion.a
                          href="#"
                          whileHover={{ x: 5 }}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {link}
                        </motion.a>
                      </li>
                    ))
                  : section.items?.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center space-x-2 text-gray-400">
                        {item.icon}
                        <span>{item.text}</span>
                      </li>
                    ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 ConnectYou. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              {/* ✅ "Join Now" Button with Navigation */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/signup")} // ✅ Navigate to Signup page
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                Join Now
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
