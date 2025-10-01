import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User, CreditCard as Edit3, MessageCircle, Mic, Scale, Search, DollarSign, Palette, Bell, LogOut, Send, CheckCircle, Circle, FileText } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'bot', message: string, timestamp?: Date}>>([]);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
    designation: 'Entrepreneur',
    avatar: ''
  });

  // Business Journey Progress Data
  const [journeyProgress] = useState([
    { milestone: 'Idea Validation', progress: 75, completed: false, color: 'from-blue-500 to-cyan-500' },
    { milestone: 'Legal Setup', progress: 45, completed: false, color: 'from-purple-500 to-pink-500' },
    { milestone: 'Financial Planning', progress: 30, completed: false, color: 'from-green-500 to-teal-500' },
    { milestone: 'Branding', progress: 20, completed: false, color: 'from-orange-500 to-red-500' },
    { milestone: 'Go-to-Market', progress: 10, completed: false, color: 'from-indigo-500 to-purple-500' }
  ]);

  const overallProgress = journeyProgress.reduce((acc, item) => acc + item.progress, 0) / journeyProgress.length;

  // Service Cards Data
  const serviceCards = [
    {
      title: 'Legal Advisor',
      description: 'Navigate registrations, trademarks, and compliance',
      icon: Scale,
      gradient: 'from-blue-500 to-blue-600',
      path: '/legal-advisor'
    },
    {
      title: 'Scheme Match Maker',
      description: 'Discover grants and funding opportunities',
      icon: Search,
      gradient: 'from-purple-500 to-purple-600',
      path: '/scheme-match-maker'
    },
    {
      title: 'Financial Setup',
      description: 'Business accounts, invoicing, and accounting',
      icon: DollarSign,
      gradient: 'from-green-500 to-green-600',
      path: '/financial-setup'
    },
    {
      title: 'Branding & Marketing',
      description: 'Build memorable brand and marketing strategy',
      icon: Palette,
      gradient: 'from-pink-500 to-pink-600',
      path: '/branding-marketing'
    }
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    loadDocuments();
  }, [user, navigate]);

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const callStartupChatBot = async (message: string) => {
    setIsLoading(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/startup-chat`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.reply || "I couldn't process your request, please try again.";
      
      // Speak the response
      speakText(reply);
      
      return reply;
    } catch (error) {
      console.error('Error calling startup chat bot:', error);
      return "Sorry, I'm having trouble connecting right now. Please try again later.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const userMessage = chatMessage.trim();
      setChatHistory(prev => [...prev, { 
        type: 'user', 
        message: userMessage,
        timestamp: new Date()
      }]);
      
      setChatMessage('');
      
      // Call the actual chatbot
      callStartupChatBot(userMessage).then(botResponse => {
        setChatHistory(prev => [...prev, { 
          type: 'bot', 
          message: botResponse,
          timestamp: new Date()
        }]);
      });
    }
  };

  // Text-to-Speech function
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speech-to-Text function
  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setChatMessage(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
        alert('Speech recognition error. Please try again.');
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  // Generate and save PDF
  const generateAndSavePDF = async () => {
    if (chatHistory.length === 0) {
      alert('No conversation to save!');
      return;
    }

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/startup-chat`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          message: '',
          generatePDF: true,
          conversation: chatHistory
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.type === 'pdf') {
        // Save to Supabase documents table
        const { error } = await supabase
          .from('documents')
          .insert([{
            title: data.pdfData.title,
            content: data.pdfData.content,
            user_id: user?.id
          }]);

        if (error) throw error;
        
        loadDocuments();
        alert('Conversation saved to My Documents!');
        
        // Clear chat after saving
        setChatHistory([]);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error saving document. Please try again.');
    }
  };

  const generatePDF = async (conversation: ChatMessage[]) => {
    try {
      // Create a simple text-based document content
      const content = conversation.map(msg => 
        `${msg.type.toUpperCase()}: ${msg.message}\n\n`
      ).join('');
      
      const title = `Startup Consultation - ${new Date().toLocaleDateString()}`;
      
      const { error } = await supabase
        .from('documents')
        .insert([{
          title,
          content,
          user_id: user?.id
        }]);

      if (error) throw error;
      
      await loadDocuments();
      alert('Document saved successfully!');
    } catch (error) {
      console.error('Error saving document:', error);
      alert('Error saving document. Please try again.');
    }
  };

  const downloadDocument = (doc: Document) => {
    const blob = new Blob([doc.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleServiceClick = (path: string) => {
    navigate(path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleChatClick = () => {
    setShowChatPopup(true);
  };

  if (!user) return null;

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Top Navigation */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <button 
                onClick={() => navigate('/my-documents')}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 bg-white/50 hover:bg-white/80 px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-300"
              >
                <FileText className="h-5 w-5" />
                <span className="font-medium">My Documents</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium hidden sm:block">
                Welcome back, {profileData.name}!
              </span>
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar - User Profile & Progress */}
        <aside className="w-80 bg-white/90 backdrop-blur-sm shadow-xl border-r border-white/30 p-6 flex flex-col">
          {/* Profile Section */}
          <div className="text-center mb-6">
            <div className="relative mx-auto mb-3">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold mx-auto">
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  profileData.name.charAt(0).toUpperCase()
                )}
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{profileData.name}</h3>
            <p className="text-gray-600 mb-3 text-sm">{profileData.designation}</p>
            
            <button
              onClick={() => setShowEditProfile(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-2 rounded-full hover:shadow-lg transition-all duration-200 mx-auto text-sm"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Innovative Progress Section */}
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-4 text-center">Startup Journey</h4>
            
            {/* Overall Progress Ring */}
            <div className="relative mb-6">
              <div className="w-28 h-28 mx-auto">
                <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    stroke="url(#gradient)"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 35}`}
                    strokeDashoffset={`${2 * Math.PI * 35 * (1 - overallProgress / 100)}`}
                    className="transition-all duration-2000 ease-out"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">{Math.round(overallProgress)}%</div>
                    <div className="text-xs text-gray-600">Complete</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Milestone Progress Bars */}
            <div className="space-y-3">
              {journeyProgress.map((milestone, index) => (
                <div key={index} className="relative">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-700">{milestone.milestone}</span>
                    <span className="text-xs text-gray-500">{milestone.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${milestone.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${milestone.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 shadow-sm px-3 py-2 rounded-lg text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              {isSpeaking && (
                <div className="flex justify-center">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Speaking...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 flex flex-col">
          {/* Compact Chatbot Section */}
          <div 
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-4 mb-6 cursor-pointer hover:shadow-2xl transition-all duration-300"
            onClick={handleChatClick}
          >
            <div className="flex items-center justify-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg mr-3">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">StartupBot</h2>
              <span className="ml-2 text-sm text-gray-500">- Click to chat</span>
            </div>
          </div>

          {/* Service Cards Grid - 2x2 Layout */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            {serviceCards.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-4 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  onClick={() => handleServiceClick(service.path)}
                >
                  <div className="flex items-start space-x-3 mb-3">
                    <div className={`p-2 rounded-xl bg-gradient-to-r ${service.gradient} flex-shrink-0`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 mb-1">{service.title}</h3>
                      <p className="text-gray-600 text-xs leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                  
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-full text-xs font-medium hover:shadow-lg transition-all duration-200 self-start">
                    Chat with Expert
                  </button>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Chat Popup Modal */}
      {showChatPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-96 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg mr-3">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">StartupBot</h2>
              </div>
              <button
                onClick={() => setShowChatPopup(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 flex-1 overflow-y-auto mb-4">
              {chatHistory.length === 0 ? (
                <p className="text-gray-500 text-center text-sm">Ask anything about your startup journey...</p>
              ) : (
                <div className="space-y-2">
                  {chatHistory.map((chat, index) => (
                    <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-3 py-2 rounded-lg text-xs ${
                        chat.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white text-gray-800 shadow-sm'
                      }`}>
                        {chat.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:opacity-50"
                disabled={isLoading || isListening}
              />
              <button 
                onClick={startListening}
                disabled={isLoading || isListening}
                className={`p-2 transition-colors rounded-xl ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                } disabled:opacity-50`}
              >
                <Mic className={`h-5 w-5 ${isListening ? 'animate-pulse' : ''}`} />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={isLoading || isListening}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            
            {/* Save as PDF button */}
            {chatHistory.length > 0 && (
              <div className="mt-3 flex justify-center">
                <button
                  onClick={generateAndSavePDF}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>Save as Document</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showDocuments && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-96 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">My Documents</h2>
              <button
                onClick={() => setShowDocuments(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No documents saved yet</p>
                  <p className="text-sm text-gray-400 mt-2">Start a conversation and save it as a document</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{doc.title}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(doc.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => downloadDocument(doc)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Edit Profile</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <input
                  type="text"
                  value={profileData.designation}
                  onChange={(e) => setProfileData(prev => ({ ...prev, designation: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowEditProfile(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowEditProfile(false)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;