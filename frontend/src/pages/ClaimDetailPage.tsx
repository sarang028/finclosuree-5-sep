import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { claimApi, aiApi } from '../services/apiServices';
import { Claim, ClaimStep, ChecklistItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { ClaimProcessingJourney } from '../components/ClaimProcessingJourney';
import {
  FileCheck,
  CheckSquare,
  Sparkles,
  Compass,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
} from 'lucide-react';

export const ClaimDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [steps, setSteps] = useState<ClaimStep[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { isDemoMode } = useAuth();

  // AI Guidance Panel State
  const [aiGuidance, setAiGuidance] = useState<any | null>(null);
  const [isFetchingGuidance, setIsFetchingGuidance] = useState(false);

  const fetchClaimData = async () => {
    if (!id) return;
    try {
      const res = await claimApi.getById(id);
      setClaim(res.claim);
      setSteps(res.steps);
      setChecklist(res.checklist);
    } catch (err) {
      console.error('[Fetch Claim Detail Error]', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClaimData();
  }, [id]);

  const handleStepStatusToggle = async (stepId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      await claimApi.updateStep(stepId, nextStatus);
      fetchClaimData();
    } catch (err) {
      console.error('[Step Update Error]', err);
    }
  };

  const handleChecklistToggle = async (itemId: string, currentCompleted: boolean) => {
    if (!id) return;
    try {
      await claimApi.toggleChecklistItem(id, itemId, !currentCompleted);
      fetchClaimData();
    } catch (err) {
      console.error('[Checklist Toggle Error]', err);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    try {
      await claimApi.update(id, { status: newStatus as any });
      fetchClaimData();
    } catch (err) {
      console.error('[Status Change Error]', err);
    }
  };

  const handleFetchAiGuidance = async () => {
    if (!id) return;
    setIsFetchingGuidance(true);
    try {
      const res = await aiApi.getClaimGuidance(id);
      setAiGuidance(res.guidance);
    } catch (err) {
      console.error('[AI Guidance Error]', err);
    } finally {
      setIsFetchingGuidance(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 text-slate-400 text-xs">Loading claim journey details...</div>;
  }

  if (!claim) {
    return <div className="text-center py-12 text-slate-400 text-xs">Claim record not found.</div>;
  }

  const assetObj = typeof claim.assetId === 'object' ? claim.assetId : null;

  return (
    <div className="space-y-6">
      {/* Back Link & Title Navigation */}
      <div>
        <Link to="/claims" className="inline-flex items-center text-xs font-bold text-finclosure-800 hover:underline mb-3">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Claims List
        </Link>
      </div>

      {/* Render Claim Processing Journey Component in Demo Mode */}
      {isDemoMode ? (
        <ClaimProcessingJourney
          claimId={claim._id}
          claimRefNumber={claim.claimReferenceNumber || 'FC-DEMO-2026-001'}
          institution={claim.institution || 'Life Insurance Corporation of India (LIC)'}
          claimAmount={assetObj?.estimatedValue || 10000000}
        />
      ) : (
        /* Regular Live Mode Claim Detail View */
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xs">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {claim.institution}
                </span>
                <span className="text-xs text-slate-500 font-mono">Ref: {claim.claimReferenceNumber || 'N/A'}</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{claim.claimType}</h1>
              {assetObj && <p className="text-xs text-slate-500 mt-1">Associated Asset: <strong className="text-slate-800">{assetObj.name}</strong></p>}
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <div className="text-right mr-2">
                <span className="text-2xl font-extrabold text-slate-900">{claim.overallProgress}%</span>
                <span className="text-[10px] text-emerald-800 font-bold block uppercase">Claim Progress</span>
              </div>

              <select
                value={claim.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-finclosure-800"
              >
                <option value="Not Started">Not Started</option>
                <option value="Documents Pending">Documents Pending</option>
                <option value="Ready to Submit">Ready to Submit</option>
                <option value="Submitted">Submitted</option>
                <option value="Under Verification">Under Verification</option>
                <option value="Approved">Approved</option>
                <option value="Completed">Completed 🎉</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center">
                  <Compass className="w-4 h-4 mr-2 text-finclosure-800" /> Claim Journey Steps
                </h2>

                <div className="space-y-3">
                  {steps.map((step) => {
                    const isDone = step.status === 'Completed';
                    return (
                      <div
                        key={step._id}
                        className={`bg-white p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                          isDone ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <button
                            onClick={() => handleStepStatusToggle(step._id, step.status)}
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 transition-colors ${
                              isDone ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.stepNumber}
                          </button>
                          <div>
                            <h3 className={`text-sm font-bold ${isDone ? 'text-emerald-900 line-through' : 'text-slate-900'}`}>
                              {step.title}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5 leading-normal">{step.description}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleStepStatusToggle(step._id, step.status)}
                          className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors shrink-0 ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {isDone ? 'Mark Pending' : 'Mark Complete'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center">
                  <CheckSquare className="w-4 h-4 mr-2 text-finclosure-800" /> Document Submission Checklist
                </h2>

                <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-2xs">
                  {checklist.map((item) => (
                    <div key={item._id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={item.isCompleted}
                          onChange={() => handleChecklistToggle(item._id, item.isCompleted)}
                          className="w-4 h-4 mt-0.5 accent-emerald-600 rounded cursor-pointer"
                        />
                        <div>
                          <span className={`text-xs font-bold block ${item.isCompleted ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                            {item.name}
                          </span>
                          <span className="text-[11px] text-slate-500 leading-normal block">{item.explanation}</span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                          item.isCompleted
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                            : 'bg-rose-100 text-rose-900 border border-rose-200'
                        }`}
                      >
                        {item.isCompleted ? 'Completed' : 'Required'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column AI Guidance Panel */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-finclosure-800" />
                    <h3 className="text-sm font-bold text-slate-900">AI Claim Guidance</h3>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Get step-by-step guidance tailored to this institution's claim process.
                </p>

                <button
                  onClick={handleFetchAiGuidance}
                  disabled={isFetchingGuidance}
                  className="w-full py-2.5 bg-finclosure-800 hover:bg-finclosure-900 text-white font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center disabled:opacity-50"
                >
                  {isFetchingGuidance ? 'Analyzing Guidance...' : 'Generate Guidance'}
                </button>

                {aiGuidance && (
                  <div className="space-y-3 pt-2 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                      <strong className="block font-bold mb-1">Recommended Action:</strong>
                      {aiGuidance.nextAction}
                    </div>

                    {aiGuidance.preparationAdvice && (
                      <div>
                        <strong className="text-slate-800 block mb-1">Preparation Tips:</strong>
                        <ul className="space-y-1 text-slate-600 pl-4 list-disc">
                          {aiGuidance.preparationAdvice.map((tip: string, i: number) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
