import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MessageCircle, ArrowLeft, Target, Globe, DollarSign } from 'lucide-react';

const SchemeMatchMakerPage: React.FC = () => {
  const navigate = useNavigate();

  const connectToChatBot = () => {
    alert('Connecting to Scheme Match Maker Chat Bot...');
  };

  const schemeTypes = [
    {
      icon: DollarSign,
      title: 'Government Grants',
      description: 'Startup India, MSME schemes, state-level grants'
    },
    {
      icon: Target,
      title: 'Incubators & Accelerators',
      description: 'Y Combinator, Techstars, local incubation programs'
    },
    {
      icon: Globe,
      title: 'Industry-Specific Programs',
      description: 'Tech, healthcare, agriculture, and green energy schemes'
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-purple-600 hover:text-purple-700 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </button>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 mb-6">
                <Search className="h-12 w-12 text-white" />
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Scheme{' '}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Match Maker
                </span>
              </h1>
              
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Discover startup grants, incubators, and government schemes tailored to your industry and location.
              </p>
            </div>

            <div className="grid gap-6">
              {schemeTypes.map((scheme, index) => {
                const IconComponent = scheme.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-start">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl mr-4">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{scheme.title}</h3>
                        <p className="text-gray-600">{scheme.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Smart Matching Algorithm</h3>
              <ul className="space-y-2 text-gray-700">
                <li>🎯 Industry and sector-specific recommendations</li>
                <li>📍 Location-based filtering (India & US markets)</li>
                <li>💰 Funding amount and equity requirements</li>
                <li>⏰ Application deadlines and requirements</li>
              </ul>
            </div>

            <button
              onClick={connectToChatBot}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
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
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 rounded-full blur-3xl"></div>
                  <Search className="h-48 w-48 text-purple-600 relative z-10" />
                  <div className="absolute -top-8 -right-8 animate-pulse">
                    <Target className="h-16 w-16 text-pink-500" />
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Find Your Perfect Match</h3>
                <p className="text-gray-600">
                  Discover funding opportunities and programs that align with your startup vision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeMatchMakerPage;