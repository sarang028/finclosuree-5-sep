import React, { useState } from 'react';
import { Camera, CheckCircle2, ShieldCheck, AlertCircle, RefreshCw, Sparkles, UserCheck } from 'lucide-react';

interface VideoKycModalProps {
  onComplete: () => void;
  nomineeName?: string;
  relationship?: string;
}

export const VideoKycModal: React.FC<VideoKycModalProps> = ({
  onComplete,
  nomineeName = 'Ankit Sharma',
  relationship = 'Son / Nominee',
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const verificationSteps = [
    'Initializing camera & video feed...',
    'Detecting face position & lighting...',
    'Performing liveness verification check...',
    'Matching nominee identity document...',
    'Verifying nominee authority details...',
    'Verification successful!',
  ];

  const handleStartKyc = () => {
    setIsVerifying(true);
    setStepIndex(0);

    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= verificationSteps.length - 2) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVerifying(false);
            setIsCompleted(true);
          }, 600);
          return verificationSteps.length - 1;
        }
        return prev + 1;
      });
    }, 700);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl max-w-xl mx-auto text-slate-900">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3 shadow-xs">
          <Camera className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Video KYC Verification
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Instant AI-assisted face and document verification for nominee authentication.
        </p>
      </div>

      {/* Camera Preview Area */}
      <div className="relative rounded-2xl bg-slate-950 aspect-video overflow-hidden border border-slate-800 flex flex-col items-center justify-center shadow-inner mb-6">
        {!isVerifying && !isCompleted && (
          <div className="text-center p-6 space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-emerald-400">
              <Camera className="w-8 h-8" />
            </div>
            <p className="text-xs font-semibold text-slate-300">
              Click 'Start Video KYC' to begin simulated liveness and identity check
            </p>
          </div>
        )}

        {isVerifying && (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Live Camera Simulation with Oval Face Outline */}
            <div className="w-36 h-48 rounded-[50%] border-2 border-dashed border-emerald-400/80 flex items-center justify-center animate-pulse">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest">
                Position Face Here
              </span>
            </div>

            {/* Scanning Line Effect */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-bounce opacity-80" />

            {/* Live Step Overlay */}
            <div className="absolute bottom-3 inset-x-4 p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md flex items-center justify-between text-xs text-emerald-300">
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span className="font-semibold">{verificationSteps[stepIndex]}</span>
              </div>
              <span className="text-[10px] font-extrabold text-slate-400">
                {Math.round(((stepIndex + 1) / verificationSteps.length) * 100)}%
              </span>
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="text-center p-6 space-y-2 text-white">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-extrabold text-white">
              ✓ KYC Verified Successfully
            </h3>
            <div className="text-xs text-emerald-200/90 space-y-1 bg-slate-900/80 p-3 rounded-xl border border-slate-800 inline-block text-left">
              <p><span className="text-slate-400">Verified Name:</span> {nomineeName}</p>
              <p><span className="text-slate-400">Relationship:</span> {relationship}</p>
              <p><span className="text-slate-400">Timestamp:</span> {new Date().toLocaleString()}</p>
              <p><span className="text-slate-400">Demo Verification ID:</span> KYC-DEMO-2026-88492</p>
            </div>
          </div>
        )}
      </div>

      {/* Live Verification Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 text-[11px]">
        <div className={`p-2.5 rounded-xl border flex items-center space-x-2 ${isCompleted ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
          <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
          <span>Face Detection</span>
        </div>
        <div className={`p-2.5 rounded-xl border flex items-center space-x-2 ${isCompleted ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
          <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
          <span>Liveness Check</span>
        </div>
        <div className={`p-2.5 rounded-xl border flex items-center space-x-2 ${isCompleted ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
          <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
          <span>Document Match</span>
        </div>
        <div className={`p-2.5 rounded-xl border flex items-center space-x-2 ${isCompleted ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
          <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
          <span>Name Match</span>
        </div>
      </div>

      {/* Demo Mode Disclaimer */}
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center space-x-2 mb-6">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span className="font-medium">
          DEMO MODE — Identity verification and video KYC are simulated for this prototype.
        </span>
      </div>

      {/* Actions */}
      <div>
        {!isCompleted ? (
          <button
            type="button"
            onClick={handleStartKyc}
            disabled={isVerifying}
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>{isVerifying ? 'Verifying Nominee Identity...' : 'Start Video KYC'}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onComplete}
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
          >
            <span>Continue</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
