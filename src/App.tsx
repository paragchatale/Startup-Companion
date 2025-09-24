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

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ideation" element={<IdeationPage />} />
          <Route path="/legal-advisor" element={<LegalAdvisorPage />} />
          <Route path="/scheme-match-maker" element={<SchemeMatchMakerPage />} />
          <Route path="/financial-setup" element={<FinancialSetupPage />} />
          <Route path="/branding-marketing" element={<BrandingMarketingPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;