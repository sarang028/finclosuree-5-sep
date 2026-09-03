import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom';
import { Search, FileText, CheckSquare, RefreshCw, ArrowRight } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      step: 'Step 1',
      title: 'Create Deceased Profile',
      desc: 'Set up the basic record with name, relationship (Father, Spouse, etc.), and claimant role (Nominee vs Legal Heir).',
      icon: Search,
    },
    {
      step: 'Step 2',
      title: 'Record Known Assets & Run AI Discovery',
      desc: 'Add accounts or policies you know about. Use FinClosure AI to scan notes and document snippets to uncover potential assets.',
      icon: RefreshCw,
    },
    {
      step: 'Step 3',
      title: 'Upload Documents & AI Extraction',
      desc: 'Upload death certificates, PAN/Aadhaar cards, and policy bonds. AI extracts dates, policy numbers, and highlights missing data.',
      icon: FileText,
    },
    {
      step: 'Step 4',
      title: 'Generate Personalized Checklists',
      desc: 'Get exact document checklists tailored to your claimant role and institution requirements.',
      icon: CheckSquare,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-950 text-teal-300 border border-teal-800/60 inline-block mb-4">
            Step-by-Step Workflow
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">How FinClosure Works</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-base">
            From initial asset discovery to final institution settlement, FinClosure guides you through every milestone.
          </p>
        </div>

        <div className="space-y-8 mb-16">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="glass-card p-6 sm:p-8 rounded-2xl border-slate-800 flex flex-col sm:flex-row items-start gap-6">
                <div className="w-12 h-12 rounded-xl bg-teal-950 text-teal-400 border border-teal-800/80 flex items-center justify-center font-bold text-lg shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">{item.step}</span>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center bg-slate-900/60 p-8 rounded-2xl border border-slate-800">
          <h3 className="text-xl font-bold text-white mb-3">Ready to begin your financial closure journey?</h3>
          <Link
            to="/register"
            className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-xl transition-all shadow-md"
          >
            Get Started Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};
