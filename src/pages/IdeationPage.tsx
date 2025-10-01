import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowRight, Lightbulb, X, Send } from 'lucide-react';

const IdeationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const businessIdea = location.state?.idea || '';
  const [showChatBot, setShowChatBot] = React.useState(false);
  const [messages, setMessages] = React.useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [inputMessage, setInputMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [messageCount, setMessageCount] = React.useState(0);
  const [showSignupPrompt, setShowSignupPrompt] = React.useState(false);
  const [pendingMessage, setPendingMessage] = React.useState('');

  const connectToChatBot = () => {
    setShowChatBot(true);
    setMessageCount(0); // Reset message count when opening chat
    setShowSignupPrompt(false); // Reset signup prompt
    if (businessIdea && messages.length === 0) {
      setMessages([
        { role: 'assistant', content: `Hi! I see you want to work on: "${businessIdea}". Let's refine this idea together! What specific aspect would you like to improve?` }
      ]);
    } else if (messages.length === 0) {
      setMessages([
        { role: 'assistant', content: 'Hi! Tell me about your business idea and I\'ll help you refine it!' }
      ]);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Add user message to chat
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);

    // Increment message count and check if we should show signup prompt
    const newCount = messageCount + 1;
    setMessageCount(newCount);

    // Show signup prompt after 3 user messages
    if (newCount >= 3) {
      setPendingMessage(userMessage);
      setShowSignupPrompt(true);
      setIsLoading(false);
      return;
    }

    await processMessage(userMessage, newMessages);
  };

  const processMessage = async (userMessage: string, currentMessages: Array<{role: 'user' | 'assistant', content: string}>) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/idea-refiner`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Add AI response to chat
      setMessages([...currentMessages, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...currentMessages, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaybeLater = async () => {
    setShowSignupPrompt(false);
    setMessageCount(0); // Reset counter to allow 3 more messages
    
    // Process the pending message that triggered the signup prompt
    if (pendingMessage) {
      // Don't add the user message again since it's already in the messages array
      await processMessage(pendingMessage, messages);
      setPendingMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Illustration */}
          <div className="relative">
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-center h-96">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 rounded-full blur-3xl"></div>
                  <MessageCircle className="h-48 w-48 text-blue-600 relative z-10" />
                  <div className="absolute top-8 right-8 animate-bounce">
                    <Lightbulb className="h-16 w-16 text-yellow-500" />
                  </div>
                </div>
              </div>
              
              {/* Chat bubbles animation */}
              <div className="space-y-4 mt-8">
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-6 py-3 max-w-xs">
                    <p className="text-sm text-gray-700">Hi! Tell me about your business idea.</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl px-6 py-3 max-w-xs">
                    <p className="text-sm">{businessIdea || "I want to start an eco-friendly food delivery service"}</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-6 py-3 max-w-xs">
                    <p className="text-sm text-gray-700">Great! Let's explore the legal requirements first...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Let's Explore Your{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Idea
                </span>
              </h1>
              
              {businessIdea && (
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-8 border-l-4 border-blue-600">
                  <h3 className="font-semibold text-gray-900 mb-2">Your Business Idea:</h3>
                  <p className="text-gray-700 italic">"{businessIdea}"</p>
                </div>
              )}

              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Ready to turn your vision into reality? Our AI assistant will guide you through 
                every step of your entrepreneurial journey, from legal setup to go-to-market strategy.
              </p>

              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">What happens next?</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    Personalized consultation based on your idea
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    Legal requirements and compliance guidance
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    Funding opportunities and financial planning
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    Branding and marketing strategy
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={connectToChatBot}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
              >
                <MessageCircle className="h-6 w-6 mr-3" />
                Connect to Chat Bot
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="w-full border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>

        {/* ChatBot Popup */}
        {showChatBot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[600px] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Idea Refiner</h3>
                    <p className="text-sm text-gray-500">Let's improve your business idea</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChatBot(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Signup Prompt Modal */}
        {showSignupPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready for More?
                </h3>
                <p className="text-gray-600 mb-6">
                  Sign up to continue refining your idea and access our full suite of startup tools including legal advice, funding opportunities, and more!
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/signup')}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    Sign Up Now
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
                  >
                    Already have an account? Login
                  </button>
                  <button
                    onClick={() => {
                      handleMaybeLater();
                    }}
                    className="w-full text-gray-500 hover:text-gray-700 transition-colors text-sm"
                  >
                    Maybe later
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeationPage;