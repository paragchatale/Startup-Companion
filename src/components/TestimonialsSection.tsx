import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      quote: "I had a vague idea and no plan. Start-up Companion gave me structure and momentum. The legal guidance alone saved me months of confusion.",
      name: "Priya Sharma",
      startup: "GreenSpire",
      role: "Founder",
      location: "Mumbai, India"
    },
    {
      quote: "The AI-powered recommendations were spot-on. I discovered government schemes I never knew existed and got funding for my tech startup.",
      name: "Alex Johnson",
      startup: "TechFlow",
      role: "Co-founder",
      location: "San Francisco, USA"
    },
    {
      quote: "From idea to incorporation in just 3 weeks! The financial setup guidance helped me open business accounts and set up proper accounting from day one.",
      name: "Rohit Patel",
      startup: "EcoCart",
      role: "Founder & CEO",
      location: "Bangalore, India"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            What Founders Are Saying
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Real stories from entrepreneurs who transformed their ideas into successful businesses
          </p>
        </div>

        <div className="relative">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>

            <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 italic">
              "{testimonials[currentTestimonial].quote}"
            </blockquote>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-lg text-gray-900">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-gray-600">
                  {testimonials[currentTestimonial].role}, {testimonials[currentTestimonial].startup}
                </div>
                <div className="text-sm text-gray-500">
                  {testimonials[currentTestimonial].location}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={prevTestimonial}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Testimonial indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentTestimonial ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;