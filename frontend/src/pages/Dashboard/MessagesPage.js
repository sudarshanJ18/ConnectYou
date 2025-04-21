import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Search } from 'lucide-react';
import axios from 'axios';
import io from 'socket.io-client';

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
    <div className="h-[calc(100vh-120px)] flex">
      {/* Chat List */}
      {/* ... your existing chat list code ... */}

      {/* Chat Window */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col bg-gray-50">
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
              <div className="text-center text-gray-400">Loading messages...</div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`max-w-xs p-3 rounded-lg ${
                    msg.sender === currentUser.user_id
                      ? 'bg-purple-600 text-white self-end'
                      : 'bg-white text-gray-900 self-start border'
                  }`}
                >
                  <div>{msg.content}</div>
                  <div className="text-xs text-gray-300 mt-1 text-right">
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              ))
            )}
            {isTyping && (
              <div className="text-sm text-gray-400 italic">Typing...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSendMessage}
            className="flex items-center p-4 border-t bg-white"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleTyping}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-lg mr-2"
            />
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a chat to start messaging
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
