import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Navbar from '../../components/shared/Navbar';
import UserList from '../../components/shared/UserList';
import ChatArea from '../../components/chat/ChatArea';
import SearchBar from '../../components/chat/SearchBar';
import { MessageSquare } from 'lucide-react';

// Initialize socket variable outside component
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
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const messagesEndRef = useRef(null);
  
  // Get current user from local storage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Initialize socket connection
  useEffect(() => {
    // Connect to socket server with reconnection options
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
    
    if (currentUser?.user_id) {
      socket.emit('joinRoom', { userId: currentUser.user_id });
      
      // Add connection event listeners
      socket.on('connect', () => {
        console.log('Socket connected successfully');
      });
  
      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
  
      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        // Attempt to reconnect if disconnected
        if (reason === 'io server disconnect') {
          socket.connect();
        }
      });
      
      socket.on('roomJoined', (data) => {
        console.log('Joined room successfully', data);
      });
      
      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    }
    
    // Clean up
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [currentUser?.user_id]);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Socket event listeners
    const handleReceiveMessage = (newMessage) => {
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
    };
    
    const handleUserTyping = (data) => {
      if (selectedChat && selectedChat.otherUser.user_id === data.sender) {
        setIsTyping(true);
      }
    };
    
    const handleUserStopTyping = (data) => {
      if (selectedChat && selectedChat.otherUser.user_id === data.sender) {
        setIsTyping(false);
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('userTyping', handleUserTyping);
    socket.on('userStopTyping', handleUserStopTyping);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('userTyping', handleUserTyping);
      socket.off('userStopTyping', handleUserStopTyping);
    };
  }, [selectedChat, currentUser.user_id]);

  // Fetch chats using useCallback to avoid recreation on each render
  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Alumni chats endpoint
      const response = await axios.get('/api/chat/alumni-chats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setChats(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching chats:', err);
      setLoading(false);
    }
  }, []);

  // Fetch available students using useCallback
  const fetchAvailableStudents = useCallback(async () => {
    try {
      console.log('📡 Fetching available students...');
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Check if response has data and is in the correct format
      if (response.data && Array.isArray(response.data)) {
        console.log('✅ Fetched students:', response.data);
        setAvailableStudents(response.data);
      } else {
        console.error('❌ Invalid response format for students');
        setAvailableStudents([]);
      }
    } catch (err) {
      console.error('❌ Error fetching students:', 
        err.response?.status === 404 ? 'Endpoint not found' : err.response?.data || err.message
      );
      setAvailableStudents([]);
    }
  }, []);

  // Fetch messages using useCallback
  const fetchMessages = useCallback(async (chat) => {
    if (!chat || !chat.otherUser) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('/api/chat/messages', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          sender: currentUser.user_id,
          receiver: chat.otherUser.user_id || chat.otherUser._id
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
  }, [currentUser.user_id]);

  // Initialize component
  useEffect(() => {
    if (currentUser?.user_id) {
      fetchChats();
      fetchAvailableStudents();
    }
  }, [currentUser, fetchChats, fetchAvailableStudents]);

  // Update selected chat when user is selected
  useEffect(() => {
    if (selectedUser) {
      console.log('Selected User:', selectedUser);
      const existingChat = chats.find(chat => 
        chat.otherUser._id === selectedUser._id || 
        chat.otherUser.user_id === selectedUser._id
      );

      if (existingChat) {
        setSelectedChat(existingChat);
        fetchMessages(existingChat);
      } else {
        const newChat = {
          otherUser: {
            user_id: selectedUser._id,
            _id: selectedUser._id,
            firstName: selectedUser.firstName,
            lastName: selectedUser.lastName,
            name: selectedUser.firstName && selectedUser.lastName 
              ? `${selectedUser.firstName} ${selectedUser.lastName}` 
              : selectedUser.name
          }
        };
        setSelectedChat(newChat);
        setMessages([]);
      }
    }
  }, [selectedUser, chats, fetchMessages]);

  // Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    console.log('User selected:', user);
  };
  
  // Handle sending messages
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !selectedChat) return;
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.post('/api/chat/send-message', {
        sender: currentUser.user_id,
        receiver: selectedChat.otherUser.user_id || selectedChat.otherUser._id,
        content: message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Clear message input
      setMessage('');
      
      // Also emit stop typing
      socket.emit('stopTyping', {
        sender: currentUser.user_id,
        receiver: selectedChat.otherUser.user_id || selectedChat.otherUser._id
      });
      
      // No need to reload messages manually - socket will handle this
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
      receiver: selectedChat.otherUser.user_id || selectedChat.otherUser._id
    });
    
    // Set timer to stop typing after 2 seconds of inactivity
    const timer = setTimeout(() => {
      socket.emit('stopTyping', {
        sender: currentUser.user_id,
        receiver: selectedChat.otherUser.user_id || selectedChat.otherUser._id
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

  // Filter available students 
  const filteredUsers = availableStudents.filter(student =>
    (student.firstName && student.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.lastName && student.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.name && student.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Display loading indicator if data is loading
  if (loading && !availableStudents.length) {
    return (
      <div className="flex min-h-screen">
        <div className="flex-none">
          <Navbar type="alumni" />
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading student connections...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-none">
        <Navbar type="alumni" />
      </div>
      <div className="flex-1 ml-64">
        <div className="h-screen flex">
          {/* User List Section */}
          <div className="w-1/3 bg-white border-r border-gray-200">
            <div className="p-4 border-b">
              <SearchBar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                userType="alumni"
              />
            </div>
            <div className="overflow-y-auto h-[calc(100vh-5rem)]">
              <UserList 
                users={filteredUsers}
                onUserSelect={handleUserSelect}
                selectedUser={selectedUser}
                userType="student"
              />
            </div>
          </div>

          {/* Chat Area Section */}
          <div className="w-2/3 flex flex-col">
            {selectedChat ? (
              <ChatArea
                currentUser={currentUser}
                selectedChat={selectedChat}
                messages={messages}
                message={message}
                setMessage={setMessage}
                handleSendMessage={handleSendMessage}
                handleTyping={handleTyping}
                isTyping={isTyping}
                formatTime={formatTime}
                messagesEndRef={messagesEndRef}
                loading={loading}
                userType="alumni"
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-500 p-6">
                  <MessageSquare size={48} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">Start a conversation</h3>
                  <p className="text-gray-500 max-w-md">
                    Select a student from the list to begin messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniMessages;