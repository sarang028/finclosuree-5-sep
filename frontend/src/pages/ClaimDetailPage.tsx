import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { claimApi, aiApi } from '../services/apiServices';
import { Claim, ClaimStep, ChecklistItem } from '../types';
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
    return <div className="text-center py-12 text-slate-400 text-sm">Loading claim journey details...</div>;
  }

  if (!claim) {
    return <div className="text-center py-12 text-slate-400 text-sm">Claim record not found.</div>;
  }

  const assetObj = typeof claim.assetId === 'object' ? claim.assetId : null;

  return (
    <div className="space-y-8">
      {/* Back Link & Header */}
      <div>
        <Link to="/claims" className="inline-flex items-center text-xs font-semibold text-teal-400 hover:text-teal-300 mb-3">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Claims List
        </Link>

        <div className="glass-card p-6 rounded-2xl border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                {claim.institution}
              </span>
              <span className="text-xs text-slate-400 font-mono">Ref: {claim.claimReferenceNumber || 'N/A'}</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{claim.claimType}</h1>
            {assetObj && <p className="text-xs text-slate-400 mt-1">Associated Asset: <strong className="text-slate-200">{assetObj.name}</strong></p>}
          </div>

          {/* Status Changer Control */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="text-right mr-2">
              <span className="text-2xl font-extrabold text-white">{claim.overallProgress}%</span>
              <span className="text-[10px] text-teal-400 font-semibold block uppercase">Claim Score</span>
            </div>

            <select
              value={claim.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-teal-300 focus:outline-none focus:border-teal-500"
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
      </div>

      {/* Grid: Left Column (Steps & Checklist), Right Column (AI Guidance Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main 2-Column Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Visual Step-by-Step Claim Journey */}
          <div>
            <h2 className="text-base font-bold text-white mb-4 flex items-center">
              <Compass className="w-4 h-4 mr-2 text-teal-400" /> Visual Step-by-Step Claim Journey
            </h2>

            <div className="space-y-3">
              {steps.map((step) => {
                const isDone = step.status === 'Completed';
                return (
                  <div
                    key={step._id}
                    className={`glass-card p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                      isDone ? 'border-teal-800/80 bg-teal-950/20' : 'border-slate-800'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => handleStepStatusToggle(step._id, step.status)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 transition-colors ${
                          isDone ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.stepNumber}
                      </button>
                      <div>
                        <h3 className={`text-sm font-bold ${isDone ? 'text-teal-300 line-through' : 'text-white'}`}>
                          {step.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5 leading-normal">{step.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStepStatusToggle(step._id, step.status)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors shrink-0 ${
                        isDone
                          ? 'bg-teal-950 text-teal-300 border-teal-800'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {isDone ? 'Mark Pending' : 'Mark Step Complete'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Personalized Document Checklist */}
          <div>
            <h2 className="text-base font-bold text-white mb-4 flex items-center">
              <CheckSquare className="w-4 h-4 mr-2 text-sky-400" /> Personalized Document Submission Checklist
            </h2>

            <div className="glass-card rounded-2xl border-slate-800 divide-y divide-slate-800/60 overflow-hidden">
              {checklist.map((item) => (
                <div key={item._id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-900/40">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={item.isCompleted}
                      onChange={() => handleChecklistToggle(item._id, item.isCompleted)}
                      className="w-4 h-4 mt-0.5 accent-teal-500 rounded cursor-pointer"
                    />
                    <div>
                      <span className={`text-xs font-bold block ${item.isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>
                        {item.name}
                      </span>
                      <span className="text-[11px] text-slate-400 leading-normal block">{item.explanation}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                      item.isCompleted
                        ? 'bg-teal-950 text-teal-300 border border-teal-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {item.isCompleted ? 'Completed' : 'Required'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Claim Guidance Panel */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border-teal-800/80 bg-slate-900/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-bold text-white">FinClosure AI Claim Guidance</h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Get personalized step-by-step advice and preparation rules tailored to this institution claim.
            </p>

            <button
              onClick={handleFetchAiGuidance}
              disabled={isFetchingGuidance}
              className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-semibold text-xs rounded-xl transition-all shadow-md flex items-center justify-center disabled:opacity-50"
            >
              {isFetchingGuidance ? 'Analyzing Guidance...' : 'Generate AI Guidance for Current Step'}
            </button>

            {aiGuidance && (
              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-teal-950/60 border border-teal-800/60 text-teal-200">
                  <strong className="block font-bold mb-1">Recommended Action:</strong>
                  {aiGuidance.nextAction}
                </div>

                {aiGuidance.preparationAdvice && (
                  <div>
                    <strong className="text-slate-300 block mb-1">Preparation Tips:</strong>
                    <ul className="space-y-1 text-slate-400 pl-4 list-disc">
                      {aiGuidance.preparationAdvice.map((tip: string, i: number) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                  ⚠️ {aiGuidance.safetyNotice}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
