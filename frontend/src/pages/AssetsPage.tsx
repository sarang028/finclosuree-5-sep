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
} from 'lucide-react';

export const AssetsPage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deceasedId, setDeceasedId] = useState<string | null>(null);

  const { t } = useLanguage();

  // Filters State
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Add Asset Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<AssetCategory>('Bank Account');
  const [institution, setInstitution] = useState('');
  const [accountOrPolicyNumber, setAccountOrPolicyNumber] = useState('');
  const [estimatedValue, setEstimatedValue] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // AI Discover Assets Modal State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiTextContext, setAiTextContext] = useState('');
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveredResult, setDiscoveredResult] = useState<any[] | null>(null);

  const fetchAssets = async () => {
    try {
      const res = await assetApi.getAll({
        search: search || undefined,
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
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
  }, [search, categoryFilter, statusFilter]);

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deceasedId) return;

    try {
      await assetApi.create({
        deceasedId,
        name,
        category,
        institution,
        accountOrPolicyNumber,
        estimatedValue: Number(estimatedValue) || 0,
        status: 'Known',
        notes,
      });
      setIsAddModalOpen(false);
      setName('');
      setInstitution('');
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
      const res = await aiApi.discoverAssets(deceasedId, aiTextContext);
      setDiscoveredResult(res.potentialAssets);
      fetchAssets();
    } catch (err) {
      console.error('[AI Discovery Error]', err);
    } finally {
      setIsDiscovering(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{t('navAssets')}</h1>
          <p className="text-xs text-slate-400 mt-0.5">Discover, confirm, and organize bank accounts, policies, and investments.</p>
        </div>

        <div className="flex items-center space-x-2.5 w-full sm:w-auto">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex-1 sm:flex-initial px-3.5 py-2 text-xs font-semibold text-teal-300 bg-teal-950/80 hover:bg-teal-900 border border-teal-800/60 rounded-xl transition-all flex items-center justify-center shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
            <span>Discover with AI</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-initial px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-xl transition-all shadow-md flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            <span>{t('addAsset')}</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-card p-3.5 sm:p-4 rounded-xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by asset name, institution, or policy number..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 sm:w-auto px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="Bank Account">{t('catBankAccount')}</option>
            <option value="Fixed Deposit">{t('catFixedDeposit')}</option>
            <option value="Insurance">{t('catInsurance')}</option>
            <option value="Investment">{t('catInvestment')}</option>
            <option value="Pension">{t('catPension')}</option>
            <option value="Digital Asset">{t('catDigitalAsset')}</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 sm:w-auto px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Known">{t('statusKnown')}</option>
            <option value="Potential">{t('statusPotential')}</option>
            <option value="Confirmed">{t('statusConfirmed')}</option>
            <option value="Claim Started">{t('statusClaimStarted')}</option>
            <option value="Claim Completed">{t('statusClaimCompleted')}</option>
          </select>
        </div>
      </div>

      {/* Asset Cards Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Loading portfolio assets...</div>
      ) : assets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => {
            const isPotential = asset.status === 'Potential';
            return (
              <div
                key={asset._id}
                className={`glass-card p-4 sm:p-5 rounded-2xl border transition-all ${
                  isPotential
                    ? 'border-amber-700/60 bg-amber-950/20'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-teal-400 border border-slate-800">
                      {asset.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white mt-1">{asset.name}</h3>
                    <p className="text-xs text-slate-400 font-medium">{asset.institution}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteAsset(asset._id)}
                    className="text-slate-500 hover:text-rose-400 p-1.5 transition-colors rounded-lg hover:bg-rose-950/40"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {asset.accountOrPolicyNumber && (
                  <p className="text-xs font-mono text-slate-300 bg-slate-900/60 px-2.5 py-1 rounded border border-slate-800 mb-3 inline-block">
                    Ref: {asset.accountOrPolicyNumber}
                  </p>
                )}

                {asset.estimatedValue > 0 && (
                  <div className="text-sm font-bold text-emerald-400 mb-3">
                    ₹{asset.estimatedValue.toLocaleString()} <span className="text-xs font-normal text-slate-500">(Approx)</span>
                  </div>
                )}

                {/* Status Badge & Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      asset.status === 'Confirmed'
                        ? 'bg-teal-950 text-teal-300 border border-teal-800'
                        : asset.status === 'Potential'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : asset.status === 'Claim Completed'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-900 text-slate-300 border border-slate-800'
                    }`}
                  >
                    {asset.status}
                  </span>

                  {isPotential ? (
                    <button
                      onClick={() => handleConfirmAsset(asset._id)}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-lg transition-all flex items-center shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {t('confirm')}
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-medium">Verified</span>
                  )}
                </div>

                {isPotential && asset.evidence && (
                  <div className="mt-3 p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/40 text-[11px] text-amber-200">
                    <strong>AI Evidence:</strong> {asset.evidence}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card p-8 sm:p-12 rounded-2xl text-center text-slate-400">
          <Landmark className="w-10 h-10 text-teal-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No assets found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Start by adding known bank accounts, insurance policies, or run AI discovery to scan financial notes.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-xl transition-all"
          >
            Add First Asset
          </button>
        </div>
      )}

      {/* Add Asset Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-5 sm:p-6 rounded-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">{t('addAsset')}</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. HDFC Savings Account"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AssetCategory)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
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
                  <label className="block text-slate-300 font-medium mb-1">Institution</label>
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. HDFC Bank"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Account/Policy Number</label>
                  <input
                    type="text"
                    value={accountOrPolicyNumber}
                    onChange={(e) => setAccountOrPolicyNumber(e.target.value)}
                    placeholder="e.g. 5010098124"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Approx Value (₹)</label>
                  <input
                    type="number"
                    value={estimatedValue}
                    onChange={(e) => setEstimatedValue(Number(e.target.value))}
                    placeholder="e.g. 150000"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional context, branch details..."
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition-all shadow-md"
              >
                {t('save')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI Discover Assets Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-5 sm:p-6 rounded-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <h3 className="text-base font-bold text-white">AI Asset Discovery Scan</h3>
              </div>
              <button onClick={() => setIsAiModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Enter any financial text snippets, email excerpts, tax certificates, or bank references. AI will analyze the content and identify potential assets.
            </p>

            <textarea
              rows={4}
              value={aiTextContext}
              onChange={(e) => setAiTextContext(e.target.value)}
              placeholder="e.g. Received SBI Life policy renewal notice #POL-99281. Also found interest credit from HDFC fixed deposit..."
              className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-teal-500 focus:outline-none"
            />

            <button
              onClick={handleRunAiDiscovery}
              disabled={isDiscovering}
              className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center disabled:opacity-50"
            >
              {isDiscovering ? 'Scanning Text & Documents...' : 'Run Discovery Scan'}
            </button>

            {discoveredResult && (
              <div className="mt-4 p-3 bg-teal-950/60 border border-teal-800/60 rounded-xl text-xs text-teal-200">
                ✨ Discovered <strong>{discoveredResult.length} potential asset(s)</strong>. They have been added to your portfolio marked as "Potential — requiring confirmation".
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
