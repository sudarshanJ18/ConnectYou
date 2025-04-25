import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from "framer-motion";
import { Search, Send, MessageSquare } from 'lucide-react';
import axios from 'axios';
import io from 'socket.io-client';
import Navbar from '../../components/shared/Navbar';
import UserList from '../../components/shared/UserList';
import ChatArea from '../../components/chat/ChatArea';
import SearchBar from '../../components/chat/SearchBar';

// Initialize socket connection
let socket;

const MessagesPage = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimer, setTypingTimer] = useState(null);
  const [availableAlumni, setAvailableAlumni] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const messagesEndRef = useRef(null);

  // Get current user from local storage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch chats
  const fetchChats = useCallback(async () => {
    if (!currentUser?.user_id) {
      console.log('⚠️ No user ID available');
      return;
    }

    try {
      console.log('📡 Fetching chats for user:', currentUser.user_id);
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/chat/chats/${currentUser.user_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Fetched chats:', response.data.data);
      setChats(response.data.data);
      setIsLoading(false);
    } catch (err) {
      console.error('❌ Error fetching chats:', err.response?.data || err.message);
      setChats([]);
      setIsLoading(false);
    }
  }, [currentUser?.user_id]);

  // Fetch available alumni
  const fetchAvailableAlumni = useCallback(async () => {
    if (!currentUser?.user_id) {
      console.log('⚠️ No user ID available');
      return;
    }

    try {
      console.log('📡 Fetching available alumni...');
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('❌ No authentication token found');
        return;
      }

      // Supporting both API endpoints from the two versions
      const endpoint = '/api/users/alumni';
      const fallbackEndpoint = '/api/users/by-role/alumni';
      
      try {
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data) {
          console.log('✅ Fetched alumni:', response.data);
          setAvailableAlumni(response.data);
        }
      } catch (primaryError) {
        console.log('⚠️ Primary endpoint failed, trying fallback:', fallbackEndpoint);
        const response = await axios.get(fallbackEndpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data) {
          console.log('✅ Fetched alumni from fallback:', response.data);
          setAvailableAlumni(response.data);
        } else {
          console.error('❌ Invalid response format for alumni');
          setAvailableAlumni([]);
        }
      }
    } catch (err) {
      console.error('❌ Error fetching alumni:', 
        err.response?.status === 404 ? 'Endpoint not found' : err.response?.data || err.message
      );
      setAvailableAlumni([]);
    }
  }, [currentUser?.user_id]);

  // Initialize component
  useEffect(() => {
    fetchChats();
    fetchAvailableAlumni();
  }, [fetchChats, fetchAvailableAlumni]);

  // Socket connection setup
  useEffect(() => {
    // Update the socket connection URL to use environment variable consistently
    const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket'],
      auth: {
        token: localStorage.getItem('token')
      }
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err.message);
    });

    if (currentUser?.user_id) {
      console.log('Emitting joinRoom for user:', currentUser.user_id);
      socket.emit('joinRoom', { userId: currentUser.user_id });

      socket.on('roomJoined', (data) => {
        console.log('✅ Joined room successfully:', data);
      });

      socket.on('error', (error) => {
        console.error('❌ Socket error:', error);
      });
    }

    socket.on('receiveMessage', (newMessage) => {
      console.log('📩 Received new message:', newMessage);
      if (selectedChat && (
        (selectedChat.otherUser.user_id === newMessage.sender) ||
        (selectedChat.chatId === newMessage.chatId)
      )) {
        console.log('🔁 Updating messages for selected chat');
        setMessages(prevMessages => [...prevMessages, newMessage]);
        socket.emit('markAsRead', {
          messageIds: [newMessage._id],
          userId: currentUser.user_id
        });
      }
      fetchChats();
    });

    socket.on('userTyping', (data) => {
      console.log('✍️ User typing:', data);
      if (selectedChat && selectedChat.otherUser.user_id === data.sender) {
        setIsTyping(true);
      }
    });

    socket.on('userStopTyping', (data) => {
      console.log('✋ User stopped typing:', data);
      if (selectedChat && selectedChat.otherUser.user_id === data.sender) {
        setIsTyping(false);
      }
    });

    return () => {
      console.log('🔌 Disconnecting socket...');
      socket.disconnect();
    };
  }, [currentUser, selectedChat, fetchChats]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update selected chat when user is selected
  useEffect(() => {
    if (selectedUser) {
      console.log('🎯 Selected User:', selectedUser);
      setSelectedChat({
        otherUser: {
          user_id: selectedUser._id,
          _id: selectedUser._id,
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          name: selectedUser.firstName && selectedUser.lastName 
            ? `${selectedUser.firstName} ${selectedUser.lastName}` 
            : selectedUser.name
        }
      });
    }
  }, [selectedUser]);

  // Fetch messages when selected chat changes
  useEffect(() => {
    if (selectedChat) {
      console.log('💬 Chat selected:', selectedChat);
      fetchMessages(selectedChat);
    }
  }, [selectedChat]);

  const fetchMessages = async (chat) => {
    try {
      console.log('📨 Fetching messages for chat with:', chat.otherUser.user_id);
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/chat/messages', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          sender: currentUser.user_id,
          receiver: chat.otherUser.user_id || chat.otherUser._id
        }
      });
      console.log('✅ Messages received:', response.data.data);
      setMessages(response.data.data);
      setIsLoading(false);
      scrollToBottom();
    } catch (err) {
      console.error('❌ Error fetching messages:', err.response?.data || err.message);
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) {
      console.log('⚠️ Empty message or no selected chat');
      return;
    }

    try {
      console.log('📤 Sending message:', message);
      const token = localStorage.getItem('token');
      await axios.post('/api/chat/send-message', {
        sender: currentUser.user_id,
        receiver: selectedChat.otherUser.user_id || selectedChat.otherUser._id,
        content: message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('');
      console.log('✅ Message sent!');
      socket.emit('stopTyping', {
        sender: currentUser.user_id,
        receiver: selectedChat.otherUser.user_id || selectedChat.otherUser._id
      });
      
      // Reload messages to show the sent message
      fetchMessages(selectedChat);
    } catch (err) {
      console.error('❌ Error sending message:', err);
    }
  };

  const handleTyping = () => {
    if (!selectedChat) return;
    if (typingTimer) clearTimeout(typingTimer);

    console.log('✍️ Emitting typing event...');
    socket.emit('typing', {
      sender: currentUser.user_id,
      receiver: selectedChat.otherUser.user_id || selectedChat.otherUser._id
    });

    const timer = setTimeout(() => {
      console.log('🛑 Emitting stopTyping event...');
      socket.emit('stopTyping', {
        sender: currentUser.user_id,
        receiver: selectedChat.otherUser.user_id || selectedChat.otherUser._id
      });
    }, 2000);

    setTypingTimer(timer);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredUsers = availableAlumni.filter(alumni =>
    (alumni.firstName && alumni.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (alumni.lastName && alumni.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (alumni.name && alumni.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (alumni.email && alumni.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Display loading indicator if data is loading
  if (isLoading && !availableAlumni.length) {
    return (
      <div className="flex min-h-screen">
        <div className="flex-none">
          <Navbar type="student" />
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading alumni connections...</p>
          </div>
        </div>
      </div>
    );
  }

  // Determine if we're using components from the first file or inline rendering like the second file
  const usingChatAreaComponent = typeof ChatArea !== 'undefined';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-none">
        <Navbar type="student" />
      </div>
      <div className="flex flex-1 ml-64">
        {/* Left sidebar with User List */}
        <div className="flex">
          <UserList 
            users={filteredUsers}
            onUserSelect={setSelectedUser}
            selectedUser={selectedUser}
            userType="student"
          />
          
          {/* Chat Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search Bar */}
            <div className="p-4 border-b bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search alumni..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Chat content */}
            {usingChatAreaComponent ? (
              <ChatArea
                currentUser={currentUser}
                selectedChat={selectedChat}
                messages={messages}
                message={message}
                setMessage={setMessage}
                handleSendMessage={handleSendMessage}
                handleTyping={handleTyping}
                isTyping={isTyping}
                userType="student"
              />
            ) : (
              /* Inline chat rendering from second file if ChatArea component is unavailable */
              selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 bg-white border-b flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedChat.otherUser.firstName?.[0] || selectedChat.otherUser.name?.[0] || 'A'}
                    </div>
                    <div>
                      <h2 className="font-semibold">
                        {selectedChat.otherUser.firstName && selectedChat.otherUser.lastName 
                          ? `${selectedChat.otherUser.firstName} ${selectedChat.otherUser.lastName}`
                          : selectedChat.otherUser.name || 'User'}
                      </h2>
                      <p className="text-sm text-gray-500">{selectedChat.otherUser.userType || 'Alumni'}</p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={msg._id}
                          className={`flex ${msg.sender === currentUser.user_id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              msg.sender === currentUser.user_id
                                ? 'bg-green-500 text-white rounded-br-none'
                                : 'bg-white text-gray-800 rounded-bl-none'
                            }`}
                          >
                            <p>{msg.content}</p>
                            <p className="text-xs mt-1 opacity-70">
                              {formatTime(msg.timestamp)}
                            </p>
                          </div>
                        </motion.div>
                      ))}
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
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-green-500"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600 transition-colors"
                        disabled={!message.trim()}
                      >
                        <Send size={20} />
                        <span>Send</span>
                      </motion.button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MessageSquare size={48} className="mx-auto mb-4" />
                    <h3 className="text-xl font-semibold">Select a conversation</h3>
                    <p>Choose an alumni from the list to start messaging</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;