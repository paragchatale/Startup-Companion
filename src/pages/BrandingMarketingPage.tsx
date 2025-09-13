import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Palette, MessageCircle, ArrowLeft, Megaphone, Users, Zap } from 'lucide-react';

const BrandingMarketingPage: React.FC = () => {
  const navigate = useNavigate();

  const connectToChatBot = () => {
    alert('Connecting to Branding & Marketing Chat Bot...');
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
      </div>
    </div>
  );
};

export default BrandingMarketingPage;