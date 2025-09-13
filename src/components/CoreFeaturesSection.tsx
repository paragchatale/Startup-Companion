import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Search, DollarSign, Palette } from 'lucide-react';

const CoreFeaturesSection: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 'legal-advisor',
      title: 'Legal Advisor',
      icon: Scale,
      description: 'Navigate registrations, trademarks, and compliance with AI-guided legal help.',
      gradient: 'from-blue-500 to-blue-600',
      path: '/legal-advisor'
    },
    {
      id: 'scheme-match-maker',
      title: 'Scheme Match Maker',
      icon: Search,
      description: 'Discover startup grants, incubators, and government schemes tailored to you.',
      gradient: 'from-purple-500 to-purple-600',
      path: '/scheme-match-maker'
    },
    {
      id: 'financial-setup',
      title: 'Financial Setup',
      icon: DollarSign,
      description: 'From business accounts to invoicing — get your startup\'s money game sorted.',
      gradient: 'from-green-500 to-green-600',
      path: '/financial-setup'
    },
    {
      id: 'branding-marketing',
      title: 'Branding and Marketing',
      icon: Palette,
      description: 'Build a memorable brand and go-to-market strategy with expert help.',
      gradient: 'from-pink-500 to-pink-600',
      path: '/branding-marketing'
    }
  ];

  const handleFeatureClick = (path: string) => {
    navigate(path);
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };
  return (
    <section id="core-features" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Start With What You Need Most
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your focus area and get personalized guidance from our AI-powered assistant
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                onClick={() => handleFeatureClick(feature.path)}
                className="group cursor-pointer bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                <div className="mt-6 flex items-center text-blue-600 font-medium group-hover:text-purple-600 transition-colors">
                  <span>Learn more</span>
                  <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CoreFeaturesSection;