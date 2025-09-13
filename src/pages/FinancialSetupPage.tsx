import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, MessageCircle, ArrowLeft, CreditCard, PieChart, Receipt } from 'lucide-react';

const FinancialSetupPage: React.FC = () => {
  const navigate = useNavigate();

  const connectToChatBot = () => {
    alert('Connecting to Financial Setup Chat Bot...');
  };

  const financialServices = [
    {
      icon: CreditCard,
      title: 'Business Banking',
      description: 'Open business accounts, credit lines, and payment processing'
    },
    {
      icon: PieChart,
      title: 'Accounting Setup',
      description: 'Bookkeeping, expense tracking, and financial reporting'
    },
    {
      icon: Receipt,
      title: 'Invoicing & Payments',
      description: 'Professional invoicing systems and payment gateways'
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-green-600 hover:text-green-700 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </button>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 mb-6">
                <DollarSign className="h-12 w-12 text-white" />
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Financial{' '}
                <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  Setup
                </span>
              </h1>
              
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                From opening business accounts to invoicing and basic accounting — get your startup's money game sorted.
              </p>
            </div>

            <div className="grid gap-6">
              {financialServices.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-start">
                      <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-xl mr-4">
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

            <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Financial Foundation Made Easy</h3>
              <ul className="space-y-2 text-gray-700">
                <li>💳 Business account recommendations and setup</li>
                <li>📊 Simple accounting software integration</li>
                <li>💰 Tax planning and compliance guidance</li>
                <li>📈 Financial projections and budgeting tools</li>
              </ul>
            </div>

            <button
              onClick={connectToChatBot}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
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
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-teal-600 opacity-20 rounded-full blur-3xl"></div>
                  <DollarSign className="h-48 w-48 text-green-600 relative z-10" />
                  <div className="absolute top-8 right-8 animate-bounce">
                    <PieChart className="h-16 w-16 text-teal-500" />
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Money Matters Simplified</h3>
                <p className="text-gray-600">
                  Build a solid financial foundation for your startup with expert guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSetupPage;