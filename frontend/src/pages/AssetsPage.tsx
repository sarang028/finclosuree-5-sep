import React, { useState, useEffect } from 'react';
import { assetApi, aiApi, deceasedApi } from '../services/apiServices';
import { Asset, AssetCategory, RecordType } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Landmark,
  Sparkles,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  X,
  Building,
  ShieldAlert,
  CreditCard,
  HandCoins,
  FileCheck,
  Eye,
  EyeOff,
  MoreVertical,
} from 'lucide-react';

export const AssetsPage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deceasedId, setDeceasedId] = useState<string | null>(null);

  const { t } = useLanguage();
  const { isDemoMode } = useAuth();

  // Filters State
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<string>('All');
  const [showSearchInput, setShowSearchInput] = useState(false);

  // Add Asset Form State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<AssetCategory>('Bank Account');
  const [recordType, setRecordType] = useState<RecordType>('Asset');
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
      const res = await assetApi.getAll();
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
  }, []);

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deceasedId) return;

    try {
      await assetApi.create({
        deceasedId,
        name: name || `${institution} ${category}`,
        category,
        recordType,
        institution,
        accountOrPolicyNumber,
        estimatedValue: Number(estimatedValue) || 0,
        status: recordType === 'Liability' ? 'Outstanding' : recordType === 'Money to Recover' ? 'Recovery Pending' : 'Confirmed',
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

  const handleDeleteAsset = async (id: string) => {
    if (!confirm('Are you sure you want to remove this record?')) return;
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

  const formatCurrency = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Crore (₹${val.toLocaleString('en-IN')})`;
    }
    if (val >= 100000) {
      return `₹${val.toLocaleString('en-IN')} (${(val / 100000).toFixed(1)} Lakh)`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Helper status badge renderer
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Claim Not Started':
        return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">Claim Not Started</span>;
      case 'Policy Active / Claim Guidance Available':
        return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-300">Policy Active / Claim Guidance Available</span>;
      case 'Eligibility/Claim Pending':
        return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300">Eligibility/Claim Pending</span>;
      case 'Outstanding':
        return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300">Outstanding</span>;
      case 'Recovery Pending':
        return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-300">Recovery Pending</span>;
      case 'Confirmed':
        return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">Confirmed</span>;
      default:
        return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300">{status}</span>;
    }
  };

  // Filtering Logic
  const filteredAssets = assets.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.institution.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;

    if (activeTab === 'All') return true;
    if (activeTab === 'Assets') return item.recordType === 'Asset' || !item.recordType;
    if (activeTab === 'Liabilities') return item.recordType === 'Liability';
    if (activeTab === 'Money to Recover') return item.recordType === 'Money to Recover';
    if (activeTab === 'Bank & FD') return item.category === 'Bank Account' || item.category === 'Fixed Deposit';
    if (activeTab === 'Insurance') return item.category === 'Insurance' || item.category === 'Health Insurance';

    return true;
  });

  const categoryTabs = [
    { label: 'All', count: assets.length },
    { label: 'Assets', count: assets.filter(a => a.recordType === 'Asset' || !a.recordType).length },
    { label: 'Liabilities', count: assets.filter(a => a.recordType === 'Liability').length },
    { label: 'Money to Recover', count: assets.filter(a => a.recordType === 'Money to Recover').length },
    { label: 'Bank & FD', count: assets.filter(a => a.category === 'Bank Account' || a.category === 'Fixed Deposit').length },
    { label: 'Insurance', count: assets.filter(a => a.category === 'Insurance' || a.category === 'Health Insurance').length },
  ];

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center">
            Portfolio Records
            {isDemoMode && (
              <span className="ml-2 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 border border-amber-600">
                DEMO MODE
              </span>
            )}
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Assets, Liabilities & Money to be Recovered
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSearchInput(!showSearchInput)}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl shadow-2xs"
            title="Search Portfolio"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="p-2 text-finclosure-800 bg-emerald-50 border border-emerald-200 rounded-xl shadow-2xs"
            title="AI Scan Context"
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
            placeholder="Search assets, liabilities, receivables..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-finclosure-800 shadow-2xs"
          />
        </div>
      )}

      {/* Primary Add Record CTA Button */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="w-full py-3 px-4 bg-finclosure-800 hover:bg-finclosure-900 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center space-x-1.5"
      >
        <Plus className="w-4 h-4" />
        <span>Add Portfolio Record</span>
      </button>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {categoryTabs.map((tab) => (
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

      {/* Portfolio Items List */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500 text-xs">Loading portfolio records...</div>
      ) : filteredAssets.length > 0 ? (
        <div className="space-y-3">
          {filteredAssets.map((asset) => {
            const isLiability = asset.recordType === 'Liability';
            const isReceivable = asset.recordType === 'Money to Recover';
            const isAsset = !isLiability && !isReceivable;

            return (
              <div
                key={asset._id}
                className={`bg-white border p-4 rounded-2xl shadow-2xs flex items-center justify-between transition-all ${
                  isLiability
                    ? 'border-rose-200 hover:border-rose-300'
                    : isReceivable
                    ? 'border-sky-200 hover:border-sky-300'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  {/* Category Icon Badge */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      isLiability
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : isReceivable
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : asset.category === 'Insurance' || asset.category === 'Health Insurance'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : asset.category === 'Bank Account' || asset.category === 'Fixed Deposit'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {isLiability ? (
                      <CreditCard className="w-5 h-5" />
                    ) : isReceivable ? (
                      <HandCoins className="w-5 h-5" />
                    ) : asset.category.includes('Insurance') ? (
                      <ShieldAlert className="w-5 h-5" />
                    ) : asset.category === 'Bank Account' || asset.category === 'Fixed Deposit' ? (
                      <Building className="w-5 h-5" />
                    ) : (
                      <Landmark className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xs font-extrabold text-slate-900">{asset.name}</h3>
                      {asset.recordType && (
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                            isLiability
                              ? 'bg-rose-100 text-rose-900 border-rose-200'
                              : isReceivable
                              ? 'bg-sky-100 text-sky-900 border-sky-200'
                              : 'bg-emerald-100 text-emerald-900 border-emerald-200'
                          }`}
                        >
                          {asset.recordType}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500">
                      {asset.institution} • {asset.category}
                      {asset.accountOrPolicyNumber && ` (Ref: ${asset.accountOrPolicyNumber})`}
                    </p>

                    <div className="text-sm font-black text-slate-900">
                      {formatCurrency(asset.estimatedValue)}
                    </div>

                    <div className="pt-1 flex items-center space-x-2">
                      {renderStatusBadge(asset.status)}
                      {isDemoMode && (
                        <span className="text-[9px] font-semibold text-slate-400 italic">
                          [DEMO RECORD]
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between h-full space-y-4">
                  <button
                    onClick={() => handleDeleteAsset(asset._id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-semibold text-slate-400 hidden sm:inline">
                    ID: {asset._id.slice(-6)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center text-slate-500">
          <Landmark className="w-10 h-10 text-finclosure-800 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-900 mb-1">No records found</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
            Add assets, liabilities or loan receivables to organize financial closure.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-finclosure-800 hover:bg-finclosure-900 rounded-xl"
          >
            + Add Record
          </button>
        </div>
      )}

      {/* Add Record Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl relative space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Add Portfolio Record</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Record Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Asset', 'Liability', 'Money to Recover'] as RecordType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setRecordType(type)}
                      className={`py-2 px-2 text-center rounded-xl font-bold border transition-all ${
                        recordType === type
                          ? 'bg-finclosure-800 text-white border-finclosure-800'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as AssetCategory)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:border-finclosure-800 focus:outline-none"
                >
                  <option value="Bank Account">Bank Account</option>
                  <option value="Fixed Deposit">Fixed Deposit</option>
                  <option value="Insurance">Life Insurance</option>
                  <option value="Health Insurance">Health Insurance</option>
                  <option value="Stocks">Stocks / Investments</option>
                  <option value="Government Scheme">Government Scheme</option>
                  <option value="Home Loan">Home Loan</option>
                  <option value="Vehicle Loan">Vehicle Loan</option>
                  <option value="Friend/Relative Loan">Friend/Relative Loan</option>
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Title / Item Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Life Insurance Policy / Axis Bank FD"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:border-finclosure-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Institution / Debtor</label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. Axis Bank / LIC / Rakesh"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:border-finclosure-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Amount / Value (₹)</label>
                <input
                  type="number"
                  required
                  value={estimatedValue || ''}
                  onChange={(e) => setEstimatedValue(Number(e.target.value))}
                  placeholder="400000"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:border-finclosure-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any specific details or status notes"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:border-finclosure-800 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-finclosure-800 hover:bg-finclosure-900 text-white font-bold text-xs rounded-2xl transition-all shadow-sm"
              >
                Save Portfolio Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI Discover Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl relative space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-finclosure-800" />
                <h3 className="text-base font-extrabold text-slate-900">AI Portfolio Scan</h3>
              </div>
              <button onClick={() => setIsAiModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Paste financial notes, bank SMS messages, or policy references to scan.
            </p>

            <textarea
              rows={4}
              value={aiTextContext}
              onChange={(e) => setAiTextContext(e.target.value)}
              placeholder="e.g. Life insurance policy #LIC-POL-10029384 for 1 Crore..."
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-finclosure-800 focus:outline-none"
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
