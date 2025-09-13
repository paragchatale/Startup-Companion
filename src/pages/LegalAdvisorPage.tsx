import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, MessageCircle, ArrowLeft, CheckCircle } from 'lucide-react';

const LegalAdvisorPage: React.FC = () => {
  const navigate = useNavigate();

  const connectToChatBot = () => {
    alert('Connecting to Legal Advisor Chat Bot...');
  };

  const legalServices = [
    'Company Registration & Incorporation',
    'Trademark & Intellectual Property',
    'Compliance & Regulatory Requirements',
    'Contracts & Agreements',
    'Tax Structure Guidance',
    'Labor Law Compliance'
  ];

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </button>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 mb-6">
                <Scale className="h-12 w-12 text-white" />
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Legal{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Advisor
                </span>
              </h1>
              
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Navigate company registration, trademarks, and compliance with AI-guided legal help — 
                made for first-time founders.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">What We Cover:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {legalServices.map((service, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Why Choose Our Legal Advisor?</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✅ Simplified legal jargon for entrepreneurs</li>
                <li>✅ Country-specific compliance guidance (India & US)</li>
                <li>✅ Cost-effective alternative to expensive law firms</li>
                <li>✅ 24/7 AI assistance with expert backup</li>
              </ul>
            </div>

            <button
              onClick={connectToChatBot}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
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
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20 rounded-full blur-3xl"></div>
                  <Scale className="h-48 w-48 text-blue-600 relative z-10" />
                </div>
              </div>
              
              <div className="text-center mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Legal Made Simple</h3>
                <p className="text-gray-600">
                  From incorporation to compliance, get expert legal guidance without the complexity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalAdvisorPage;