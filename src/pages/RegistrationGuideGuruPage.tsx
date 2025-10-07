import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MessageCircle, ArrowLeft, CheckCircle, Building, Shield, X, Send } from 'lucide-react';
import { callRegistrationGuideGuruBot } from '../lib/supabaseHelpers';

const RegistrationGuideGuruPage: React.FC = () => {
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
        { role: 'assistant', content: 'Hi! I\'m your Registration Guide Guru. I can help you with company name registration, entity selection (LLP, Partnership, Pvt Ltd, Proprietary), legal compliance, and document preparation. What aspect of company registration would you like to start with?' }
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
      const response = await callRegistrationGuideGuruBot(userMessage, sessionId || undefined, newMessages);
      
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

  const registrationServices = [
    {
      icon: FileText,
      title: 'Name Registration',
      description: 'Choose unique company names, check availability, and ensure regulatory compliance'
    },
    {
      icon: Building,
      title: 'Entity Selection',
      description: 'Guide on LLP, Partnership, Private Limited, Proprietary, and other entity types'
    },
    {
      icon: Shield,
      title: 'Legal Compliance',
      description: 'Complete registration process with MOA, AOA, DSC, DIN, and brand protection'
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-indigo-600 hover:text-indigo-700 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </button>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 mb-6">
                <FileText className="h-12 w-12 text-white" />
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Registration{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  Guide Guru
                </span>
              </h1>
              
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Complete guidance for company name registration and legal entity formation — from name selection to final certification.
              </p>
            </div>

            <div className="grid gap-6">
              {registrationServices.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-start">
                      <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 p-3 rounded-xl mr-4">
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

            <div className="bg-gradient-to-r from-indigo-100 to-cyan-100 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Complete Registration Support</h3>
              <ul className="space-y-2 text-gray-700">
                <li>📋 Document preparation (MOA, AOA) with official links</li>
                <li>🔐 Digital Signature Certificate (DSC) and DIN guidance</li>
                <li>🏢 Entity type selection based on your business model</li>
                <li>🛡️ Brand protection and intellectual property advice</li>
              </ul>
            </div>

            <button
              onClick={connectToChatBot}
              className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
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
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-cyan-600 opacity-20 rounded-full blur-3xl"></div>
                  <FileText className="h-48 w-48 text-indigo-600 relative z-10" />
                  <div className="absolute -top-8 -right-8 animate-pulse">
                    <Building className="h-16 w-16 text-cyan-500" />
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Registration Made Simple</h3>
                <p className="text-gray-600">
                  From company name to final certification — complete your business registration with expert guidance.
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
                  <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 p-2 rounded-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Registration Guide Guru</h3>
                    <p className="text-sm text-gray-500">Complete company registration guidance</p>
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
                          ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white'
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
                    placeholder="Ask about company registration..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white p-2 rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default RegistrationGuideGuruPage;