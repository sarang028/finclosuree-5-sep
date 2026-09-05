import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck,
  Check,
  Video,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  BadgeCheck,
  X,
  UserCheck,
} from 'lucide-react';

export const ActiveClaimCard: React.FC = () => {
  const navigate = useNavigate();
  const [isJourneyCompleted, setIsJourneyCompleted] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [isKycProcessing, setIsKycProcessing] = useState(false);

  const handleStartVideoKyc = () => {
    setIsKycModalOpen(true);
  };

  const handleCompleteDemoKyc = () => {
    setIsKycProcessing(true);
    setTimeout(() => {
      setIsKycProcessing(false);
      setIsKycModalOpen(false);
      setIsJourneyCompleted(true);
    }, 1500);
  };

  const steps = [
    { id: 1, name: 'Submitted', date: '10 Jan 2025', status: 'Completed' },
    { id: 2, name: 'Processing', date: '11 Jan 2025', status: 'Completed' },
    { id: 3, name: 'Verification', date: '12 Jan 2025', status: isJourneyCompleted ? 'Completed' : 'Completed' },
    { id: 4, name: 'Video KYC', date: isJourneyCompleted ? '12 Jan 2025' : 'Pending', status: isJourneyCompleted ? 'Completed' : 'Current' },
    { id: 5, name: 'Approved', date: isJourneyCompleted ? '12 Jan 2025' : 'Pending', status: isJourneyCompleted ? 'Completed' : 'Pending' },
    { id: 6, name: 'Disbursed', date: isJourneyCompleted ? '12 Jan 2025' : 'Pending', status: isJourneyCompleted ? 'Completed' : 'Pending' },
  ];

  return (
    <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-3xl shadow-2xs space-y-5">
      {/* Top Header Strip matching Reference Screen */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-3 flex-wrap gap-y-1">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
            <FileCheck className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center space-x-2 flex-wrap">
              <h2 className="text-base font-black text-slate-900 tracking-tight">Active Claim</h2>
              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Life Insurance Policy
              </span>
            </div>

            <div className="flex items-center space-x-3 text-xs text-slate-500 font-mono mt-0.5">
              <span>Claim ID: <strong>FC-DEMO-2026-001</strong></span>
              <span>•</span>
              <span>Claim Amount: <strong className="text-emerald-800 font-extrabold font-sans">₹1,00,00,000</strong></span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/claims/demo_claim_1')}
          className="text-xs font-bold text-slate-600 hover:text-emerald-800 flex items-center shrink-0"
        >
          <span>View Full Details</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </button>
      </div>

      {/* Success Banner if Completed */}
      {isJourneyCompleted && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl border border-emerald-700 shadow-md flex items-center justify-between flex-wrap gap-2 animate-fadeIn">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-white text-emerald-700 flex items-center justify-center font-black">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
            <div>
              <h4 className="text-sm font-black tracking-tight">Claim Approved Successfully 🎉</h4>
              <p className="text-xs font-bold text-emerald-100">
                ₹1,00,00,000 approved • Disbursement initiated to Axis Bank A/C •••• 8410
              </p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold px-3 py-1 bg-emerald-900 text-emerald-200 rounded-full uppercase">
            Status: DISBURSED
          </span>
        </div>
      )}

      {/* Horizontal Timeline Stepper matching Reference Screen */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-2">
        {/* Timeline Steps Line */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 relative">
          {steps.map((step, idx) => {
            const isCompleted = step.status === 'Completed';
            const isCurrent = step.status === 'Current';

            return (
              <div key={step.id} className="flex flex-col items-center text-center space-y-1.5 relative">
                {/* Node Circle Icon matching reference */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs shadow-2xs transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white border-2 border-emerald-600'
                      : isCurrent
                      ? 'bg-blue-600 text-white border-2 border-blue-600 ring-4 ring-blue-100 animate-pulse'
                      : 'bg-white text-slate-400 border-2 border-slate-300'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : isCurrent ? (
                    <Video className="w-4.5 h-4.5" />
                  ) : (
                    step.id
                  )}
                </div>

                <div>
                  <span className={`text-xs font-extrabold block ${isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block">{step.date}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Start Video KYC CTA Button matching Reference Screen */}
        <div className="shrink-0 flex justify-center lg:justify-end">
          {isJourneyCompleted ? (
            <button
              onClick={() => setIsJourneyCompleted(false)}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-all"
            >
              Reset Demo Claim
            </button>
          ) : (
            <button
              onClick={handleStartVideoKyc}
              className="px-5 py-3.5 bg-[#064E3B] hover:bg-[#043E2F] text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center space-x-2 group"
            >
              <Video className="w-4 h-4 text-emerald-300" />
              <span>Start Video KYC</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* Simulated DEMO Video KYC Modal */}
      {isKycModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 max-w-lg w-full p-6 rounded-3xl relative space-y-5 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white tracking-tight">Video KYC Demo</h3>
                  <p className="text-[11px] text-blue-400 font-medium">Identity verification in progress...</p>
                </div>
              </div>

              <button
                onClick={() => setIsKycModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-amber-950/80 border border-amber-700/60 text-amber-300 text-[11px] p-2.5 rounded-xl font-medium flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>DEMO MODE — Camera Access Simulated (No Real Camera or Recording Used)</span>
            </div>

            <div className="relative bg-slate-950 border border-slate-800 rounded-2xl h-56 flex flex-col items-center justify-center overflow-hidden">
              <div className="w-36 h-44 rounded-3xl border-2 border-dashed border-blue-400/80 relative flex items-center justify-center overflow-hidden">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent absolute top-0 animate-laser" />
                <UserCheck className="w-16 h-16 text-blue-400/60" />
              </div>

              <div className="absolute bottom-3 px-3 py-1 bg-slate-900/90 border border-slate-800 rounded-full text-[11px] text-blue-300 font-semibold flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>AI Face & Liveness Detection Active</span>
              </div>
            </div>

            <div className="space-y-2 text-xs bg-slate-950/60 border border-slate-800 p-3.5 rounded-2xl">
              <div className="flex items-center justify-between text-slate-300 font-medium">
                <span>Nominee Name:</span>
                <strong className="text-white font-bold">Ankit Sharma</strong>
              </div>
              <div className="flex items-center justify-between text-slate-300 font-medium">
                <span>Aadhaar / PAN Match:</span>
                <span className="text-emerald-400 font-bold">100% Match Verified</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleCompleteDemoKyc}
                disabled={isKycProcessing}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-2xl transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isKycProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    <span>Verifying Biometrics & Finalizing Approval...</span>
                  </>
                ) : (
                  <>
                    <BadgeCheck className="w-4 h-4 mr-1" />
                    <span>Complete Demo KYC</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
