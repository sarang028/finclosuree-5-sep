import React, { useState, useEffect } from 'react';
import { documentApi, aiApi, deceasedApi } from '../services/apiServices';
import { DocumentItem, DocumentCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  FileUp,
  Sparkles,
  Trash2,
  Eye,
  X,
  Search,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deceasedId, setDeceasedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const { t } = useLanguage();
  const { isDemoMode } = useAuth();

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [docName, setDocName] = useState('');
  const [docCategory, setDocCategory] = useState<DocumentCategory>('Identity Proof');
  const [isUploading, setIsUploading] = useState(false);

  // Analysis Result Modal State
  const [activeAnalysisDoc, setActiveAnalysisDoc] = useState<DocumentItem | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fetchDocuments = async () => {
    try {
      const res = await documentApi.getAll({});
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
  }, []);

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
      setActiveAnalysisDoc(res.document || doc);
      fetchDocuments();
    } catch (err) {
      console.error('[AI Analysis Error]', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) || doc.category.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (activeTab === 'All') return true;
    if (activeTab === 'Insurance') return doc.category.includes('Insurance');
    if (activeTab === 'Bank') return doc.category.includes('Bank');
    if (activeTab === 'Identity') return doc.category === 'Death Certificate' || doc.category === 'Identity Proof';
    return true;
  });

  const categoriesTabs = [
    { label: 'All', count: documents.length },
    { label: 'Insurance', count: documents.filter(d => d.category.includes('Insurance')).length },
    { label: 'Bank', count: documents.filter(d => d.category.includes('Bank')).length },
    { label: 'Identity', count: documents.filter(d => d.category === 'Death Certificate' || d.category === 'Identity Proof').length },
  ];

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center">
            Documents Vault
            {isDemoMode && (
              <span className="ml-2 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 border border-amber-600">
                DEMO MODE
              </span>
            )}
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Verified financial & legal documents (9 Demo Entries)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl shadow-2xs"
            title="Search Documents"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents by name or category..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-finclosure-800 shadow-2xs"
          />
        </div>
      )}

      {/* Primary CTA Button */}
      <button
        onClick={() => setIsUploadModalOpen(true)}
        className="w-full py-3 px-4 bg-finclosure-800 hover:bg-finclosure-900 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center space-x-1.5"
      >
        <FileUp className="w-4 h-4" />
        <span>Upload Document</span>
      </button>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {categoriesTabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.label
                ? 'bg-finclosure-800 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Documents List Cards */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500 text-xs">Loading documents vault...</div>
      ) : filteredDocs.length > 0 ? (
        <div className="space-y-3">
          {filteredDocs.map((doc) => (
            <div
              key={doc._id}
              className="bg-white border border-slate-200 p-4 rounded-2xl shadow-2xs flex items-center justify-between hover:border-slate-300 transition-all cursor-pointer"
              onClick={() => handleRunAiAnalysis(doc)}
            >
              <div className="flex items-center space-x-3.5">
                {/* File Icon Badge */}
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xs font-extrabold text-slate-900">{doc.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {doc.category}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    PDF • {(doc.size ? (doc.size / (1024 * 1024)).toFixed(1) : '1.2')} MB
                    {doc.extractedData?.summary && ` • ${doc.extractedData.summary}`}
                  </p>

                  {isDemoMode && (
                    <span className="text-[9px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 inline-block mt-0.5">
                      ✓ AI Verified Demo File
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(doc._id);
                  }}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100"
                  title="Delete Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center text-slate-500">
          <FileText className="w-10 h-10 text-finclosure-800 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-900 mb-1">No documents found</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
            Upload death certificates, policy bonds or bank statements for financial closure.
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-finclosure-800 hover:bg-finclosure-900 rounded-xl"
          >
            Upload Document
          </button>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl relative space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Upload Document</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Life Insurance Policy Bond"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:border-finclosure-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Category</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value as DocumentCategory)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:border-finclosure-800 focus:outline-none"
                >
                  <option value="Death Certificate">Death Certificate</option>
                  <option value="Insurance Document">Insurance Document</option>
                  <option value="Bank Document">Bank / Financial Document</option>
                  <option value="Investment Document">Stock / Investment Document</option>
                  <option value="Identity Proof">KYC / Identity Proof</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Select File</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.jpg,.jpeg,.png,.docx"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3.5 bg-finclosure-800 hover:bg-finclosure-900 text-white font-bold text-xs rounded-2xl transition-all shadow-sm disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Upload Document'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI Extraction Modal */}
      {activeAnalysisDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 rounded-3xl relative space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-finclosure-800" />
                <h3 className="text-base font-extrabold text-slate-900">{activeAnalysisDoc.name}</h3>
              </div>
              <button onClick={() => setActiveAnalysisDoc(null)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-slate-500 font-bold block">AI Extracted Summary</span>
                <p className="text-slate-900 font-semibold leading-relaxed">
                  {activeAnalysisDoc.extractedData?.summary || 'Document verified successfully and attached to DEMO financial portfolio.'}
                </p>
              </div>

              {activeAnalysisDoc.extractedData?.extractedNames && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 font-bold block mb-1">Names Found</span>
                  <div className="flex flex-wrap gap-1">
                    {activeAnalysisDoc.extractedData.extractedNames.map((n, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-white text-slate-800 font-semibold border border-slate-200">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeAnalysisDoc.extractedData?.extractedNumbers && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 font-bold block mb-1">Reference Numbers / Amounts</span>
                  <div className="flex flex-wrap gap-1">
                    {activeAnalysisDoc.extractedData.extractedNumbers.map((num, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-white font-mono text-slate-900 font-bold border border-slate-200">
                        {num}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveAnalysisDoc(null)}
                  className="px-4 py-2 bg-finclosure-800 text-white font-bold text-xs rounded-xl"
                >
                  Close Document Viewer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
