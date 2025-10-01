import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { 
  Scale, 
  Building2, 
  DollarSign, 
  Palette, 
  ChevronRight, 
  Send, 
  Mic, 
  FileText, 
  Bot,
  Settings,
  Star
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chatInput, setChatInput] = useState('');

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

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      // Handle chat submission
      console.log('Chat message:', chatInput);
      setChatInput('');
    }
  };

  const handleUpdateProfile = () => {
    // Handle profile update
    console.log('Update profile clicked');
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
      </div>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-slate-800 min-h-screen p-6 border-r border-slate-700">
          {/* Profile Section */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <img 
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold mb-1">
              {user?.user_metadata?.full_name || 'Ethan Carter'}
            </h2>
            <p className="text-gray-400 mb-6">Founder</p>
            <button
              onClick={handleUpdateProfile}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full"
            >
              Update User Details
            </button>
            
            {/* Document Buttons */}
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full flex items-center justify-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>My Biz Doc</span>
            </button>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full flex items-center justify-center space-x-2">
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
          <div className="bg-slate-800 rounded-2xl p-12 mb-8">
            <h2 className="text-xl font-medium text-center mb-6 text-gray-300">
              How can I help you today, {user?.user_metadata?.full_name?.split(' ')[0] || 'Ethan'}?
            </h2>
            
            <form onSubmit={handleChatSubmit} className="relative">
              <div className="flex items-center bg-slate-700 rounded-full p-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent px-6 py-4 text-lg text-white placeholder-gray-400 focus:outline-none"
                />
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="p-4 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                  >
                    <Mic className="h-6 w-6 text-white" />
                  </button>
                  <button
                    type="submit"
                    className="p-4 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                  >
                    <Send className="h-6 w-6 text-white" />
                  </button>
                </div>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;