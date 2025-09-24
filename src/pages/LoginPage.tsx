import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import IdeationPage from './pages/IdeationPage';
import LegalAdvisorPage from './pages/LegalAdvisorPage';
import SchemeMatchMakerPage from './pages/SchemeMatchMakerPage';
import FinancialSetupPage from './pages/FinancialSetupPage';
import BrandingMarketingPage from './pages/BrandingMarketingPage';
import LoginPage from './pages/LoginPage';

        {/* Login Card - Centered */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/30">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Login</h1>
          </div>
          <Route path="/ideation" element={<IdeationPage />} />
          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Field */}
            <div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Username"
                className="w-full px-4 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-3 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                required
              />
            </div>
          onClick={() => navigate('/')}
            {/* Password Field */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full px-4 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-3 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {/* Forgot Password */}
            <div className="text-center">
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 text-sm"
              >
                Forgot Password?
              </button>
            </div>
            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              Login
            </button>
          </form>
          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">Or continue with</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-gray-300 py-4 rounded-2xl font-medium text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-3"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Login with Google</span>
          </button>
          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <span className="text-gray-600">Don't have an account? </span>
            <button
              onClick={handleSignUp}
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
            >
              Sign Up
            </button>
          </div>
        </div>

export default LoginPage