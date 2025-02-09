import React, { useState } from 'react';
import {  Send, Sparkles, MessageSquare, Clock, Bookmark, ThumbsUp, ThumbsDown } from 'lucide-react';

const AIAssistantPage = () => {
  const [message, setMessage] = useState('');
  const [conversations] = useState([
    {
      id: 1,
      question: 'Can you help me understand React hooks?',
      answer: 'React hooks are functions that allow you to use state and other React features in functional components. The most commonly used hooks are useState for managing state and useEffect for handling side effects.',
      timestamp: '2 minutes ago',
      helpful: true
    },
    {
      id: 2,
      question: 'What are the best practices for API error handling?',
      answer: 'Some key best practices for API error handling include: using try-catch blocks, implementing proper status codes, creating consistent error response formats, and providing meaningful error messages to users.',
      timestamp: '1 hour ago',
      helpful: null
    }
  ]);

  const suggestedQuestions = [
    'How do I implement authentication in my React app?',
    'What are the best practices for state management?',
    'Can you explain Docker containerization?',
    'How do I optimize my website performance?'
  ];

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="font-medium">AI Learning Assistant</h2>
              <p className="text-sm text-gray-500">Ask me anything about programming and technology</p>
            </div>
          </div>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50">
          {/* Welcome Message */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">👋 Welcome to your AI Learning Assistant!</h3>
            <p className="text-gray-600 mb-4">
              I'm here to help you with programming concepts, debugging, best practices, and more.
              Feel free to ask any questions!
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Try asking about:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="bg-purple-50 text-purple-600 px-4 py-2 rounded-full text-sm hover:bg-purple-100 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Conversation History */}
          {conversations.map((conv) => (
            <div key={conv.id} className="space-y-4">
              {/* User Question */}
              <div className="flex justify-end">
                <div className="bg-purple-600 text-white rounded-lg p-4 max-w-[80%]">
                  <p>{conv.question}</p>
                </div>
              </div>

              {/* AI Response */}
              <div className="flex justify-start">
                <div className="bg-white rounded-lg p-4 max-w-[80%] shadow-sm">
                  <p className="text-gray-800 mb-3">{conv.answer}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{conv.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className={`p-1 rounded hover:bg-gray-100 ${
                        conv.helpful === true ? 'text-green-600' : ''
                      }`}>
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button className={`p-1 rounded hover:bg-gray-100 ${
                        conv.helpful === false ? 'text-red-600' : ''
                      }`}>
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-100">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t p-4">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
            <button className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 border-l bg-white p-4">
        <h3 className="font-medium mb-4">Conversation History</h3>
        <div className="space-y-2">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2 text-sm">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                <span className="truncate">{conv.question}</span>
              </div>
              <span className="text-xs text-gray-500 ml-6">{conv.timestamp}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;