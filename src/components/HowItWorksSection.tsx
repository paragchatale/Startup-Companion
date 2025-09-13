import React, { useEffect, useRef, useState } from 'react';
import { Edit3, Brain, Map, Rocket } from 'lucide-react';

const HowItWorksSection: React.FC = () => {
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      icon: Edit3,
      title: 'Submit Your Idea',
      description: 'Tell us what\'s on your mind.',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: Brain,
      title: 'AI Understands You',
      description: 'We analyze your input to map your needs.',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: Map,
      title: 'Tailored Roadmap',
      description: 'Get legal, funding, and marketing suggestions just for you.',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: Rocket,
      title: 'Launch & Grow',
      description: 'Execute confidently with expert support.',
      gradient: 'from-pink-500 to-pink-600'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            steps.forEach((_, index) => {
              setTimeout(() => {
                setVisibleSteps(prev => {
                  const newVisible = [...prev];
                  newVisible[index] = true;
                  return newVisible;
                });
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Four simple steps to transform your idea into a structured business plan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isVisible = visibleSteps[index];
            
            return (
              <div
                key={index}
                className={`relative transform transition-all duration-700 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent z-0" />
                )}

                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 z-10">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>

                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${step.gradient} mb-6`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;