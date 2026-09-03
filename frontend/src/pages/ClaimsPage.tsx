import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { claimApi, assetApi, deceasedApi } from '../services/apiServices';
import { Claim, Asset } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { FileCheck, Plus, ArrowRight, X } from 'lucide-react';

export const ClaimsPage: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deceasedId, setDeceasedId] = useState<string | null>(null);

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
        claimReferenceNumber: claimRefNumber,
        notes,
      });
      setIsModalOpen(false);
      navigate(`/claims/${res.claim._id}`);
    } catch (err) {
      console.error('[Create Claim Error]', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{t('navClaims')}</h1>
          <p className="text-xs text-slate-400 mt-0.5">Track multi-step claim settlement journeys across institutions.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-xl transition-all shadow-md flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-1" /> Initiate Claim
        </button>
      </div>

      {/* Claims List */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Loading active claims...</div>
      ) : claims.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {claims.map((claim) => {
            const assetObj = typeof claim.assetId === 'object' ? claim.assetId : null;
            return (
              <div
                key={claim._id}
                onClick={() => navigate(`/claims/${claim._id}`)}
                className="glass-card glass-card-hover p-5 sm:p-6 rounded-2xl border-slate-800 cursor-pointer space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                      {claim.status}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white mt-2">{claim.institution}</h3>
                    <p className="text-xs text-slate-400 font-medium">{claim.claimType}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-extrabold text-white">{claim.overallProgress}%</span>
                    <span className="text-[10px] text-teal-400 font-semibold block uppercase">Progress</span>
                  </div>
                </div>

                {assetObj && (
                  <div className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between flex-wrap gap-2">
                    <span>Asset: <strong>{assetObj.name}</strong></span>
                    {assetObj.estimatedValue > 0 && (
                      <span className="font-bold text-emerald-400">₹{assetObj.estimatedValue.toLocaleString()}</span>
                    )}
                  </div>
                )}

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-sky-500 transition-all duration-500"
                      style={{ width: `${claim.overallProgress}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-teal-400 font-semibold">
                  <span>Open Detailed Step Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card p-8 sm:p-12 rounded-2xl text-center text-slate-400">
          <FileCheck className="w-10 h-10 text-teal-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No active claims initiated yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Select a confirmed financial asset from your portfolio to initiate step-by-step claim settlement.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-xl transition-all"
          >
            Initiate First Claim
          </button>
        </div>
      )}

      {/* Create Claim Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-5 sm:p-6 rounded-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Initiate New Financial Claim</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClaim} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Select Confirmed Asset</label>
                <select
                  required
                  value={selectedAssetId}
                  onChange={(e) => handleAssetSelect(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
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
                <label className="block text-slate-300 font-medium mb-1">Institution Name</label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. LIC of India"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Claim Type</label>
                <input
                  type="text"
                  required
                  value={claimType}
                  onChange={(e) => setClaimType(e.target.value)}
                  placeholder="e.g. Nominee Death Settlement"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Claim Reference Number (Optional)</label>
                <input
                  type="text"
                  value={claimRefNumber}
                  onChange={(e) => setClaimRefNumber(e.target.value)}
                  placeholder="e.g. CLM-LIC-2026-9812"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition-all shadow-md"
              >
                Create Claim & Generate Checklist
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
