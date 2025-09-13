import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Mail, Linkedin, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Terms', path: '/terms' },
    { name: 'Login', path: '/login' }
  ];

  const services = [
    { name: 'Legal Advisor', path: '/legal-advisor' },
    { name: 'Scheme Match Maker', path: '/scheme-match-maker' },
    { name: 'Financial Setup', path: '/financial-setup' },
    { name: 'Branding & Marketing', path: '/branding-marketing' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl">Start-up Companion</span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              AI-powered onboarding assistant for young entrepreneurs and solo founders. 
              Transform your startup idea into a structured business with expert guidance.
            </p>
            
            {/* Newsletter Signup */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Stay Updated</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
                />
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 rounded-r-lg hover:shadow-lg transition-all">
                  <Mail className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.path}>
                  <Link
                    to={service.path}
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links and Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-6 w-6" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-pink-400 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-6 w-6" />
            </a>
          </div>
          
          <p className="text-gray-400 text-sm">
            © 2025 Start-up Companion. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;