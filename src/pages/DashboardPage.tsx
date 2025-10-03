import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { callMainDashboardBot, getUserDetails, uploadProfilePicture, generateStartupKit } from '../lib/supabaseHelpers';
import { Scale, Building2, DollarSign, Palette, ChevronRight, Send, Mic, FileText, Bot, Settings, Star, X, MicOff, Save, Package, CreditCard as Edit3, AlertCircle } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string, botType?: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [showFlashMessage, setShowFlashMessage] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string>('');
  const [isUploadingPic, setIsUploadingPic] = useState(false);
  const [isSavingResponse, setIsSavingResponse] = useState(false);
  const [isGeneratingKit, setIsGeneratingKit] = useState(false);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setChatInput(transcript);
        setIsListening(false);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  // Load user details on mount
  useEffect(() => {
    if (user) {
      loadUserDetails();
    }
  }, [user]);

  const loadUserDetails = async () => {
    if (!user) return;
    
    try {
      const details = await getUserDetails(user.id);
      setUserDetails(details);
      
      // Set profile picture URL
      if (details?.profile_picture_url) {
        setProfilePicUrl(details.profile_picture_url);
      } else {
        setProfilePicUrl("https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face");
      }
    } catch (error) {
      console.error('Error loading user details:', error);
    }
  };

  const services = [
    {
      id: 'legal-advisor',
      title: 'Legal Advisor',
      description: 'Get legal advice',
      tooltip: 'Navigate company registration, trademarks, and compliance with AI-guided legal help.',
      icon: Scale,
      color: 'text-blue-400',
      path: '/legal-advisor'
    },
    {
      id: 'govt-scheme',
      title: 'Govt Scheme Matching',
      description: 'Find government schemes',
      tooltip: 'Discover startup grants, incubators, and government schemes tailored to your industry.',
      icon: Building2,
      color: 'text-purple-400',
      path: '/scheme-match-maker'
    },
    {
      id: 'financial-setup',
      title: 'Financial Setup',
      description: 'Setup your finances',
      tooltip: 'From business accounts to invoicing — get your startup\'s money game sorted.',
      icon: DollarSign,
      color: 'text-green-400',
      path: '/financial-setup'
    },
    {
      id: 'branding-marketing',
      title: 'Branding & Marketing',
      description: 'Build your brand',
      tooltip: 'Build a memorable brand and go-to-market strategy with expert help.',
      icon: Palette,
      color: 'text-pink-400',
      path: '/branding-marketing'
    }
  ];

  const handleServiceClick = (path: string) => {
    navigate(path);
  };

  const checkProfileCompleteness = () => {
    if (!userDetails) return false;
    
    const criticalFields = ['business_name', 'industry', 'location', 'business_stage'];
    const missingFields = criticalFields.filter(field => !userDetails[field]);
    
    return missingFields.length === 0;
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim() && !isLoading) {
      const userMessage = chatInput.trim();
      setChatInput('');
      setIsLoading(true);

      // Add user message to chat
      const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
      setMessages(newMessages);

      try {
        const response = await callMainDashboardBot(userMessage, sessionId || undefined, newMessages, userDetails);
        
        // Check if response indicates missing user details
        if (response.missingDetails) {
          setShowFlashMessage(true);
          // Hide flash message after 10 seconds
          setTimeout(() => setShowFlashMessage(false), 10000);
        }
        
        // Add AI response to chat
        setMessages([...newMessages, { 
          role: 'assistant', 
          content: response.response,
          botType: response.botType || 'main_dashboard'
        }]);
        
        // Update session ID if it's a new session
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
    }
  };

  const handleUpdateProfile = () => {
    navigate('/user-details');
  };

  const handleMyBizDoc = () => {
    navigate('/my-biz-docs');
  };

  const handleAIResponseDoc = () => {
    navigate('/ai-response-docs');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSubmit(e);
    }
  };

  const toggleVoiceInput = () => {
    if (!recognition) {
      console.warn('Speech recognition not supported');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleProfilePicChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploadingPic(true);
    try {
      const newProfilePicUrl = await uploadProfilePicture(user.id, file);
      if (newProfilePicUrl) {
        setProfilePicUrl(newProfilePicUrl);
        // Reload user details to get updated profile
        await loadUserDetails();
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture. Please try again.');
    } finally {
      setIsUploadingPic(false);
    }
  };

  const handleSaveResponse = async () => {
    if (messages.length === 0) {
      alert('No conversation to save');
      return;
    }

    setIsSavingResponse(true);
    try {
      // Create conversation text
      const conversationText = messages.map(m => 
        `${m.role === 'user' ? 'You' : 'AI Assistant'}: ${m.content}`
      ).join('\n\n');

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-pdf-response`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationText,
          title: 'Dashboard Conversation',
          sessionId
        }),
      });

      if (response.ok) {
        alert('Conversation saved as PDF successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save conversation');
      }
    } catch (error) {
      console.error('Error saving response:', error);
      alert('Failed to save conversation. Please try again.');
    } finally {
      setIsSavingResponse(false);
    }
  };

  const handleGenerateStartupKit = async () => {
    if (!user) {
      alert('Please log in to generate startup kit');
      return;
    }

    // Check if profile is complete
    if (!checkProfileCompleteness()) {
      setShowFlashMessage(true);
      setTimeout(() => setShowFlashMessage(false), 10000);
      
      // Add message to chat about incomplete profile
      const incompleteMessage = {
        role: 'assistant' as const,
        content: `To generate your comprehensive Startup Kit, I need some additional information about your business. Please update your profile with:

• Business name
• Industry/sector
• Location
• Business stage

Click "Update User Details" to complete your profile, then I'll create a personalized startup kit with legal guidance, financial recommendations, government schemes, and branding strategies tailored specifically for your business.`,
        botType: 'profile_check'
      };
      
      setMessages(prev => [...prev, incompleteMessage]);
      return;
    }

    setIsGeneratingKit(true);
    try {
      const kitResponse = await generateStartupKit(user.id, userDetails);
      
      if (kitResponse.success) {
        // Add a message to chat about the kit generation
        const kitMessage = {
          role: 'assistant' as const,
          content: `🎉 Your comprehensive Startup Kit has been generated and saved! 

The kit includes:
• Legal guidance and compliance requirements
• Financial setup recommendations  
• Government schemes and funding opportunities
• Branding and marketing strategies
• Personalized business roadmap

You can find your "${userDetails.business_name || 'Your Business'} Startup Kit" in the AI Response Documents section.`,
          botType: 'startup_kit'
        };
        
        setMessages(prev => [...prev, kitMessage]);
        alert('Startup Kit generated successfully! Check your AI Response Documents.');
      } else {
        throw new Error('Failed to generate startup kit');
      }
    } catch (error) {
      console.error('Error generating startup kit:', error);
      alert('Failed to generate startup kit. Please try again.');
    } finally {
      setIsGeneratingKit(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className="text-gray-300 hover:text-white transition-colors">
              <Settings className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Flash Message */}
        {showFlashMessage && (
          <div className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 overflow-hidden">
            <div className="animate-scroll whitespace-nowrap">
              <span className="inline-flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Keep your profile updated to get tailored responses for all your business queries.
                <span className="mx-8">•</span>
                Keep your profile updated to get tailored responses for all your business queries.
                <span className="mx-8">•</span>
                Keep your profile updated to get tailored responses for all your business queries.
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-slate-800 min-h-screen p-6 border-r border-slate-700">
          {/* Profile Section */}
          <div className="text-center mb-8">
            <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center group">
              <img 
                src={profilePicUrl} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
              {/* Edit Icon Overlay */}
              <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="hidden"
                  disabled={isUploadingPic}
                />
                <Edit3 className="h-6 w-6 text-white" />
              </label>
              {isUploadingPic && (
                <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold mb-1">
              {userDetails?.full_name || user?.user_metadata?.full_name || 'Startup Founder'}
            </h2>
            <p className="text-gray-400 mb-6">
              {userDetails?.business_name ? `Founder, ${userDetails.business_name}` : 'Founder'}
            </p>
            <button
              onClick={handleUpdateProfile}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full mb-3"
            >
              Update User Details
            </button>
            
            {/* Document Buttons */}
            <button 
              onClick={handleMyBizDoc}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full flex items-center justify-center space-x-2 mb-3">
              <FileText className="h-5 w-5" />
              <span>My Biz Doc</span>
            </button>
            
            <button 
              onClick={handleAIResponseDoc}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full flex items-center justify-center space-x-2">
              <Bot className="h-5 w-5" />
              <span>AI Response Doc</span>
            </button>
          </div>

          {/* Services Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <div className="space-y-3">
              {services.map((service) => {
                const IconComponent = service.icon;
                return (
                  <button
                    key={service.id}
                    onClick={() => handleServiceClick(service.path)}
                    className="relative w-full bg-slate-700 hover:bg-slate-600 rounded-lg p-4 flex items-center justify-between transition-colors group"
                    title={service.tooltip}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`h-5 w-5 ${service.color}`} />
                      <div className="text-left">
                        <div className="font-medium">{service.title}</div>
                        <div className="text-sm text-gray-400">{service.description}</div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                    
                    {/* Tooltip */}
                    <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                      {service.tooltip}
                      <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Chat Section */}
          <div className="bg-slate-800 rounded-2xl p-12 mb-6">
            {messages.length === 0 ? (
              <h2 className="text-xl font-medium text-center mb-6 text-gray-300">
                How can I help you today, {userDetails?.full_name?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0] || 'Founder'}?
              </h2>
            ) : (
              <div className="mb-6 max-h-96 overflow-y-auto space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-slate-700 text-gray-100'
                      }`}
                    >
                      {message.botType && message.botType !== 'main_dashboard' && (
                        <div className="text-xs opacity-75 mb-1">
                          {message.botType.replace('_', ' ').toUpperCase()} BOT
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700 px-4 py-2 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <form onSubmit={handleChatSubmit} className="relative">
              <div className="flex items-center bg-slate-700 rounded-full p-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent px-6 py-4 text-lg text-white placeholder-gray-400 focus:outline-none"
                  disabled={isLoading}
                />
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    className="p-4 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isListening ? (
                      <MicOff className="h-6 w-6 text-white animate-pulse" />
                    ) : (
                      <Mic className="h-6 w-6 text-white" />
                    )}
                  </button>
                  <button
                    type="submit"
                    className="p-4 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors disabled:opacity-50"
                    disabled={isLoading || !chatInput.trim()}
                  >
                    <Send className="h-6 w-6 text-white" />
                  </button>
                </div>
              </div>
              {isListening && (
                <div className="text-center mt-2">
                  <p className="text-sm text-gray-400 animate-pulse">Listening... Speak now</p>
                </div>
              )}
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleSaveResponse}
              disabled={isSavingResponse || messages.length === 0}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              <span>{isSavingResponse ? 'Saving...' : 'Save AI Response'}</span>
            </button>
            
            <button
              onClick={handleGenerateStartupKit}
              disabled={isGeneratingKit}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Package className="h-5 w-5" />
              <span>{isGeneratingKit ? 'Generating...' : 'Get me Startup-Kit'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;