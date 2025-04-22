import React, { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { Search, Send, MessageSquare } from 'lucide-react';
import axios from 'axios';
import io from 'socket.io-client';
import Navbar from '../../components/shared/Navbar';

let socket;

const MessagesPage = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimer, setTypingTimer] = useState(null);
  const messagesEndRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    console.log('Connecting socket to:', SOCKET_URL);

    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 3
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
  }, [currentUser, selectedChat]);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      console.log('📡 Fetching chats for user:', currentUser.user_id);
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/chat/chats/${currentUser.user_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Fetched chats:', response.data.data);
      setChats(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('❌ Error fetching chats:', err.response?.data || err.message);
      setLoading(false);
    }
  };

  const fetchMessages = async (chat) => {
    try {
      console.log('📨 Fetching messages for chat with:', chat.otherUser.user_id);
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/chat/messages', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          sender: currentUser.user_id,
          receiver: chat.otherUser.user_id
        }
      });
      console.log('✅ Messages received:', response.data.data);
      setMessages(response.data.data);
      setLoading(false);
      scrollToBottom();
    } catch (err) {
      console.error('❌ Error fetching messages:', err.response?.data || err.message);
      setLoading(false);
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
        receiver: selectedChat.otherUser.user_id,
        content: message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('');
      console.log('✅ Message sent!');
      socket.emit('stopTyping', {
        sender: currentUser.user_id,
        receiver: selectedChat.otherUser.user_id
      });
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
      receiver: selectedChat.otherUser.user_id
    });

    const timer = setTimeout(() => {
      console.log('🛑 Emitting stopTyping event...');
      socket.emit('stopTyping', {
        sender: currentUser.user_id,
        receiver: selectedChat.otherUser.user_id
      });
    }, 2000);

    setTypingTimer(timer);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedChat) {
      console.log('💬 Chat selected:', selectedChat);
      fetchMessages(selectedChat);
    }
  }, [selectedChat]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredChats = chats.filter(chat =>
    chat.otherUser.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.otherUser.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Fixed Sidebar Navigation */}
      <div className="flex-none">
        <Navbar type="student" />
      </div>

      {/* Main Content Area - Shifted right to accommodate sidebar */}
      <div className="flex-1 ml-64">
        <div className="flex h-full">
          {/* Chat List Sidebar */}
          <div className="w-1/4 bg-white border-r border-gray-200">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search alumni..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-64px)]">
              {filteredChats.map((chat) => (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={chat._id}
                  className={`p-4 border-b cursor-pointer transition-colors ${
                    selectedChat?._id === chat._id ? 'bg-green-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {chat.otherUser.firstName[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{`${chat.otherUser.firstName} ${chat.otherUser.lastName}`}</h3>
                      <p className="text-sm text-gray-500 truncate">
                        {chat.lastMessage.content}
                      </p>
                    </div>
                    {chat.unreadCount > 0 && (
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-gray-50">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 bg-white border-b flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {selectedChat.otherUser.firstName[0]}
                  </div>
                  <div>
                    <h2 className="font-semibold">{`${selectedChat.otherUser.firstName} ${selectedChat.otherUser.lastName}`}</h2>
                    <p className="text-sm text-gray-500">{selectedChat.otherUser.userType}</p>
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
                            {new Date(msg.timestamp).toLocaleTimeString()}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;