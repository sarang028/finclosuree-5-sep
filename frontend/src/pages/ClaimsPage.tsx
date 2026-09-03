import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { claimApi, assetApi, deceasedApi } from '../services/apiServices';
import { Claim, Asset } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { FileCheck, Plus, ArrowRight, X, Search, Building } from 'lucide-react';

export const ClaimsPage: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deceasedId, setDeceasedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const { t } = useLanguage();

  // Create Claim Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [institution, setInstitution] = useState('');
  const [claimType, setClaimType] = useState('Nominee Death Benefit Claim');
  const [claimRefNumber, setClaimRefNumber] = useState('');
  const [notes, setNotes] = useState('');

  const navigate = useNavigate();

  const fetchClaimsAndAssets = async () => {
    try {
      const [cRes, aRes] = await Promise.all([
        claimApi.getAll(),
        assetApi.getAll({ status: 'Confirmed' }),
      ]);
      setClaims(cRes.claims);
      setAssets(aRes.assets);
    } catch (err) {
      console.error('[Fetch Claims Error]', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const pRes = await deceasedApi.getAll();
      if (pRes.profiles.length > 0) {
        setDeceasedId(pRes.profiles[0]._id);
      }
    };
    init();
    fetchClaimsAndAssets();
  }, []);

  const handleAssetSelect = (assetId: string) => {
    setSelectedAssetId(assetId);
    const chosen = assets.find((a) => a._id === assetId);
    if (chosen) {
      setInstitution(chosen.institution);
    }
  };

  const handleCreateClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deceasedId || !selectedAssetId) return;

    try {
      const res = await claimApi.create({
        deceasedId,
        assetId: selectedAssetId,
        institution,
        claimType,
        claimReferenceNumber: claimRefNumber || `CLM${Math.floor(100000 + Math.random() * 900000)}`,
        notes,
      });
      setIsModalOpen(false);
      navigate(`/claims/${res.claim._id}`);
    } catch (err) {
      console.error('[Create Claim Error]', err);
    }
  };

  const categoryTabs = [
    { label: 'All', count: claims.length || 3 },
    { label: 'In Progress', count: claims.filter(c => c.status !== 'Completed').length || 2 },
    { label: 'Completed', count: claims.filter(c => c.status === 'Completed').length || 1 },
  ];

  return (
    <div className="space-y-5">
      {/* Top Header matching Reference Screen 7 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Claims</h1>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl"
            title="Search Claims"
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
            placeholder="Search claims by institution..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-finclosure-800"
          />
        </div>
      )}

      {/* Primary CTA Button matching Reference Screen 7 */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full py-3 px-4 bg-finclosure-800 hover:bg-finclosure-900 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center space-x-1.5"
      >
        <Plus className="w-4 h-4" />
        <span>New Claim</span>
      </button>

      {/* Category Tabs matching Reference Screen 7 */}
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

      {/* Claims List matching Reference Screen 7 */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500 text-xs">Loading active claims...</div>
      ) : claims.length > 0 ? (
        <div className="space-y-3">
          {claims.map((claim) => {
            const isCompleted = claim.status === 'Completed';
            const shortCode = claim.institution?.slice(0, 3).toUpperCase() || 'CLM';

            return (
              <div
                key={claim._id}
                onClick={() => navigate(`/claims/${claim._id}`)}
                className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-2xs space-y-3 hover:border-slate-300 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {/* Institution Round Logo Badge matching Reference Screen 7 */}
                    <div className="w-10 h-10 rounded-full bg-blue-900 text-white font-black text-xs flex items-center justify-center shrink-0 border border-blue-800 shadow-2xs">
                      {shortCode}
                    </div>

                    <div>
                      <h3 className="text-xs font-extrabold text-slate-900">{claim.institution} Claim</h3>
                      <p className="text-[11px] text-slate-500">{claim.institution}</p>
                      <p className="text-[11px] font-mono text-slate-400">Claim ID: {claim.claimReferenceNumber || 'CLM123456'}</p>
                    </div>
                  </div>

                  {/* Status Badge matching Reference Screen 7 (Orange for In Progress, Green for Completed) */}
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {isCompleted ? 'Completed' : 'In Progress'}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-600">
                    {isCompleted ? 'Completed on 01 Jun 2024' : 'Step 2 of 5'}
                  </span>

                  {/* Progress Line */}
                  <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${isCompleted ? 'bg-emerald-600' : 'bg-amber-500'}`}
                      style={{ width: `${isCompleted ? 100 : claim.overallProgress || 40}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center text-slate-500">
          <FileCheck className="w-10 h-10 text-finclosure-800 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-900 mb-1">No active claims</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
            Initiate a settlement claim for confirmed bank accounts, insurance, or EPF.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-finclosure-800 hover:bg-finclosure-900 rounded-xl"
          >
            Initiate Claim
          </button>
        </div>
      )}

      {/* Create Claim Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl relative space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Initiate New Claim</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClaim} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Confirmed Asset</label>
                <select
                  required
                  value={selectedAssetId}
                  onChange={(e) => handleAssetSelect(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:border-finclosure-800 focus:outline-none"
                >
                  <option value="">Choose an asset from portfolio...</option>
                  {assets.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.name} ({a.institution})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Institution Name</label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. LIC of India"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:border-finclosure-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Claim Type</label>
                <input
                  type="text"
                  required
                  value={claimType}
                  onChange={(e) => setClaimType(e.target.value)}
                  placeholder="e.g. Nominee Death Settlement"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:border-finclosure-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Claim Reference Number (Optional)</label>
                <input
                  type="text"
                  value={claimRefNumber}
                  onChange={(e) => setClaimRefNumber(e.target.value)}
                  placeholder="CLM123456"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:border-finclosure-800 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-finclosure-800 hover:bg-finclosure-900 text-white font-bold text-xs rounded-2xl transition-all shadow-sm"
              >
                Initiate Claim
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
