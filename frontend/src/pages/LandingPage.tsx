import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import {
  HeartHandshake,
  ShieldCheck,
  Search,
  FileText,
  FileCheck,
  CheckCircle2,
  Lock,
  Compass,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { startDemo } = useAuth();
  const navigate = useNavigate();

  const handleStartDemo = () => {
    startDemo();
    navigate('/dashboard');
  };

  const journeySteps = [
    { title: 'Discover', desc: 'Uncover hidden bank accounts, term deposits, insurance policies & pensions.', icon: Search },
    { title: 'Understand', desc: 'AI extracts details & identifies missing requirements without legal jargon.', icon: Compass },
    { title: 'Organize', desc: 'Centralize essential death certificates, identity proofs & policy records.', icon: FileText },
    { title: 'Prepare', desc: 'Receive custom document checklists generated specifically for your claimant role.', icon: Sparkles },
    { title: 'Claim', desc: 'Follow step-by-step visual claim journeys for each individual institution.', icon: FileCheck },
    { title: 'Track', desc: 'Monitor active verification, branch reviews & settlement milestones.', icon: TrendingUp },
    { title: 'Close', desc: 'Achieve total financial closure and secure your family’s economic future.', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-teal-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 -right-40 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 mb-6">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-xs font-semibold text-teal-300">GenAI-Powered Financial Settlement Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
            Closing Finances.{' '}
            <span className="bg-gradient-to-r from-teal-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              Securing Futures.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed font-normal">
            FinClosure helps nominees and legal heirs discover financial assets, organize documents, generate institution-specific claim checklists, and navigate settlement processes after losing a loved one.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStartDemo}
              className="w-full sm:w-auto px-8 py-4 text-base font-extrabold text-teal-950 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 rounded-xl transition-all shadow-xl shadow-teal-950/80 flex items-center justify-center space-x-2.5 active:scale-98"
            >
              <Sparkles className="w-5 h-5 text-teal-950 fill-teal-950" />
              <span>Start Demo (Instant Access)</span>
            </button>
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all flex items-center justify-center"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Visual Product Journey Roadmap */}
      <section className="py-16 bg-slate-900/60 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-2">The FinClosure Journey</h2>
            <p className="text-2xl sm:text-3xl font-bold text-white">7 Steps to Complete Financial Closure</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
            {journeySteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="glass-card p-4 rounded-xl flex flex-col justify-between border-slate-800/80 hover:border-teal-500/40 transition-all"
                >
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-teal-950 text-teal-400 border border-teal-800/60 flex items-center justify-center mb-3 font-bold text-xs">
                      0{idx + 1}
                    </div>
                    <h3 className="text-base font-bold text-white mb-1 flex items-center">
                      <Icon className="w-4 h-4 mr-1.5 text-teal-400" />
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-normal">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Problem & Solution Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-3">The Challenge Families Face</h2>
            <h3 className="text-3xl font-bold text-white leading-tight mb-6">
              When a loved one passes away, financial closure shouldn't be an overwhelming ordeal.
            </h3>
            <p className="text-slate-300 mb-4 leading-relaxed">
              Families often don't know all bank accounts, insurance policies, term deposits, or investments left behind. Even when known, every bank, insurer, and pension provider demands different document sets and physical procedures.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              FinClosure brings clarity, compassionate guidance, and automated assistance so you never have to guess what document to submit next.
            </p>
            <div className="space-y-3">
              <div className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-teal-400 mr-3 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-200">AI-driven discovery of unconfirmed policies & bank accounts</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-teal-400 mr-3 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-200">Personalized checklists tailored to Nominees vs. Legal Heirs</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-teal-400 mr-3 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-200">Visual step-by-step claim journeys with context-aware AI advice</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-2xl border-slate-800 bg-slate-900/80">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">FinClosure Intelligence Guarantee</h4>
                <p className="text-xs text-slate-400">Built on safety, privacy, and verification</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider block mb-1">Empathetic Design</span>
                <p className="text-xs text-slate-300">Calm, clear UI that simplifies stressful financial paperwork.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider block mb-1">Human-in-the-Loop Confirmation</span>
                <p className="text-xs text-slate-300">AI proposes potential assets; you remain in total control to confirm before adding to portfolio.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider block mb-1">Bank-Grade Privacy</span>
                <p className="text-xs text-slate-300">Your documents are isolated and accessible only to your authenticated account.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-900">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-extrabold text-white mb-4">Start Managing Financial Closure Today</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Take control of the financial closure process with structured checklists, AI assistance, and transparent progress tracking.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 text-base font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-xl transition-all shadow-lg shadow-teal-950"
          >
            Create Deceased Profile
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};
