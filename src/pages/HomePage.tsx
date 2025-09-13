import React from 'react';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import CoreFeaturesSection from '../components/CoreFeaturesSection';
import BenefitsSection from '../components/BenefitsSection';
import HowItWorksSection from '../components/HowItWorksSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <div className="pt-16">
      <HeroSection />
      <StatsSection />
      <CoreFeaturesSection />
      <BenefitsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default HomePage;