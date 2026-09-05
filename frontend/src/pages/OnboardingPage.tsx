import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { deceasedApi, assetApi, documentApi } from '../services/apiServices';
import { AssetCategory } from '../types';
import {
  Leaf,
  X,
  User,
  Landmark,
  Users,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Info,
  FileUp,
  Sparkles,
} from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1 State: Role Selection matching Screen 2
  const [claimantRole, setClaimantRole] = useState<'Nominee' | 'Legal Heir' | 'Both' | 'Other'>('Nominee');

  // Step 2 State: Basic Info
  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState('Father');
  const [dateOfDeath, setDateOfDeath] = useState('');
  const [knownInstitutionsText, setKnownInstitutionsText] = useState('');

  // Step 3 State: Preferences & Asset Categories
  const [selectedCategories, setSelectedCategories] = useState<AssetCategory[]>([
    'Bank Account',
    'Insurance',
  ]);
  const [institutionName, setInstitutionName] = useState('');

  // Step 4 State: Complete & Document Upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const navigate = useNavigate();

  const handleCategoryToggle = (cat: AssetCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleCompleteOnboarding = async () => {
    setIsSubmitting(true);
    try {
      const instArray = knownInstitutionsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const profileRes = await deceasedApi.create({
        fullName: fullName || 'Deceased Loved One',
        relationship,
        claimantRole,
        dateOfDeath: dateOfDeath || undefined,
        knownInstitutions: instArray,
      });

      const profileId = profileRes.profile._id;

      for (const cat of selectedCategories) {
        await assetApi.create({
          deceasedId: profileId,
          name: `${institutionName || 'Primary'} ${cat}`,
          category: cat,
          institution: institutionName || 'Known Financial Institution',
          status: 'Known',
          estimatedValue: 0,
        });
      }

      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('deceasedId', profileId);
        formData.append('category', 'Death Certificate');
        formData.append('name', selectedFile.name);
        await documentApi.upload(formData);
      }

      navigate('/dashboard');
    } catch (err: any) {
      console.error('[Onboarding Error]', err);
      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepLabels = ['Your Role', 'Basic Info', 'Preferences', 'Complete'];

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-slate-900 flex flex-col font-sans">
      {/* Top Header Bar matching Screen 2 */}
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
          {/* Top Progress Stepper Indicator matching Screen 2 */}
          <div className="max-w-md mx-auto">
            <span className="text-xs font-bold text-emerald-700 block mb-3 text-center sm:text-left">
              Step {currentStep} of 4
            </span>

            {/* Stepper Progress Bar & Labels */}
            <div className="relative flex items-center justify-between">
              {/* Connecting Line */}
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
                      className={`text-[10px] font-semibold mt-1.5 ${
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

          {/* STEP 1: Who are you representing? matching Screen 2 */}
          {currentStep === 1 && (
            <div className="space-y-8 max-w-xl mx-auto pt-2">
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Who are you representing?
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  This helps us personalize your financial closure journey.
                </p>
              </div>

              {/* 4 Role Cards Grid matching Screen 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    id: 'Nominee',
                    title: 'Registered Nominee',
                    desc: 'Named directly in bank accounts, insurance policies, or investment records.',
                    icon: User,
                  },
                  {
                    id: 'Legal Heir',
                    title: 'Legal Heir',
                    desc: 'Entitled to claim estate inheritance under legal succession laws.',
                    icon: Landmark,
                  },
                  {
                    id: 'Both',
                    title: 'Both Nominee & Heir',
                    desc: 'You are registered nominee and legal heir of the deceased.',
                    icon: Users,
                  },
                  {
                    id: 'Other',
                    title: 'Authorized Representative',
                    desc: 'Authorized family member or estate administrator.',
                    icon: Briefcase,
                  },
                ].map((role) => {
                  const isSelected = claimantRole === role.id;
                  const Icon = role.icon;

                  return (
                    <div
                      key={role.id}
                      onClick={() => setClaimantRole(role.id as any)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#ECFDF5] border-emerald-600 shadow-sm ring-1 ring-emerald-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                              isSelected
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">
                          {role.title}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {role.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Helper Info Note matching Screen 2 */}
              <div className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-200/80 flex items-center justify-center space-x-2 text-xs text-slate-600">
                <Info className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Not sure? You can change this later in settings.</span>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  disabled
                  className="px-6 py-3 bg-slate-200 text-slate-400 font-bold text-xs rounded-full opacity-60 cursor-not-allowed flex items-center"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-full transition-all shadow-md shadow-emerald-900/20 flex items-center space-x-2 active:scale-98"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Basic Info */}
          {currentStep === 2 && (
            <div className="space-y-6 max-w-xl mx-auto pt-2">
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Deceased Person Details
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Tell us about your loved one to customize institutional forms.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Relationship</label>
                    <select
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Child">Child</option>
                      <option value="Relative">Relative</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Date of Demise (Optional)</label>
                    <input
                      type="date"
                      value={dateOfDeath}
                      onChange={(e) => setDateOfDeath(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Known Financial Institutions (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={knownInstitutionsText}
                    onChange={(e) => setKnownInstitutionsText(e.target.value)}
                    placeholder="e.g. Axis Bank, LIC of India, Reliance Industries"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs rounded-full transition-all flex items-center"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-8 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-full transition-all shadow-md shadow-emerald-900/20 flex items-center space-x-2 active:scale-98"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Preferences */}
          {currentStep === 3 && (
            <div className="space-y-6 max-w-xl mx-auto pt-2">
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Known Financial Assets
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Select initial categories to build your customized settlement workspace.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  'Bank Account',
                  'Fixed Deposit',
                  'Insurance',
                  'Investment',
                  'Pension',
                  'Digital Asset',
                ].map((cat) => {
                  const selected = selectedCategories.includes(cat as AssetCategory);
                  return (
                    <div
                      key={cat}
                      onClick={() => handleCategoryToggle(cat as AssetCategory)}
                      className={`p-4 rounded-xl border cursor-pointer text-xs font-bold flex items-center justify-between transition-all ${
                        selected
                          ? 'bg-[#ECFDF5] border-emerald-600 text-emerald-900'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span>{cat}</span>
                      {selected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />}
                    </div>
                  );
                })}
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs text-left">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Bank / Institution Name
                </label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="e.g. Axis Bank"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs rounded-full transition-all flex items-center"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-8 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-full transition-all shadow-md shadow-emerald-900/20 flex items-center space-x-2 active:scale-98"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Complete */}
          {currentStep === 4 && (
            <div className="space-y-6 max-w-xl mx-auto pt-2">
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Upload Key Documents
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Optionally add Death Certificate or Identity Proof to begin AI analysis.
                </p>
              </div>

              <div className="bg-white border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-8 text-center transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                    <FileUp className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 block mb-1">
                    {selectedFile ? selectedFile.name : 'Choose Death Certificate or ID'}
                  </span>
                  <span className="text-[11px] text-slate-400 block">PDF, PNG, JPG up to 10MB</span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs rounded-full transition-all flex items-center"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleCompleteOnboarding}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-full transition-all shadow-md shadow-emerald-900/20 flex items-center space-x-2 active:scale-98 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Finalizing Setup...' : 'Complete & Open Dashboard'}</span>
                  <Sparkles className="w-3.5 h-3.5 ml-1.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

