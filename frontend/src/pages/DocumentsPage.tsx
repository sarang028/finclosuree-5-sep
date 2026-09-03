import React, { useState, useEffect } from 'react';
import { documentApi, aiApi, deceasedApi } from '../services/apiServices';
import { DocumentItem, DocumentCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  FileText,
  FileUp,
  Sparkles,
  Trash2,
  Eye,
  X,
} from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deceasedId, setDeceasedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { t } = useLanguage();

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [docName, setDocName] = useState('');
  const [docCategory, setDocCategory] = useState<DocumentCategory>('Death Certificate');
  const [isUploading, setIsUploading] = useState(false);

  // Analysis Result Modal State
  const [activeAnalysisDoc, setActiveAnalysisDoc] = useState<DocumentItem | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fetchDocuments = async () => {
    try {
      const res = await documentApi.getAll({
        category: selectedCategory || undefined,
      });
      setDocuments(res.documents);
    } catch (err) {
      console.error('[Fetch Docs Error]', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initDeceased = async () => {
      const pRes = await deceasedApi.getAll();
      if (pRes.profiles.length > 0) {
        setDeceasedId(pRes.profiles[0]._id);
      }
    };
    initDeceased();
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [selectedCategory]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !deceasedId) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('deceasedId', deceasedId);
      formData.append('category', docCategory);
      formData.append('name', docName || uploadFile.name);

      await documentApi.upload(formData);
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setDocName('');
      fetchDocuments();
    } catch (err) {
      console.error('[Upload Error]', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      await documentApi.delete(id);
      fetchDocuments();
    } catch (err) {
      console.error('[Delete Doc Error]', err);
    }
  };

  const handleRunAiAnalysis = async (doc: DocumentItem) => {
    setIsAnalyzing(true);
    setActiveAnalysisDoc(doc);
    try {
      const res = await aiApi.analyzeDocument(doc._id);
      setActiveAnalysisDoc(res.document);
      fetchDocuments();
    } catch (err) {
      console.error('[AI Analysis Error]', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const categoryList = [
    { label: 'All', value: '' },
    { label: 'Death Cert', value: 'Death Certificate' },
    { label: 'Identity Proof', value: 'Identity Proof' },
    { label: 'Nominee Proof', value: 'Nominee Proof' },
    { label: 'Bank Doc', value: 'Bank Document' },
    { label: 'Insurance', value: 'Insurance Document' },
    { label: 'Investment', value: 'Investment Document' },
    { label: 'Pension', value: 'Pension Document' },
    { label: 'Claim Form', value: 'Claim Form' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{t('navDocuments')}</h1>
          <p className="text-xs text-slate-400 mt-0.5">Secure, categorized document repository with AI parsing capabilities.</p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-xl transition-all shadow-md flex items-center justify-center"
        >
          <FileUp className="w-4 h-4 mr-1.5" /> Upload Document
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categoryList.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.value
                ? 'bg-teal-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Loading document records...</div>
      ) : documents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div key={doc._id} className="glass-card p-4 sm:p-5 rounded-2xl flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-teal-400 border border-slate-800">
                    {doc.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleRunAiAnalysis(doc)}
                      className="text-teal-400 hover:text-teal-300 p-1.5 rounded-lg hover:bg-slate-800"
                      title="Run AI Document Extraction"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(doc._id)} className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white truncate mb-1">{doc.name}</h3>
                <p className="text-[11px] text-slate-400">
                  Uploaded {new Date(doc.createdAt).toLocaleDateString()} • {(doc.size / 1024).toFixed(0)} KB
                </p>

                {doc.extractedData?.summary && (
                  <div className="mt-3 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
                    <strong className="text-teal-400 block mb-0.5">AI Summary:</strong>
                    {doc.extractedData.summary}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400">Status: {doc.status}</span>

                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-teal-300 border border-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center"
                >
                  <Eye className="w-3.5 h-3.5 mr-1" /> View
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-8 sm:p-12 rounded-2xl text-center text-slate-400">
          <FileText className="w-10 h-10 text-teal-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No documents in vault</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Upload death certificates, PAN/Aadhaar identity proofs, or insurance bonds to enable AI parsing.
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-xl transition-all"
          >
            Upload First Document
          </button>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-5 sm:p-6 rounded-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Upload New Document</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Document Display Name</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Municipal Death Certificate"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Category</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value as DocumentCategory)}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="Death Certificate">Death Certificate</option>
                  <option value="Identity Proof">Identity Proof</option>
                  <option value="Nominee Proof">Nominee Proof</option>
                  <option value="Legal Heir Proof">Legal Heir Proof</option>
                  <option value="Bank Document">Bank Document</option>
                  <option value="Insurance Document">Insurance Document</option>
                  <option value="Investment Document">Investment Document</option>
                  <option value="Pension Document">Pension Document</option>
                  <option value="Claim Form">Claim Form</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Choose File</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.jpg,.jpeg,.png,.docx"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 shadow-md"
              >
                {isUploading ? 'Uploading & Processing...' : 'Upload Document'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI Extraction Analysis Modal */}
      {activeAnalysisDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-5 sm:p-6 rounded-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <h3 className="text-base font-bold text-white">AI Document Understanding</h3>
              </div>
              <button onClick={() => setActiveAnalysisDoc(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isAnalyzing ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                AI is extracting names, numbers, and dates...
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-semibold block mb-1">Document Summary</span>
                  <p className="text-slate-200">{activeAnalysisDoc.extractedData?.summary}</p>
                </div>

                {activeAnalysisDoc.extractedData?.extractedNames && (
                  <div>
                    <span className="text-slate-400 font-semibold block mb-1">Extracted Names</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeAnalysisDoc.extractedData.extractedNames.map((n, i) => (
                        <span key={i} className="px-2 py-1 bg-teal-950 text-teal-300 border border-teal-800/60 rounded">
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeAnalysisDoc.extractedData?.extractedNumbers && (
                  <div>
                    <span className="text-slate-400 font-semibold block mb-1">Extracted Numbers / Policy IDs</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeAnalysisDoc.extractedData.extractedNumbers.map((num, i) => (
                        <span key={i} className="px-2 py-1 bg-sky-950 text-sky-300 border border-sky-800/60 rounded font-mono">
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
