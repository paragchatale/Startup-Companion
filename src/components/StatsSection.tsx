import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, Star, Award } from 'lucide-react';

const StatsSection: React.FC = () => {
  const [animatedStats, setAnimatedStats] = useState({
    consultants: 0,
    projects: 0,
    rating: 0,
    awards: 0
  });

  const finalStats = {
    consultants: 150,
    projects: 2500,
    rating: 4.9,
    awards: 12
  };

  const stats = [
    {
      icon: Users,
      value: animatedStats.consultants,
      suffix: '+',
      label: 'Expert Consultants',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: CheckCircle,
      value: animatedStats.projects,
      suffix: '+',
      label: 'Projects Completed',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Star,
      value: animatedStats.rating,
      suffix: '/5',
      label: 'Customer Rating',
      gradient: 'from-yellow-500 to-orange-500',
      isDecimal: true
    },
    {
      icon: Award,
      value: animatedStats.awards,
      suffix: '+',
      label: 'Awards Received',
      gradient: 'from-green-500 to-teal-500'
    }
  ];

  const trustedCompanies = [
    { name: 'TechCorp', logo: '🚀' },
    { name: 'InnovateLab', logo: '💡' },
    { name: 'StartupHub', logo: '🏢' },
    { name: 'VentureWorks', logo: '💼' },
    { name: 'GrowthCo', logo: '📈' },
    { name: 'FutureBuilders', logo: '🔮' },
    { name: 'NextGen', logo: '⚡' },
    { name: 'ScaleUp', logo: '🎯' },
    { name: 'LaunchPad', logo: '🛸' },
    { name: 'Accelerate', logo: '🏃' }
  ];

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedStats({
        consultants: Math.floor(finalStats.consultants * progress),
        projects: Math.floor(finalStats.projects * progress),
        rating: Math.floor((finalStats.rating * progress) * 10) / 10,
        awards: Math.floor(finalStats.awards * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats(finalStats);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Stats Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Trusted by Thousands of Entrepreneurs
          </h2>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-12">
            Join a community of successful founders who've transformed their ideas into thriving businesses
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.gradient} mb-4`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="text-3xl font-bold text-white mb-2">
                    {stat.isDecimal ? stat.value.toFixed(1) : stat.value}{stat.suffix}
                  </div>
                  
                  <div className="text-indigo-100 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trusted Companies Section */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-white mb-8">
            Trusted by Leading Companies
          </h3>
          
          {/* Animated Company Logos */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll">
              {/* First set of companies */}
              {trustedCompanies.map((company, index) => (
                <div
                  key={`first-${index}`}
                  className="flex-shrink-0 mx-8 flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 hover:bg-white/20 transition-all duration-300"
                >
                  <span className="text-2xl">{company.logo}</span>
                  <span className="text-white font-medium whitespace-nowrap">
                    {company.name}
                  </span>
                </div>
              ))}
              
              {/* Duplicate set for seamless loop */}
              {trustedCompanies.map((company, index) => (
                <div
                  key={`second-${index}`}
                  className="flex-shrink-0 mx-8 flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 hover:bg-white/20 transition-all duration-300"
                >
                  <span className="text-2xl">{company.logo}</span>
                  <span className="text-white font-medium whitespace-nowrap">
                    {company.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;