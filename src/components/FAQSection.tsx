import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is Start-up Companion?",
      answer: "Start-up Companion is an AI-powered onboarding assistant designed to help early-stage entrepreneurs and solo founders navigate the complex process of starting and growing a business. We provide personalized guidance on legal requirements, funding opportunities, financial setup, and branding strategies."
    },
    {
      question: "Do I need a complete business idea?",
      answer: "Not at all! Whether you have a fully formed business plan or just a rough concept, our AI assistant can help you refine your idea and create a structured roadmap. We work with founders at all stages of their entrepreneurial journey."
    },
    {
      question: "Is this platform free?",
      answer: "We offer both free and premium features. Basic AI consultations and initial guidance are free to help you get started. Advanced features like detailed legal documentation, funding application assistance, and personalized business plans are available through our premium plans."
    },
    {
      question: "Can I really get legal and financial guidance?",
      answer: "Yes! Our AI assistant is trained on comprehensive legal and financial databases specific to startup needs in India and the US. We provide guidance on business registration, compliance requirements, tax structures, and financial planning. For complex matters, we also connect you with verified legal and financial professionals."
    },
    {
      question: "Is my data private and secure?",
      answer: "Absolutely. We take data privacy seriously and use enterprise-grade encryption to protect your business information. Your ideas, plans, and personal data are never shared with third parties without your explicit consent. We comply with international data protection standards including GDPR and local privacy regulations."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Got Questions? We've Got Answers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about Start-up Companion and how it can help your business
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 rounded-2xl transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-8">
                  {faq.question}
                </h3>
                {openFAQ === index ? (
                  <ChevronUp className="h-5 w-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              
              {openFAQ === index && (
                <div className="px-8 pb-6">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;