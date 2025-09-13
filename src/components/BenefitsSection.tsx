import React from 'react';
import { Rocket, Bot, Puzzle, Briefcase } from 'lucide-react';

const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: Rocket,
      title: 'Launch faster than ever',
      description: 'Instant clarity on your next steps.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Bot,
      title: 'Smart AI by your side',
      description: 'Personalized guidance based on your inputs.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Puzzle,
      title: 'All-in-one startup hub',
      description: 'Legal, financial, and marketing help in one place.',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      icon: Briefcase,
      title: 'Made for early-stage founders',
      description: 'You build the dream — we help you execute it.',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Start-up Companion?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We understand the unique challenges of early-stage startups and provide tailored solutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${benefit.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;