import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { deceasedApi, assetApi } from '../services/apiServices';
import { initializeDemoStorage } from '../services/demoService';
import { VideoKycModal } from '../components/VideoKycModal';
import {
  Leaf,
  X,
  UserCheck,
  ShieldCheck,
  Camera,
  Search,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  Lock,
  RefreshCw,
  FileSearch,
} from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Nominee Identity Verification State
  const [nomineeName, setNomineeName] = useState('Ankit Sharma');
  const [relationship, setRelationship] = useState('Son / Nominee');
  const [aadhaarNumber, setAadhaarNumber] = useState('XXXX XXXX 4821');
  const [panNumber, setPanNumber] = useState('ABCDE****F');
  const [mobileNumber, setMobileNumber] = useState('+91 98765 43210');
  const [isConsentGiven, setIsConsentGiven] = useState(true);

  // Step 3: Deceased Profile State
  const [deceasedName, setDeceasedName] = useState('Late Rajesh Sharma');
  const [dateOfBirth, setDateOfBirth] = useState('1962-04-15');
  const [dateOfDeath, setDateOfDeath] = useState('2026-01-10');
  const [deceasedAadhaar, setDeceasedAadhaar] = useState('XXXX XXXX 9102');
  const [deceasedPan, setDeceasedPan] = useState('XYZPB****K');

  // Step 4: AI Financial Scanning Animation State
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const navigate = useNavigate();

  const scanSteps = [
    'Analyzing deceased profile & identity credentials...',
    'Organizing financial relationships & nominee records...',
    'Identifying bank accounts & fixed deposits (Axis Bank)...',
    'Identifying insurance policies (LIC ₹1 Cr, Star Health)...',
    'Identifying stock investments (Reliance / Jio Holdings)...',
    'Identifying liabilities & pending loans (Home & Vehicle)...',
    'Preparing financial footprint & closure summary...',
  ];

  const handleStartFinancialScan = () => {
    setCurrentStep(4);
    setIsScanning(true);
    setScanStepIndex(0);

    const interval = setInterval(() => {
      setScanStepIndex((prev) => {
        if (prev >= scanSteps.length - 2) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            setScanComplete(true);
          }, 600);
          return scanSteps.length - 1;
        }
        return prev + 1;
      });
    }, 600);
  };

  const handleFinishOnboarding = async () => {
    setIsSubmitting(true);
    try {
      // Ensure local demo storage is initialized with preloaded portfolio
      initializeDemoStorage();

      // Attempt backend API profile creation if backend is online
      try {
        await deceasedApi.create({
          fullName: deceasedName || 'Late Rajesh Sharma',
          relationship: 'Father',
          claimantRole: 'Both',
          dateOfBirth,
          dateOfDeath,
          knownInstitutions: ['Axis Bank', 'LIC of India', 'Star Health', 'Reliance Industries', 'HDFC Finance'],
        });
      } catch (e) {
        // Backend optional in DEMO MODE
      }

      navigate('/dashboard');
    } catch (err: any) {
      console.error('[Onboarding Error]', err);
      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepLabels = ['Identity Verification', 'Video KYC', 'Deceased Profile', 'AI Discovery'];

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-slate-900 flex flex-col font-sans">
      {/* Header Bar */}
      <header className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between border-b border-slate-200/80 bg-[#F8FAF9]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center shadow-xs">
            <Leaf className="w-4 h-4 text-white fill-white/20" />
          </div>
          <div>
            <span className="text-base font-bold text-slate-900 block leading-tight">
              FinClosure
            </span>
            <span className="text-[10px] font-medium text-slate-500">
              Closing Finances. Securing Futures.
            </span>
          </div>
        </div>

        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <span>Exit Setup</span>
          <X className="w-4 h-4" />
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 flex flex-col justify-between">
        <div className="space-y-8">
          {/* Progress Stepper Bar */}
          <div className="max-w-xl mx-auto">
            <span className="text-xs font-bold text-emerald-700 block mb-3 text-center sm:text-left">
              Step {currentStep} of 4 — {stepLabels[currentStep - 1]}
            </span>

            <div className="relative flex items-center justify-between">
              <div className="absolute left-0 top-3 w-full h-0.5 bg-slate-200 -z-0" />
              <div
                className="absolute left-0 top-3 h-0.5 bg-emerald-600 transition-all duration-300 -z-0"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />

              {stepLabels.map((label, idx) => {
                const stepNum = idx + 1;
                const isActive = stepNum === currentStep;
                const isCompleted = stepNum < currentStep;

                return (
                  <div key={label} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-6.5 h-6.5 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-emerald-700 text-white ring-4 ring-emerald-100'
                          : isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4 text-white" /> : stepNum}
                    </div>
                    <span
                      className={`text-[10px] font-semibold mt-1.5 hidden sm:inline ${
                        isActive ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 1: RELATIVE IDENTITY VERIFICATION */}
          {currentStep === 1 && (
            <div className="space-y-6 max-w-xl mx-auto pt-2">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Verify Your Identity
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Provide nominee or legal heir identity details to authorize financial scanning.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={nomineeName}
                    onChange={(e) => setNomineeName(e.target.value)}
                    placeholder="e.g. Ankit Sharma"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Relationship with Deceased</label>
                    <select
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="Son / Nominee">Son / Nominee</option>
                      <option value="Daughter / Nominee">Daughter / Nominee</option>
                      <option value="Spouse / Nominee">Spouse / Nominee</option>
                      <option value="Legal Heir">Legal Heir</option>
                      <option value="Authorized Representative">Authorized Representative</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                    <input
                      type="text"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Aadhaar Number (Masked Display)
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={aadhaarNumber}
                        onChange={(e) => setAadhaarNumber(e.target.value)}
                        placeholder="XXXX XXXX 4821"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      PAN Number (Masked Display)
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={panNumber}
                        onChange={(e) => setPanNumber(e.target.value)}
                        placeholder="ABCDE****F"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono uppercase text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Consent Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start space-x-2.5 cursor-pointer text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={isConsentGiven}
                      onChange={(e) => setIsConsentGiven(e.target.checked)}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>
                      I consent to FinClosure using my identity information for the purpose of this demo financial closure workflow.
                    </span>
                  </label>
                </div>
              </div>

              {/* DEMO MODE Tag */}
              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-center justify-center space-x-2">
                <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold">
                  DEMO MODE — Identity verification is simulated for this prototype.
                </span>
              </div>

              {/* CTA Button */}
              <button
                type="button"
                disabled={!isConsentGiven}
                onClick={() => setCurrentStep(2)}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-full transition-all shadow-md shadow-emerald-900/20 flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-98"
              >
                <span>Continue to Video KYC</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: VIDEO KYC VERIFICATION */}
          {currentStep === 2 && (
            <div className="max-w-xl mx-auto pt-2">
              <VideoKycModal
                nomineeName={nomineeName}
                relationship={relationship}
                onComplete={() => setCurrentStep(3)}
              />
            </div>
          )}

          {/* STEP 3: DECEASED PERSON PROFILE */}
          {currentStep === 3 && (
            <div className="space-y-6 max-w-xl mx-auto pt-2">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Add Deceased Person
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Provide profile details of your loved one to scan and discover financial assets.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deceased Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={deceasedName}
                    onChange={(e) => setDeceasedName(e.target.value)}
                    placeholder="e.g. Late Rajesh Sharma"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Date of Demise</label>
                    <input
                      type="date"
                      value={dateOfDeath}
                      onChange={(e) => setDateOfDeath(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Deceased Aadhaar (Masked)</label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={deceasedAadhaar}
                        onChange={(e) => setDeceasedAadhaar(e.target.value)}
                        placeholder="XXXX XXXX 9102"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Deceased PAN (Masked)</label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={deceasedPan}
                        onChange={(e) => setDeceasedPan(e.target.value)}
                        placeholder="XYZPB****K"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono uppercase text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* DEMO MODE Notice */}
              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-center justify-center space-x-2">
                <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
                <span>DEMO MODE — Financial scanning uses preloaded simulated records.</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs rounded-full transition-all flex items-center"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back
                </button>

                <button
                  type="button"
                  onClick={handleStartFinancialScan}
                  className="px-8 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-full transition-all shadow-md shadow-emerald-900/20 flex items-center space-x-2 active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>Discover Financial Assets</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: AI FINANCIAL DISCOVERY SCANNING EXPERIENCE */}
          {currentStep === 4 && (
            <div className="space-y-6 max-w-xl mx-auto pt-2">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <FileSearch className="w-7 h-7" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {scanComplete ? 'Financial Footprint Discovered' : 'Scanning Financial Footprint...'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  {scanComplete
                    ? 'All bank accounts, insurance policies, investments, and liabilities identified.'
                    : 'AI engine analyzing verified credentials and institutional databases.'}
                </p>
              </div>

              {/* Scanning Box */}
              <div className="bg-slate-950 text-white p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 text-center">
                {!scanComplete ? (
                  <div className="space-y-6 py-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-700 flex items-center justify-center mx-auto text-emerald-400 animate-spin">
                      <RefreshCw className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-bold text-emerald-300 animate-pulse">
                        {scanSteps[scanStepIndex]}
                      </p>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800 max-w-xs mx-auto">
                        <div
                          className="bg-emerald-500 h-full transition-all duration-300"
                          style={{ width: `${Math.round(((scanStepIndex + 1) / scanSteps.length) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 py-2">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      Financial Footprint Found!
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-left text-xs bg-slate-900 p-4 rounded-2xl border border-slate-800">
                      <div>
                        <span className="text-slate-400 block">Total Assets Found:</span>
                        <span className="text-emerald-400 font-extrabold text-sm">₹1.18 Cr+</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Insurance Coverage:</span>
                        <span className="text-emerald-400 font-extrabold text-sm">₹1.05 Cr+</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Pending Loans:</span>
                        <span className="text-rose-400 font-extrabold text-sm">₹5.50 Lakhs</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Money to Recover:</span>
                        <span className="text-sky-400 font-extrabold text-sm">₹1.10 Lakhs</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {scanComplete && (
                <button
                  type="button"
                  onClick={handleFinishOnboarding}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-sm rounded-full transition-all shadow-lg flex items-center justify-center space-x-2 active:scale-98"
                >
                  <span>Open Financial Discovery Dashboard</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};


