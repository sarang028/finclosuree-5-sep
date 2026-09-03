import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deceasedApi, assetApi, documentApi } from '../services/apiServices';
import { AssetCategory } from '../types';
import {
  UserCheck,
  User,
  Landmark,
  FileUp,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1 State
  const [claimantRole, setClaimantRole] = useState<'Nominee' | 'Legal Heir' | 'Both' | 'Other'>('Nominee');

  // Step 2 State
  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState('Father');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [dateOfDeath, setDateOfDeath] = useState('');
  const [knownInstitutionsText, setKnownInstitutionsText] = useState('');

  // Step 3 State
  const [selectedCategories, setSelectedCategories] = useState<AssetCategory[]>([
    'Bank Account',
    'Insurance',
  ]);
  const [institutionName, setInstitutionName] = useState('');

  // Step 4 State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [createdProfileId, setCreatedProfileId] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleCategoryToggle = (cat: AssetCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleCompleteOnboarding = async () => {
    setIsSubmitting(true);
    try {
      // 1. Create Deceased Profile
      const instArray = knownInstitutionsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const profileRes = await deceasedApi.create({
        fullName: fullName || 'Deceased Loved One',
        relationship,
        claimantRole,
        dateOfBirth: dateOfBirth || undefined,
        dateOfDeath: dateOfDeath || undefined,
        knownInstitutions: instArray,
      });

      const profileId = profileRes.profile._id;
      setCreatedProfileId(profileId);

      // 2. Add Initial Selected Known Assets
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

      // 3. Upload Document if provided
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
      // Navigate anyway so user doesn't get stuck
      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full mx-auto glass-card p-8 rounded-2xl border-slate-800 shadow-2xl">
        {/* Wizard Header Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-3">
            <span className="text-teal-400">Step {currentStep} of 4</span>
            <span>FinClosure Guided Setup</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-sky-500 transition-all duration-500"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Claimant Role */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center mb-3">
                <UserCheck className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-white">Who are you?</h2>
              <p className="text-xs text-slate-400 mt-1">
                Select your relationship status for this financial claim.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  id: 'Nominee',
                  title: 'Registered Nominee',
                  desc: 'Named directly in bank accounts, insurance policies, or investment records.',
                },
                {
                  id: 'Legal Heir',
                  title: 'Legal Heir',
                  desc: 'Entitled to claim estate inheritance under legal succession certificate or succession laws.',
                },
                {
                  id: 'Both',
                  title: 'Both Nominee & Heir',
                  desc: 'You are registered nominee and legal heir of the deceased.',
                },
                {
                  id: 'Other',
                  title: 'Other Representative',
                  desc: 'Authorized family member or estate administrator.',
                },
              ].map((role) => (
                <div
                  key={role.id}
                  onClick={() => setClaimantRole(role.id as any)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    claimantRole === role.id
                      ? 'bg-teal-950/60 border-teal-500 shadow-md shadow-teal-950'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white">{role.title}</span>
                    {claimantRole === role.id && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
                  </div>
                  <p className="text-xs text-slate-400 leading-normal">{role.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setCurrentStep(2)}
              className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        )}

        {/* STEP 2: Deceased Info */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center mb-3">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-white">Deceased Person Information</h2>
              <p className="text-xs text-slate-400 mt-1">
                Tell us about the person whose financial affairs you are closing.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rajesh Sharma"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Relationship</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-teal-500 focus:outline-none"
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
                  <label className="block text-xs font-medium text-slate-300 mb-1">Date of Demise (Optional)</label>
                  <input
                    type="date"
                    value={dateOfDeath}
                    onChange={(e) => setDateOfDeath(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Known Financial Institutions (Comma-separated)
                </label>
                <input
                  type="text"
                  value={knownInstitutionsText}
                  onChange={(e) => setKnownInstitutionsText(e.target.value)}
                  placeholder="e.g. HDFC Bank, LIC of India, SBI, EPFO"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCurrentStep(1)}
                className="py-3 px-5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-sm rounded-xl transition-all flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="flex-1 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Known Financial Assets */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center mb-3">
                <Landmark className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-white">Which financial assets do you know about?</h2>
              <p className="text-xs text-slate-400 mt-1">
                Select asset categories to initialize in your workspace portfolio.
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
                    className={`p-3.5 rounded-xl border cursor-pointer text-xs font-semibold flex items-center justify-between transition-all ${
                      selected
                        ? 'bg-teal-950/60 border-teal-500 text-teal-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{cat}</span>
                    {selected && <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />}
                  </div>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Primary Institution Name (Optional)
              </label>
              <input
                type="text"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                placeholder="e.g. State Bank of India"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCurrentStep(2)}
                className="py-3 px-5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-sm rounded-xl transition-all flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="flex-1 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Initial Document Upload */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center mb-3">
                <FileUp className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-white">Upload Initial Documents (Optional)</h2>
              <p className="text-xs text-slate-400 mt-1">
                Upload Death Certificate or Claimant Identity proof to enable AI document extraction.
              </p>
            </div>

            <div className="border-2 border-dashed border-slate-800 hover:border-teal-500/50 rounded-2xl p-6 text-center transition-colors bg-slate-900/40">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              <label htmlFor="file-upload" className="cursor-pointer block">
                <FileUp className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                <span className="text-xs font-semibold text-white block">
                  {selectedFile ? selectedFile.name : 'Click to choose file or drag & drop'}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">PDF, PNG, JPG up to 10MB</span>
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCurrentStep(3)}
                className="py-3 px-5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-sm rounded-xl transition-all flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </button>
              <button
                onClick={handleCompleteOnboarding}
                disabled={isSubmitting}
                className="flex-1 py-3 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center shadow-lg shadow-teal-950"
              >
                {isSubmitting ? 'Finalizing Setup...' : 'Complete & Open Dashboard'}
                <Sparkles className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
