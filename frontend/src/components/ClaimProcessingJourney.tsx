import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Video,
  ShieldCheck,
  Building,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  X,
  UserCheck,
  Check,
  BadgeCheck,
  Landmark,
} from 'lucide-react';

interface ClaimProcessingJourneyProps {
  claimId?: string;
  claimRefNumber?: string;
  institution?: string;
  claimAmount?: number;
  onClose?: () => void;
}

export const ClaimProcessingJourney: React.FC<ClaimProcessingJourneyProps> = ({
  claimId = 'demo_claim_1',
  claimRefNumber = 'FC-DEMO-2026-001',
  institution = 'Life Insurance Corporation of India (LIC)',
  claimAmount = 10000000, // ₹1,00,00,000 (1 Crore)
  onClose,
}) => {
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

  const handleResetJourney = () => {
    setIsJourneyCompleted(false);
  };

  // 6 Steps definition
  const steps = [
    {
      id: 1,
      title: 'CLAIM SUBMITTED',
      status: 'Completed',
      description: 'Claim application and required documents submitted successfully.',
      timestamp: '12 Jan 2026, 10:30 AM',
      estimatedNext: null,
    },
    {
      id: 2,
      title: 'PROCESSING',
      status: 'Completed',
      description: 'The institution has received the claim and processing has started.',
      timestamp: '14 Jan 2026, 02:15 PM',
      estimatedNext: null,
    },
    {
      id: 3,
      title: 'VERIFICATION',
      status: isJourneyCompleted ? 'Completed' : 'Under Verification',
      description: 'Documents, nominee details and claim information are being verified.',
      timestamp: isJourneyCompleted ? '16 Jan 2026, 11:00 AM' : 'In Progress since 16 Jan 2026',
      estimatedNext: isJourneyCompleted ? null : 'Estimated verification completion: 24 hours',
    },
    {
      id: 4,
      title: 'VIDEO KYC',
      status: isJourneyCompleted ? 'Completed' : 'Pending Action',
      description: 'Nominee verification through Video KYC is required.',
      timestamp: isJourneyCompleted ? '16 Jan 2026, 11:45 AM' : null,
      estimatedNext: isJourneyCompleted ? null : 'Action Required: Perform face liveness & KYC verification',
    },
    {
      id: 5,
      title: 'APPROVED',
      status: isJourneyCompleted ? 'Completed' : 'Pending',
      description: 'Claim will be approved after successful verification and KYC.',
      timestamp: isJourneyCompleted ? '16 Jan 2026, 11:46 AM' : null,
      estimatedNext: isJourneyCompleted ? null : 'Unlocks automatically upon Video KYC completion',
    },
    {
      id: 6,
      title: 'DISBURSED',
      status: isJourneyCompleted ? 'Completed' : 'Pending',
      description: 'Approved amount will be transferred to the nominee\'s registered account.',
      timestamp: isJourneyCompleted ? '16 Jan 2026, 11:47 AM' : null,
      estimatedNext: isJourneyCompleted ? null : 'Target Account: Axis Bank Savings A/C ending •••• 8410',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-3xl shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-1">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 border border-amber-600">
                DEMO MODE
              </span>
              <span className="text-xs font-bold font-mono text-slate-500">
                Claim ID: {claimRefNumber}
              </span>
            </div>

            <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">
              Claim Processing Journey
            </h1>
            <p className="text-xs font-semibold text-slate-500">
              Simulated end-to-end post-submission claim settlement workflow
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {isJourneyCompleted && (
              <button
                onClick={handleResetJourney}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Reset Demo Journey
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Claim Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block">Institution</span>
            <strong className="text-slate-900 font-bold block">{institution}</strong>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block">Claim Sum Assured</span>
            <strong className="text-emerald-800 font-black text-sm">
              ₹{(claimAmount).toLocaleString('en-IN')} (₹1 Crore)
            </strong>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block">Registered Nominee</span>
            <strong className="text-slate-900 font-bold block">Ankit Sharma (Son)</strong>
          </div>
        </div>

        {/* Success State Banner after Demo Video KYC Completion */}
        {isJourneyCompleted && (
          <div className="bg-emerald-500 text-slate-950 p-4 sm:p-5 rounded-2xl border border-emerald-600 shadow-md space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-full bg-slate-950 text-emerald-400 flex items-center justify-center font-black">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight text-slate-950">
                    Claim Approved Successfully 🎉
                  </h3>
                  <p className="text-xs font-bold text-slate-900">
                    ₹1,00,00,000 approved • Disbursement initiated to Axis Bank A/C ending •••• 8410
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-extrabold px-3 py-1 bg-slate-950 text-emerald-400 rounded-full">
                Status: DISBURSED
              </span>
            </div>
          </div>
        )}

        {/* Disclaimer Warning */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-medium flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>DEMO MODE DISCLAIMER:</strong> This is a simulated demonstration workflow only. FinClosure is NOT directly connected to insurance companies, banks, government databases, or real Video KYC services. No actual financial transactions or camera recordings take place.
          </span>
        </div>
      </div>

      {/* Main Claim Processing Stepper Timeline */}
      <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-3xl shadow-2xs space-y-6">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center justify-between">
          <span>Claim Processing Timeline</span>
          <span className="text-xs font-semibold text-slate-500">
            {isJourneyCompleted ? '6 of 6 Completed' : '3 of 6 Completed (Action Required)'}
          </span>
        </h2>

        {/* Stepper Timeline List */}
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {steps.map((step) => {
            const isCompleted = step.status === 'Completed';
            const isUnderVerification = step.status === 'Under Verification';
            const isPendingAction = step.status === 'Pending Action';
            const isPending = step.status === 'Pending';

            return (
              <div key={step.id} className="relative group">
                {/* Timeline Icon Node */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-0.5 w-6 sm:w-7 h-6 sm:h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-2xs transition-all z-10 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                      : isUnderVerification
                      ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-50 animate-pulse'
                      : isPendingAction
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-50 animate-bounce'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : isPendingAction ? (
                    <Video className="w-3.5 h-3.5" />
                  ) : (
                    step.id
                  )}
                </div>

                {/* Step Item Content Card */}
                <div
                  className={`p-4 rounded-2xl border transition-all space-y-2 ${
                    isCompleted
                      ? 'bg-emerald-50/40 border-emerald-200/80'
                      : isPendingAction
                      ? 'bg-indigo-50/60 border-indigo-300 ring-2 ring-indigo-200/50'
                      : isUnderVerification
                      ? 'bg-amber-50/40 border-amber-200'
                      : 'bg-slate-50/50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center space-x-2">
                      <h3
                        className={`text-xs sm:text-sm font-black tracking-tight ${
                          isCompleted
                            ? 'text-emerald-950'
                            : isPendingAction
                            ? 'text-indigo-950'
                            : isUnderVerification
                            ? 'text-amber-950'
                            : 'text-slate-600'
                        }`}
                      >
                        Step {step.id}: {step.title}
                      </h3>

                      {/* Status Badge */}
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : isPendingAction
                            ? 'bg-indigo-600 text-white border-indigo-700 animate-pulse'
                            : isUnderVerification
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-slate-200 text-slate-700 border-slate-300'
                        }`}
                      >
                        {step.status}
                      </span>
                    </div>

                    {step.timestamp && (
                      <span className="text-[11px] font-mono text-slate-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {step.timestamp}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {step.description}
                  </p>

                  {step.estimatedNext && (
                    <div className="text-[11px] font-semibold text-slate-500 pt-1 border-t border-slate-200/60">
                      💡 {step.estimatedNext}
                    </div>
                  )}

                  {/* Step 4 Action Button: Start Video KYC */}
                  {step.id === 4 && !isJourneyCompleted && (
                    <div className="pt-2">
                      <button
                        onClick={handleStartVideoKyc}
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 animate-pulse"
                      >
                        <Video className="w-4 h-4" />
                        <span>Start Video KYC</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Realistic DEMO Video KYC Screen / Modal */}
      {isKycModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 max-w-lg w-full p-6 rounded-3xl relative space-y-5 text-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white tracking-tight">Video KYC Demo</h3>
                  <p className="text-[11px] text-indigo-400 font-medium">Identity verification in progress...</p>
                </div>
              </div>

              <button
                onClick={() => setIsKycModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* DEMO Notice Banner inside Modal */}
            <div className="bg-amber-950/80 border border-amber-700/60 text-amber-300 text-[11px] p-2.5 rounded-xl font-medium flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>DEMO MODE — Camera Access Simulated (No Real Camera or Recording Used)</span>
            </div>

            {/* Video Feed Simulation Box */}
            <div className="relative bg-slate-950 border border-slate-800 rounded-2xl h-56 flex flex-col items-center justify-center overflow-hidden">
              {/* Face Frame Scanning Animation */}
              <div className="w-36 h-44 rounded-3xl border-2 border-dashed border-indigo-400/80 relative flex items-center justify-center overflow-hidden">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent absolute top-0 animate-laser" />
                <UserCheck className="w-16 h-16 text-indigo-400/60" />
              </div>

              <div className="absolute bottom-3 px-3 py-1 bg-slate-900/90 border border-slate-800 rounded-full text-[11px] text-indigo-300 font-semibold flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>AI Face & Liveness Detection Active</span>
              </div>
            </div>

            {/* Verified Details Checklist */}
            <div className="space-y-2 text-xs bg-slate-950/60 border border-slate-800 p-3.5 rounded-2xl">
              <div className="flex items-center justify-between text-slate-300 font-medium">
                <span>Nominee Name:</span>
                <strong className="text-white font-bold">Ankit Sharma</strong>
              </div>
              <div className="flex items-center justify-between text-slate-300 font-medium">
                <span>Aadhaar / PAN Match:</span>
                <span className="text-emerald-400 font-bold">100% Match Verified</span>
              </div>
              <div className="flex items-center justify-between text-slate-300 font-medium">
                <span>Institution:</span>
                <span className="text-slate-300 font-bold">{institution}</span>
              </div>
            </div>

            {/* Action Buttons */}
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
