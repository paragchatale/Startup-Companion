import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Lightbulb, Rocket, Target } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [businessIdea, setBusinessIdea] = useState('');
  const navigate = useNavigate();

  const handleSubmitIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (businessIdea.trim()) {
      navigate('/ideation', { state: { idea: businessIdea.trim() } });
    }
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('core-features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 opacity-10">
          <Rocket className="h-32 w-32 text-blue-600 transform rotate-12" />
        </div>
        <div className="absolute top-40 right-20 opacity-10">
          <Lightbulb className="h-24 w-24 text-purple-600 transform -rotate-12" />
        </div>
        <div className="absolute bottom-20 left-20 opacity-10">
          <Target className="h-28 w-28 text-pink-600 transform rotate-45" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="space-y-8">
          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Stop Dreaming and{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Start Building
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Turn your idea into a thriving business — <span className="font-semibold">Start · Run · Grow</span>
            </p>
          </div>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-gray-700 max-w-5xl mx-auto leading-relaxed">
            Whether you're just starting or stuck mid-way — get expert guidance on legal requirements, 
            funding, finance, and branding all tailored to your unique business idea. Transform your idea into momentum.
          </p>

          {/* CTA Form */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmitIdea} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={businessIdea}
                  onChange={(e) => setBusinessIdea(e.target.value)}
                  placeholder="Business idea in your mind? Fine tune here."
                  className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-2xl text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Submit Idea
              </button>
            </form>
          </div>
        </div>

        {/* Scroll Arrow */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button
            onClick={scrollToFeatures}
            className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
            aria-label="Scroll to features"
          >
            <ChevronDown className="h-8 w-8" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;