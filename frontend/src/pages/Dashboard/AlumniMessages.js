import React, { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import Navbar from '../../components/shared/Navbar';
import { Search, Send, MessageSquare } from 'lucide-react';
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
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-none w-64 fixed h-full">
        <Navbar type="alumni" />
      </div>
      
      <div className="flex-1 ml-64">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Messages</h1>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex h-[calc(100vh-12rem)]">
              {/* Sidebar - Chat List */}
              <div className="w-1/3 border-r border-gray-200">
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="overflow-y-auto h-[calc(100vh-16rem)]">
                  {loading && filteredChats.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-pulse flex justify-center py-8">
                        <div className="h-4 w-4 bg-blue-400 rounded-full mr-2"></div>
                        <div className="h-4 w-4 bg-blue-400 rounded-full mr-2 animate-pulse delay-150"></div>
                        <div className="h-4 w-4 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                      </div>
                      <p>Loading conversations...</p>
                    </div>
                  ) : filteredChats.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                      <p>No conversations found</p>
                    </div>
                  ) : (
                    filteredChats.map((chat) => (
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        key={chat._id}
                        className={`p-3 border-b cursor-pointer transition-colors ${
                          selectedChat?._id === chat._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedChat(chat)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {chat.otherUser.firstName[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium text-gray-900 truncate">
                                {`${chat.otherUser.firstName} ${chat.otherUser.lastName}`}
                              </h3>
                              {chat.lastMessage?.timestamp && (
                                <span className="text-xs text-gray-500">
                                  {formatTime(chat.lastMessage.timestamp)}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {chat.lastMessage?.content || "No messages yet"}
                            </p>
                          </div>
                          {chat.unreadCount > 0 && (
                            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex-shrink-0">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
              
              {/* Main Chat Area */}
              <div className="w-2/3 flex flex-col">
                {selectedChat ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b flex items-center justify-between bg-white">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {selectedChat.otherUser.firstName[0]}
                        </div>
                        <div>
                          <h2 className="font-medium text-gray-900">{`${selectedChat.otherUser.firstName} ${selectedChat.otherUser.lastName}`}</h2>
                          <p className="text-xs text-gray-500">
                            {selectedChat.otherUser.userType === 'student' ? 'Student' : 'Alumni'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50" style={{ backgroundImage: 'url("/assets/chat-bg-pattern.png")' }}>
                      {loading && messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                          <div className="animate-pulse flex flex-col items-center">
                            <div className="h-4 w-16 bg-gray-300 rounded mb-2"></div>
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-center text-gray-500">
                          <div>
                            <p className="text-lg font-medium">No messages yet</p>
                            <p className="text-sm">Start a conversation with {selectedChat.otherUser.firstName}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 py-2">
                          {messages.map((msg, index) => {
                            const isUser = msg.sender === currentUser.user_id;
                            const showAvatar = index === 0 || 
                              (messages[index - 1] && messages[index - 1].sender !== msg.sender);
                              
                            return (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={msg._id}
                                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                              >
                                {!isUser && showAvatar && (
                                  <div className="w-8 h-8 mr-2 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 self-end">
                                    {selectedChat.otherUser.firstName[0]}
                                  </div>
                                )}
                                
                                {!isUser && !showAvatar && <div className="w-8 mr-2"></div>}
                                
                                <div
                                  className={`max-w-[70%] p-3 rounded-lg ${
                                    isUser
                                      ? 'bg-blue-500 text-white rounded-br-none'
                                      : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                                  }`}
                                >
                                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                                  <p className="text-xs mt-1 opacity-70 text-right">
                                    {formatTime(msg.timestamp)}
                                  </p>
                                </div>
                                
                                {isUser && showAvatar && (
                                  <div className="w-8 h-8 ml-2 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 self-end">
                                    {currentUser.firstName ? currentUser.firstName[0] : 'A'}
                                  </div>
                                )}
                                
                                {isUser && !showAvatar && <div className="w-8 ml-2"></div>}
                              </motion.div>
                            );
                          })}
                          
                          {isTyping && (
                            <div className="flex justify-start">
                              <div className="w-8 mr-2"></div>
                              <div className="bg-white p-3 rounded-lg shadow-sm">
                                <div className="flex space-x-2">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div ref={messagesEndRef} />
                        </div>
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="p-3 bg-white border-t">
                      <form onSubmit={handleSendMessage} className="flex space-x-3">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => {
                            setMessage(e.target.value);
                            handleTyping();
                          }}
                          placeholder="Type your message..."
                          className="flex-1 py-2 px-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                          disabled={!message.trim()}
                        >
                          <Send size={18} />
                          <span>Send</span>
                        </motion.button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-gray-50">
                    <div className="text-center text-gray-500 p-6">
                      <MessageSquare size={48} className="mx-auto mb-4 text-gray-400" />
                      <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                      <p className="text-gray-500 max-w-md">
                        Choose a chat from the list to start messaging or search for a specific contact
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniMessages;