import React, { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import AlumniNavbar from "./AlumniNavbar";
import { Search, Send } from 'lucide-react';
import axios from 'axios';
import io from 'socket.io-client';

// Initialize socket connection
let socket;

const AlumniMessages = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimer, setTypingTimer] = useState(null);
  const messagesEndRef = useRef(null);
  
  // Get current user from local storage (adjust according to your auth implementation)
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Initialize socket connection
  useEffect(() => {
    // Connect to socket server
    const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    socket = io(SOCKET_URL);
    
    if (currentUser?.user_id) {
      socket.emit('joinRoom', { userId: currentUser.user_id });
      
      socket.on('roomJoined', (data) => {
        console.log('Joined room successfully', data);
      });
      
      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    }
    
    // Socket event listeners
    socket.on('receiveMessage', (newMessage) => {
      // Add message to the state if it belongs to the active chat
      if (selectedChat && (
        (selectedChat.otherUser.user_id === newMessage.sender) || 
        (selectedChat.chatId === newMessage.chatId)
      )) {
        setMessages(prevMessages => [...prevMessages, newMessage]);
        
        // Mark message as read
        socket.emit('markAsRead', { 
          messageIds: [newMessage._id],
          userId: currentUser.user_id
        });
      }
      
      // Update chat list to reflect new message
      fetchChats();
    });
    
    socket.on('userTyping', (data) => {
      if (selectedChat && selectedChat.otherUser.user_id === data.sender) {
        setIsTyping(true);
      }
    });
    
    socket.on('userStopTyping', (data) => {
      if (selectedChat && selectedChat.otherUser.user_id === data.sender) {
        setIsTyping(false);
      }
    });
    
    // Clean up
    return () => {
      socket.disconnect();
    };
  }, [currentUser, selectedChat]);

  // Fetch chats on mount
  const fetchChats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`/api/chat/chats/${currentUser.user_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setChats(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching chats:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.user_id) {
      fetchChats();
    }
  }, [currentUser]);

  // Fetch messages when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat);
    }
  }, [selectedChat]);

  const fetchMessages = async (chat) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('/api/chat/messages', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          sender: currentUser.user_id,
          receiver: chat.otherUser.user_id
        }
      });
      
      setMessages(response.data.data);
      setLoading(false);
      
      // Scroll to bottom of messages
      scrollToBottom();
    } catch (err) {
      console.error('Error fetching messages:', err);
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !selectedChat) return;
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.post('/api/chat/send-message', {
        sender: currentUser.user_id,
        receiver: selectedChat.otherUser.user_id,
        content: message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Clear message input
      setMessage('');
      
      // Also emit stop typing
      socket.emit('stopTyping', {
        sender: currentUser.user_id,
        receiver: selectedChat.otherUser.user_id
      });
      
      // Update will happen via socket
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  // Handle typing indicator
  const handleTyping = () => {
    if (!selectedChat) return;
    
    // Clear previous timer
    if (typingTimer) {
      clearTimeout(typingTimer);
    }
    
    // Emit typing event
    socket.emit('typing', {
      sender: currentUser.user_id,
      receiver: selectedChat.otherUser.user_id
    });
    
    // Set timer to stop typing after 2 seconds of inactivity
    const timer = setTimeout(() => {
      socket.emit('stopTyping', {
        sender: currentUser.user_id,
        receiver: selectedChat.otherUser.user_id
      });
    }, 2000);
    
    setTypingTimer(timer);
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Filter chats based on search term
  const filteredChats = chats.filter(chat => 
    chat.otherUser.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.otherUser.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <AlumniNavbar />
      <div className="ml-64 p-6 bg-gray-100 min-h-screen w-full flex">
        {/* Chat List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-1/3 border-r bg-white shadow-lg rounded-lg"
        >
          <div className="p-4 border-b">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            <div className="overflow-y-auto h-[calc(100vh-180px)]">
              {loading && !chats.length ? (
                <div className="p-4 text-center text-gray-500">Loading chats...</div>
              ) : (
                <>
                  {filteredChats.map((chat) => (
                    <div
                      key={chat._id}
                      onClick={() => setSelectedChat(chat)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                        selectedChat?._id === chat._id ? 'bg-purple-50' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                          {chat.otherUser.avatar ? (
                            <img 
                              src={chat.otherUser.avatar} 
                              alt={`${chat.otherUser.firstName} ${chat.otherUser.lastName}`} 
                              className="w-12 h-12 rounded-full" 
                            />
                          ) : (
                            <span className="text-lg">
                              {chat.otherUser.firstName[0]}{chat.otherUser.lastName[0]}
                            </span>
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900">
                              {chat.otherUser.firstName} {chat.otherUser.lastName}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {formatTime(chat.lastMessage.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {chat.lastMessage.content}
                          </p>
                        </div>
                        {chat.unreadCount > 0 && (
                          <span className="ml-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {!loading && filteredChats.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                      {searchTerm ? "No matching conversations found" : "No conversations yet"}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Chat Window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col bg-gray-50 ml-4 rounded-lg shadow-lg overflow-hidden"
        >
          {selectedChat ? (
            <>
              <div className="p-4 bg-white border-b">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    {selectedChat.otherUser.avatar ? (
                      <img 
                        src={selectedChat.otherUser.avatar} 
                        alt={`${selectedChat.otherUser.firstName} ${selectedChat.otherUser.lastName}`} 
                        className="w-10 h-10 rounded-full" 
                      />
                    ) : (
                      <span>
                        {selectedChat.otherUser.firstName[0]}{selectedChat.otherUser.lastName[0]}
                      </span>
                    )}
                  </div>
                  <div className="ml-3">
                    <h2 className="font-semibold">
                      {selectedChat.otherUser.firstName} {selectedChat.otherUser.lastName}
                    </h2>
                    <div className="text-sm text-gray-500">
                      {selectedChat.otherUser.userType === 'student' ? 'Student' : 'Alumni'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <div className="text-center text-gray-500">Loading messages...</div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <div 
                        key={msg._id} 
                        className={`flex ${msg.sender === currentUser.user_id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`p-3 rounded-lg shadow max-w-sm ${
                          msg.sender === currentUser.user_id ? 'bg-purple-600 text-white' : 'bg-white'
                        }`}>
                          <p>{msg.content}</p>
                          <div className="text-xs opacity-70 block mt-1 flex justify-end">
                            {formatTime(msg.timestamp)}
                            {msg.sender === currentUser.user_id && (
                              <span className="ml-1">{msg.read ? '✓✓' : '✓'}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="p-3 rounded-lg shadow bg-white">
                          <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
              <div className="p-4 bg-white border-t">
                <form onSubmit={handleSendMessage} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 p-2 border rounded-lg"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleTyping}
                  />
                  <motion.button
                    type="submit"
                    disabled={!message.trim()}
                    whileHover={{ scale: message.trim() ? 1.1 : 1 }}
                    className="ml-2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:bg-purple-400 disabled:hover:bg-purple-400"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start messaging.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AlumniMessages;