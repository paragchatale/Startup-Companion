import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowRight, Lightbulb } from 'lucide-react';

const IdeationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const businessIdea = location.state?.idea || '';

  const connectToChatBot = () => {
    // This would integrate with your chatbot service
    alert(`Connecting to chat bot${businessIdea ? ` with your idea: "${businessIdea}"` : ''}...`);
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
      </div>
    </div>
  );
};

export default IdeationPage;