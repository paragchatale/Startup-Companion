import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, CreditCard as Edit3, MessageCircle, Mic, Scale, Search, DollarSign, Palette, Bell, LogOut, Send, CheckCircle, Circle } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'bot', message: string}>>([]);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
    designation: 'Entrepreneur',
    avatar: ''
  });

  // Business Journey Progress Data
  const [journeyProgress] = useState([
    { milestone: 'Idea Validation', progress: 75, completed: false },
    { milestone: 'Legal Setup', progress: 45, completed: false },
    { milestone: 'Financial Planning', progress: 30, completed: false },
    { milestone: 'Branding', progress: 20, completed: false },
    { milestone: 'Go-to-Market', progress: 10, completed: false }
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
  }, [user, navigate]);

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setChatHistory(prev => [...prev, { type: 'user', message: chatMessage }]);
      
      // Simulate bot response
      setTimeout(() => {
        setChatHistory(prev => [...prev, { 
          type: 'bot', 
          message: "I'm here to help with your startup journey! What specific area would you like guidance on?" 
        }]);
      }, 1000);
      
      setChatMessage('');
    }
  };

  const handleServiceClick = (path: string) => {
    navigate(path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Top Navigation */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
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

      <div className="flex">
        {/* Left Sidebar - User Profile Panel */}
        <aside className="w-80 bg-white/90 backdrop-blur-sm shadow-xl border-r border-white/30 min-h-screen p-6">
          <div className="text-center mb-8">
            {/* Profile Picture */}
            <div className="relative mx-auto mb-4">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  profileData.name.charAt(0).toUpperCase()
                )}
              </div>
            </div>
            
            {/* User Info */}
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{profileData.name}</h3>
            <p className="text-gray-600 mb-4">{profileData.designation}</p>
            
            {/* Edit Profile Button */}
            <button
              onClick={() => setShowEditProfile(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-200 mx-auto"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Progress Overview */}
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Journey Progress</h4>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700 mt-2 block">
                {Math.round(overallProgress)}% Complete
              </span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {/* Top-Center Section: Chatbot */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6 mb-8">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg mr-3">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">StartupBot</h2>
            </div>
            
            {/* Chat History */}
            <div className="bg-gray-50 rounded-xl p-4 h-32 overflow-y-auto mb-4">
              {chatHistory.length === 0 ? (
                <p className="text-gray-500 text-center">Ask anything about your startup journey...</p>
              ) : (
                <div className="space-y-2">
                  {chatHistory.map((chat, index) => (
                    <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
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
            
            {/* Chat Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Mic className="h-5 w-5" />
              </button>
              <button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-xl hover:shadow-lg transition-all duration-200"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Middle Section: Business Journey Progress */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Your Startup Journey</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {journeyProgress.map((milestone, index) => (
                <div key={index} className="text-center">
                  <div className="relative mb-4">
                    {/* Circular Progress */}
                    <div className="relative w-20 h-20 mx-auto">
                      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-gray-200"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - milestone.progress / 100)}`}
                          className="text-blue-600 transition-all duration-1000 ease-out"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-900">{milestone.progress}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">{milestone.milestone}</h3>
                  <div className="flex justify-center">
                    {milestone.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section: Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {serviceCards.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  onClick={() => handleServiceClick(service.path)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${service.gradient}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      
                      <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-200">
                        Chat with Expert
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

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