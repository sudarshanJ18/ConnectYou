import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageSquare } from 'lucide-react';

const ChatArea = ({ 
  currentUser, 
  selectedChat, 
  messages, 
  message, 
  setMessage, 
  handleSendMessage, 
  handleTyping, 
  isTyping, 
  userType 
}) => {
  const messagesEndRef = useRef(null);
  
  // Determine theme colors based on user type
  const primaryColor = userType === 'student' ? 'bg-green-500' : 'bg-blue-500';
  
  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500 p-6">
          <MessageSquare size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
          <p className="text-gray-500 max-w-md">
            Choose a {userType === 'student' ? 'alumni' : 'student'} from the list to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="p-4 bg-white border-b flex items-center space-x-3">
        <div className={`w-10 h-10 ${primaryColor} rounded-full flex items-center justify-center text-white font-semibold`}>
          {selectedChat.otherUser.firstName?.[0] || selectedChat.otherUser.name?.[0] || 'U'}
        </div>
        <div>
          <h2 className="font-semibold">
            {selectedChat.otherUser.firstName && selectedChat.otherUser.lastName
              ? `${selectedChat.otherUser.firstName} ${selectedChat.otherUser.lastName}`
              : selectedChat.otherUser.name || 'User'}
          </h2>
          <p className="text-sm text-gray-500">
            {selectedChat.otherUser.userType || (userType === 'student' ? 'Alumni' : 'Student')}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg._id}
                className={`flex ${msg.sender === currentUser.user_id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    msg.sender === currentUser.user_id
                      ? `${primaryColor} text-white rounded-br-none`
                      : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="break-words">{msg.content}</p>
                  <p className="text-xs mt-1 opacity-70 text-right">
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))
          )}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-200 p-3 rounded-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSendMessage} className="flex space-x-4">
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type your message..."
            className={`flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-${userType === 'student' ? 'green' : 'blue'}-500`}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className={`${primaryColor} text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:${userType === 'student' ? 'bg-green-600' : 'bg-blue-600'} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={!message.trim()}
          >
            <Send size={20} />
            <span>Send</span>
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;