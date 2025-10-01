import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { getBizDocuments, uploadBizDocument, deleteBizDocument, BizDocument } from '../lib/supabaseHelpers';
import { ArrowLeft, Upload, FileText, Trash2, Download } from 'lucide-react';

const MyBizDocsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<BizDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  const loadDocuments = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const docs = await getBizDocuments(user.id);
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const uploadedDoc = await uploadBizDocument(user.id, file);
      if (uploadedDoc) {
        setDocuments(prev => [uploadedDoc, ...prev]);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (doc: BizDocument) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const success = await deleteBizDocument(doc.id, doc.file_path);
      if (success) {
        setDocuments(prev => prev.filter(d => d.id !== doc.id));
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document. Please try again.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading your documents...</p>
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
            <h1 className="text-2xl font-bold">My Business Documents</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Upload Section */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload New Document</h2>
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 mb-4">
              Upload business documents, contracts, certificates, or any important files
            </p>
            <label className="inline-block">
              <input
                type="file"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              />
              <span className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors disabled:opacity-50">
                {uploading ? 'Uploading...' : 'Choose File'}
              </span>
            </label>
            <p className="text-sm text-gray-400 mt-2">
              Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB)
            </p>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">Your Documents</h2>
          
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 text-lg mb-2">No documents uploaded yet</p>
              <p className="text-gray-400">Upload your first business document to get started</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-slate-700 rounded-lg p-4 flex items-center justify-between hover:bg-slate-600 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <FileText className="h-8 w-8 text-blue-400" />
                    <div>
                      <h3 className="font-medium text-white">{doc.file_name}</h3>
                      <p className="text-sm text-gray-400">
                        {formatFileSize(doc.file_size || 0)} • 
                        Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => window.open(`/api/download/${doc.file_path}`, '_blank')}
                      className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                      title="Download"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBizDocsPage;