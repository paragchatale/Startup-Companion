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
      icon: Scale,
      color: 'text-blue-400',
      path: '/legal-advisor'
    },
    {
      id: 'govt-scheme',
      title: 'Govt Scheme Matching',
      description: 'Find government schemes',
      icon: Building2,
      color: 'text-purple-400',
      path: '/scheme-match-maker'
    },
    {
      id: 'financial-setup',
      title: 'Financial Setup',
      description: 'Setup your finances',
      icon: DollarSign,
      color: 'text-green-400',
      path: '/financial-setup'
    },
    {
      id: 'branding-marketing',
      title: 'Branding & Marketing',
      description: 'Build your brand',
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
                    className="w-full bg-slate-700 hover:bg-slate-600 rounded-lg p-4 flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`h-5 w-5 ${service.color}`} />
                      <div className="text-left">
                        <div className="font-medium">{service.title}</div>
                        <div className="text-sm text-gray-400">{service.description}</div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Chat Section */}
          <div className="bg-slate-800 rounded-2xl p-8 mb-8">
            <h2 className="text-xl font-medium text-center mb-6 text-gray-300">
              How can I help you today, {user?.user_metadata?.full_name?.split(' ')[0] || 'Ethan'}?
            </h2>
            
            <form onSubmit={handleChatSubmit} className="relative">
              <div className="flex items-center bg-slate-700 rounded-full p-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-400 focus:outline-none"
                />
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                  >
                    <Mic className="h-5 w-5 text-white" />
                  </button>
                  <button
                    type="submit"
                    className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                  >
                    <Send className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Journey Section */}
          <div className="bg-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-center mb-8">Your Entrepreneur Journey</h2>
            
            <div className="relative h-64 flex items-center justify-center">
              {/* Journey Path */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 600 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M50 150 Q150 50 250 100 T450 80 Q500 60 550 100"
                  stroke="url(#gradient)"
                  strokeWidth="4"
                  fill="none"
                  className="animate-pulse"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Journey Stars */}
              <div className="absolute left-1/4 top-1/3">
                <Star className="h-8 w-8 text-yellow-400 fill-current animate-pulse" />
              </div>
              <div className="absolute right-1/4 top-1/4">
                <Star className="h-6 w-6 text-yellow-400 fill-current animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
              <div className="absolute left-1/3 bottom-1/3">
                <Star className="h-4 w-4 text-yellow-400 fill-current animate-pulse" style={{ animationDelay: '1s' }} />
              </div>

              {/* Animated Bot Character */}
              <div className="absolute left-12 bottom-8 animate-bounce">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <Bot className="h-6 w-6 text-white" />
                </div>
              </div>

              {/* Journey Milestones */}
              <div className="absolute inset-0 flex items-center justify-between px-12">
                <div className="text-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mb-2 mx-auto"></div>
                  <span className="text-xs text-gray-400">Start</span>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mb-2 mx-auto"></div>
                  <span className="text-xs text-gray-400">Legal</span>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mb-2 mx-auto"></div>
                  <span className="text-xs text-gray-400">Finance</span>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 bg-pink-500 rounded-full mb-2 mx-auto"></div>
                  <span className="text-xs text-gray-400">Launch</span>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-400 mb-4">
                Track your progress as you build your startup from idea to launch
              </p>
              <div className="flex justify-center space-x-4">
                <div className="bg-slate-700 px-4 py-2 rounded-full">
                  <span className="text-sm">Progress: 25%</span>
                </div>
                <div className="bg-slate-700 px-4 py-2 rounded-full">
                  <span className="text-sm">Next: Legal Setup</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;