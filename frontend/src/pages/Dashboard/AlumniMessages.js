import React from 'react';
import { motion } from "framer-motion";
import AlumniNavbar from "./AlumniNavbar";
import { MessageSquare, Search, Send, User } from 'lucide-react';

const conversations = [
  {
    id: 1,
    name: "John Smith",
    lastMessage: "Thank you for the mentoring session!",
    time: "2:30 PM",
    unread: 2,
    status: "online"
  },
  {
    id: 2,
    name: "Sarah Wilson",
    lastMessage: "When would you be available for...",
    time: "Yesterday",
    unread: 0,
    status: "offline"
  }
];

const AlumniMessages = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <AlumniNavbar />

      {/* Main Content */}
      <div className="ml-64 p-6 bg-gray-100 min-h-screen w-full flex">
        {/* Conversations List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-1/4 border-r bg-white shadow-lg rounded-lg"
        >
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Messages</h1>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            <div className="space-y-2">
              {conversations.map(conv => (
                <motion.div
                  key={conv.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      {conv.status === "online" && (
                        <div className="w-3 h-3 bg-green-500 rounded-full absolute bottom-0 right-0 border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">{conv.name}</h3>
                        <span className="text-sm text-gray-500">{conv.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white">{conv.unread}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Chat Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col"
        >
          {/* Chat Header */}
          <div className="p-4 border-b bg-white shadow-md flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h2 className="font-semibold">John Smith</h2>
              <p className="text-sm text-green-500">Online</p>
            </div>
          </div>

          {/* Messages Section */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex justify-start"
              >
                <div className="bg-white rounded-lg p-3 shadow-sm max-w-md">
                  <p>Thank you for the mentoring session!</p>
                  <span className="text-xs text-gray-500 mt-1">2:30 PM</span>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex justify-end"
              >
                <div className="bg-blue-600 text-white rounded-lg p-3 shadow-sm max-w-md">
                  <p>You're welcome! Let me know if you need any further guidance.</p>
                  <span className="text-xs text-blue-200 mt-1">2:31 PM</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t bg-white shadow-md">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AlumniMessages;
