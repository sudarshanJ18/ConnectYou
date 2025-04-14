import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Search } from 'lucide-react';
import axios from 'axios';
import './MessagesPage.css';

const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);
  
  // Fetch chats on component mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token'); // Adjust based on your auth method
        const response = await axios.get('/api/chats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setChats(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching chats:', err);
        setError('Failed to load chats. Please try again.');
        setLoading(false);
      }
    };
    
    fetchChats();
  }, []);
  
  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    if (selectedChat) {
      scrollToBottom();
    }
  }, [selectedChat]);
  
  // Load messages when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      const fetchMessages = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`/api/messages/${selectedChat._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Update selected chat with messages
          setSelectedChat(prev => ({
            ...prev,
            messages: response.data
          }));
          
          // Mark messages as read
          if (selectedChat.unread > 0) {
            await axios.put(`/api/chats/${selectedChat._id}/read`, {}, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            // Update chats list to reflect read status
            setChats(prevChats => 
              prevChats.map(chat => 
                chat._id === selectedChat._id ? { ...chat, unread: 0 } : chat
              )
            );
          }
        } catch (err) {
          console.error('Error fetching messages:', err);
          setError('Failed to load messages. Please try again.');
        }
      };
      
      fetchMessages();
    }
  }, [selectedChat?._id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && selectedChat) {
      try {
        const token = localStorage.getItem('token');
        const messageData = {
          chatId: selectedChat._id,
          text: message.trim()
        };
        
        // Send message to server
        const response = await axios.post('/api/messages', messageData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Update UI with new message
        const newMessage = response.data;
        
        // Update selected chat with new message
        setSelectedChat(prev => ({
          ...prev,
          lastMessage: newMessage.text,
          lastMessageTime: newMessage.createdAt,
          messages: [...(prev.messages || []), newMessage]
        }));
        
        // Update chats list
        setChats(prevChats => 
          prevChats.map(chat => 
            chat._id === selectedChat._id 
              ? { 
                  ...chat, 
                  lastMessage: newMessage.text,
                  lastMessageTime: newMessage.createdAt
                } 
              : chat
          )
        );
        
        // Clear input field
        setMessage('');
        
        // Scroll to bottom to show new message
        setTimeout(scrollToBottom, 100);
        
      } catch (err) {
        console.error('Error sending message:', err);
        setError('Failed to send message. Please try again.');
      }
    }
  };

  // Format timestamp for display
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const messageDate = new Date(timestamp);
    const today = new Date();
    
    // Check if message is from today
    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Check if message is from yesterday
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise return date and time
    return `${messageDate.toLocaleDateString()} ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex">
      {/* Chat List */}
      <div className="w-1/3 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="overflow-y-auto h-full">
          {chats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No conversations yet</div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                  selectedChat?._id === chat._id ? 'bg-purple-50' : ''
                }`}
              >
                <div className="flex items-center">
                  <img
                    src={chat.recipient.profilePicture || '/default-avatar.png'}
                    alt={chat.recipient.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900">{chat.recipient.name}</h3>
                      <span className="text-sm text-gray-500">
                        {formatMessageTime(chat.lastMessageTime)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <span className="ml-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col bg-gray-50">
          <div className="p-4 bg-white border-b border-gray-200">
            <div className="flex items-center">
              <img
                src={selectedChat.recipient.profilePicture || '/default-avatar.png'}
                alt={selectedChat.recipient.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <h2 className="ml-3 font-semibold text-gray-900">{selectedChat.recipient.name}</h2>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded mb-4">
                {error}
              </div>
            )}
            
            {selectedChat.messages && selectedChat.messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-4">
                No messages yet. Start the conversation!
              </div>
            ) : (
              selectedChat.messages && selectedChat.messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${msg.sender === selectedChat.userId ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                      msg.sender === selectedChat.userId
                        ? 'bg-purple-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === selectedChat.userId ? 'text-purple-200' : 'text-gray-500'}`}>
                      {formatMessageTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 bg-white border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700 focus:outline-none"
                disabled={!message.trim()}
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Select a chat to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;