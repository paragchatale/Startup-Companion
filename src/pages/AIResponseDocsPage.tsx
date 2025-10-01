import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { getAIResponseDocs, AIResponseDoc } from '../lib/supabaseHelpers';
import { ArrowLeft, Bot, Download, FileText, Trash2 } from 'lucide-react';

const AIResponseDocsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<AIResponseDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  const loadDocuments = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const docs = await getAIResponseDocs(user.id);
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading AI response documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBotTypeLabel = (botType: string) => {
    const labels: { [key: string]: string } = {
      'legal_advisor': 'Legal Advisor',
      'govt_scheme_matcher': 'Government Schemes',
      'financial_setup': 'Financial Setup',
      'branding_marketing': 'Branding & Marketing',
      'main_dashboard': 'General Consultation'
    };
    return labels[botType] || botType;
  };

  const getBotTypeColor = (botType: string) => {
    const colors: { [key: string]: string } = {
      'legal_advisor': 'text-blue-400',
      'govt_scheme_matcher': 'text-purple-400',
      'financial_setup': 'text-green-400',
      'branding_marketing': 'text-pink-400',
      'main_dashboard': 'text-yellow-400'
    };
    return colors[botType] || 'text-gray-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading your AI response documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold">AI Response Documents</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">Your Generated Documents</h2>
          
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 text-lg mb-2">No AI response documents yet</p>
              <p className="text-gray-400">
                Chat with our AI assistants and save responses as PDFs to see them here
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-slate-700 rounded-lg p-6 hover:bg-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Bot className={`h-8 w-8 ${getBotTypeColor(doc.bot_type)}`} />
                      <div>
                        <h3 className="font-medium text-white">
                          {getBotTypeLabel(doc.bot_type)} Session
                        </h3>
                        <p className="text-sm text-gray-400">
                          {new Date(doc.created_at).toLocaleDateString()} at{' '}
                          {new Date(doc.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {doc.pdf_url && (
                        <button
                          onClick={() => window.open(doc.pdf_url, '_blank')}
                          className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                          title="Download PDF"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-1">Your Question:</h4>
                      <p className="text-sm text-gray-100 bg-slate-600 rounded p-3">
                        {doc.user_message}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-1">AI Response:</h4>
                      <p className="text-sm text-gray-100 bg-slate-600 rounded p-3 line-clamp-3">
                        {doc.ai_response.substring(0, 200)}
                        {doc.ai_response.length > 200 && '...'}
                      </p>
                    </div>
                  </div>
                  
                  {doc.pdf_generated && (
                    <div className="mt-4 flex items-center text-green-400 text-sm">
                      <FileText className="h-4 w-4 mr-1" />
                      PDF document available for download
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIResponseDocsPage;