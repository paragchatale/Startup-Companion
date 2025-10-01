import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Palette, MessageCircle, ArrowLeft, Megaphone, Users, Zap, X, Send } from 'lucide-react';
import { callBrandingMarketingBot } from '../lib/supabaseHelpers';

const BrandingMarketingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showChatBot, setShowChatBot] = useState(false);
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const connectToChatBot = () => {
    setShowChatBot(true);
    if (messages.length === 0) {
      setMessages([
        { role: 'assistant', content: 'Hi! I\'m your Branding & Marketing Expert. I can help you with logo design, brand identity, social media strategy, and go-to-market plans. What aspect of branding would you like to explore?' }
      ]);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);

    try {
      const response = await callBrandingMarketingBot(userMessage, sessionId || undefined, newMessages);
      
      setMessages([...newMessages, { role: 'assistant', content: response.response }]);
      
      if (response.sessionId && !sessionId) {
        setSessionId(response.sessionId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const brandingServices = [
    {
      icon: Palette,
      title: 'Brand Identity',
      description: 'Logo design, color schemes, typography, and brand guidelines'
    },
    {
      icon: Megaphone,
      title: 'Marketing Strategy',
      description: 'Go-to-market plans, digital marketing, and content strategy'
    },
    {
      icon: Users,
      title: 'Audience Development',
      description: 'Customer personas, market research, and community building'
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-pink-600 hover:text-pink-700 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </button>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-pink-500 to-pink-600 mb-6">
                <Palette className="h-12 w-12 text-white" />
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Branding and{' '}
                <span className="bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                  Marketing
                </span>
              </h1>
              
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                From logo to launch — build a memorable brand and go-to-market strategy with expert help.
              </p>
            </div>

            <div className="grid gap-6">
              {brandingServices.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-start">
                      <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-3 rounded-xl mr-4">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                        <p className="text-gray-600">{service.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-gradient-to-r from-pink-100 to-orange-100 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Build Your Brand Presence</h3>
              <ul className="space-y-2 text-gray-700">
                <li>🎨 Professional brand identity and visual assets</li>
                <li>📱 Social media strategy and content planning</li>
                <li>🚀 Launch campaigns and PR strategies</li>
                <li>📊 Marketing analytics and optimization</li>
              </ul>
            </div>

            <button
              onClick={connectToChatBot}
              className="w-full bg-gradient-to-r from-pink-600 to-orange-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
            >
              <MessageCircle className="h-6 w-6 mr-3" />
              Connect to Chat Bot
            </button>
          </div>

          {/* Right Side - Illustration */}
          <div className="relative">
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-center h-96">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-orange-600 opacity-20 rounded-full blur-3xl"></div>
                  <Palette className="h-48 w-48 text-pink-600 relative z-10" />
                  <div className="absolute -top-8 -left-8 animate-pulse">
                    <Zap className="h-16 w-16 text-orange-500" />
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Brand That Resonates</h3>
                <p className="text-gray-600">
                  Create a compelling brand identity and marketing strategy that connects with your audience.
                </p>
              </div>
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
                  <div className="bg-gradient-to-r from-pink-600 to-orange-600 p-2 rounded-lg">
                    <Palette className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Branding & Marketing</h3>
                    <p className="text-sm text-gray-500">Build your brand presence</p>
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
                          ? 'bg-gradient-to-r from-pink-600 to-orange-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
                    placeholder="Ask about branding and marketing..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-gradient-to-r from-pink-600 to-orange-600 text-white p-2 rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
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

export default BrandingMarketingPage;