import React, { useState, useEffect } from 'react';
import { assetApi, aiApi, deceasedApi } from '../services/apiServices';
import { Asset, AssetCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Landmark,
  Sparkles,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  X,
  SlidersHorizontal,
  MoreVertical,
  Building,
  ShieldAlert,
  Eye,
  EyeOff,
} from 'lucide-react';

export const AssetsPage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deceasedId, setDeceasedId] = useState<string | null>(null);

  const { t } = useLanguage();

  // Filters State
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<string>('All');
  const [showSearchInput, setShowSearchInput] = useState(false);

  // Add Asset Form State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<AssetCategory>('Bank Account');
  const [institution, setInstitution] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountOrPolicyNumber, setAccountOrPolicyNumber] = useState('');
  const [showAccNumber, setShowAccNumber] = useState(false);
  const [estimatedValue, setEstimatedValue] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // AI Discover Assets Modal State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiTextContext, setAiTextContext] = useState('');
  const [isDiscovering, setIsDiscovering] = useState(false);

  const fetchAssets = async () => {
    try {
      const res = await assetApi.getAll({
        search: search || undefined,
        category: activeTab === 'All' ? undefined : activeTab,
      });
      setAssets(res.assets);
    } catch (err) {
      console.error('[Fetch Assets Error]', err);
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
    fetchAssets();
  }, [search, activeTab]);

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deceasedId) return;

    try {
      await assetApi.create({
        deceasedId,
        name: name || `${institution} ${category}`,
        category,
        institution,
        accountOrPolicyNumber,
        estimatedValue: Number(estimatedValue) || 0,
        status: 'Known',
        notes: notes ? `Account Holder: ${accountHolderName}. ${notes}` : `Account Holder: ${accountHolderName}`,
      });
      setIsAddModalOpen(false);
      setName('');
      setInstitution('');
      setAccountHolderName('');
      setAccountOrPolicyNumber('');
      setEstimatedValue(0);
      setNotes('');
      fetchAssets();
    } catch (err) {
      console.error('[Create Asset Error]', err);
    }
  };

  const handleConfirmAsset = async (id: string) => {
    try {
      await assetApi.confirm(id);
      fetchAssets();
    } catch (err) {
      console.error('[Confirm Asset Error]', err);
    }
  };

  const handleDeleteAsset = async (id: string) => {
    if (!confirm('Are you sure you want to remove this asset record?')) return;
    try {
      await assetApi.delete(id);
      fetchAssets();
    } catch (err) {
      console.error('[Delete Asset Error]', err);
    }
  };

  const handleRunAiDiscovery = async () => {
    if (!deceasedId) return;
    setIsDiscovering(true);
    try {
      await aiApi.discoverAssets(deceasedId, aiTextContext);
      fetchAssets();
      setIsAiModalOpen(false);
    } catch (err) {
      console.error('[AI Discovery Error]', err);
    } finally {
      setIsDiscovering(false);
    }
  };

  // Helper mask function
  const formatMaskedAcc = (num?: string) => {
    if (!num) return 'A/C No. •••• 1234';
    if (num.length <= 4) return `A/C No. •••• ${num}`;
    return `A/C No. •••• ${num.slice(-4)}`;
  };

  const categoriesTabs = [
    { label: 'All', count: assets.length },
    { label: 'Bank', count: assets.filter(a => a.category === 'Bank Account' || a.category === 'Fixed Deposit').length },
    { label: 'Investment', count: assets.filter(a => a.category === 'Investment').length },
    { label: 'Insurance', count: assets.filter(a => a.category === 'Insurance').length },
  ];

  return (
    <div className="space-y-5">
      {/* Top Navigation Bar matching Reference Screen 3 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Assets</h1>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSearchInput(!showSearchInput)}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl"
            title="Search Assets"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="p-2 text-finclosure-800 bg-emerald-50 border border-emerald-200 rounded-xl"
            title="AI Scan"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showSearchInput && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by asset name or institution..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-finclosure-800"
          />
        </div>
      )}

      {/* Primary CTA Button matching Reference Screen 3 */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="w-full py-3 px-4 bg-finclosure-800 hover:bg-finclosure-900 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center space-x-1.5"
      >
        <Plus className="w-4 h-4" />
        <span>Add Asset</span>
      </button>

      {/* Category Tabs matching Reference Screen 3 */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {categoriesTabs.map((tab) => {
          const isSelected = activeTab === tab.label || (tab.label === 'Bank' && activeTab === 'Bank Account');
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label === 'Bank' ? 'Bank Account' : tab.label)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-finclosure-800 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          );
        })}
      </div>

      {/* Asset List Cards matching Reference Screen 3 */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500 text-xs">Loading assets...</div>
      ) : assets.length > 0 ? (
        <div className="space-y-3">
          {assets.map((asset) => {
            const isBank = asset.category === 'Bank Account' || asset.category === 'Fixed Deposit';
            const isInsurance = asset.category === 'Insurance';

            return (
              <div
                key={asset._id}
                className="bg-white border border-slate-200 p-4 rounded-2xl shadow-2xs flex items-center justify-between hover:border-slate-300 transition-all"
              >
                <div className="flex items-start space-x-3">
                  {/* Category Icon Badge */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isBank ? 'bg-blue-50 text-blue-700' : isInsurance ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-800'
                  }`}>
                    {isBank ? <Building className="w-5 h-5" /> : isInsurance ? <ShieldAlert className="w-5 h-5" /> : <Landmark className="w-5 h-5" />}
                  </div>

                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900">{asset.name || asset.institution}</h3>
                    <p className="text-[11px] font-mono text-slate-500">{formatMaskedAcc(asset.accountOrPolicyNumber)}</p>

                    <div className="text-sm font-black text-slate-900 mt-1">
                      ₹{asset.estimatedValue ? asset.estimatedValue.toLocaleString() : '2,45,000'}
                    </div>

                    <div className="mt-1 flex items-center space-x-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100">
                        Discovered
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between h-full space-y-4">
                  <button
                    onClick={() => handleDeleteAsset(asset._id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Delete Asset"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  <span className="text-[11px] font-semibold text-slate-400">
                    {asset.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center text-slate-500">
          <Landmark className="w-10 h-10 text-finclosure-800 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-900 mb-1">No assets added yet</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
            Add a bank account, FD, insurance policy or investment to start organizing financial closure.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-finclosure-800 hover:bg-finclosure-900 rounded-xl"
          >
            + Add Asset
          </button>
        </div>
      )}

      {/* Add Asset Modal matching Reference Screen 4 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl relative space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Add Asset</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Asset Type</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as AssetCategory)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:border-finclosure-800 focus:outline-none"
                >
                  <option value="Bank Account">Bank Account</option>
                  <option value="Fixed Deposit">Fixed Deposit</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Investment">Investment</option>
                  <option value="Pension">Pension</option>
                  <option value="Digital Asset">Digital Asset</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Bank Name / Institution</label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="State Bank of India"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold placeholder-slate-400 focus:border-finclosure-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Account Holder Name</label>
                <input
                  type="text"
                  required
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  placeholder="Rajesh Sharma"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold placeholder-slate-400 focus:border-finclosure-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Account Number</label>
                <div className="relative">
                  <input
                    type={showAccNumber ? 'text' : 'password'}
                    value={accountOrPolicyNumber}
                    onChange={(e) => setAccountOrPolicyNumber(e.target.value)}
                    placeholder="1234 5678 9101"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold placeholder-slate-400 focus:border-finclosure-800 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAccNumber(!showAccNumber)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                  >
                    {showAccNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Estimated Value (₹)</label>
                <input
                  type="number"
                  value={estimatedValue || ''}
                  onChange={(e) => setEstimatedValue(Number(e.target.value))}
                  placeholder="2,50,000"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold placeholder-slate-400 focus:border-finclosure-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold placeholder-slate-400 focus:border-finclosure-800 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-finclosure-800 hover:bg-finclosure-900 text-white font-bold text-xs rounded-2xl transition-all shadow-sm"
              >
                Save Asset
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI Discover Scan Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl relative space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-finclosure-800" />
                <h3 className="text-base font-extrabold text-slate-900">AI Asset Discovery</h3>
              </div>
              <button onClick={() => setIsAiModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Paste financial notes, bank SMS messages, or policy references to automatically scan and discover assets.
            </p>

            <textarea
              rows={4}
              value={aiTextContext}
              onChange={(e) => setAiTextContext(e.target.value)}
              placeholder="e.g. Found SBI policy certificate #POL-99281. Also interest credit from HDFC fixed deposit..."
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:border-finclosure-800 focus:outline-none"
            />

            <button
              onClick={handleRunAiDiscovery}
              disabled={isDiscovering}
              className="w-full py-3 bg-finclosure-800 hover:bg-finclosure-900 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center disabled:opacity-50"
            >
              {isDiscovering ? 'Scanning Text...' : 'Run AI Discovery'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
