import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Search, FileText, CheckSquare, Compass, Bot, ShieldCheck } from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const features = [
    {
      title: 'AI Asset Discovery Engine',
      desc: 'Scans financial notes and uploaded document context to discover potential unconfirmed bank accounts, term deposits, policies, or pension accounts.',
      icon: Search,
    },
    {
      title: 'AI Document Understanding',
      desc: 'Parses death certificates, identity records, and insurance bonds to extract policy numbers, dates, names, and identify missing details.',
      icon: FileText,
    },
    {
      title: 'Personalized Document Checklists',
      desc: 'Generates specific requirement checklists based on claimant role (Nominee vs Legal Heir) and individual institution policies.',
      icon: CheckSquare,
    },
    {
      title: 'Step-by-Step Claim Tracking',
      desc: 'Visual claim journey progress bars showing exactly where you are in the claim process and what action to take next.',
      icon: Compass,
    },
    {
      title: 'Contextual AI Assistant',
      desc: 'Ask questions using your real FinClosure context. Receive compassionate guidance without confusing legal jargon.',
      icon: Bot,
    },
    {
      title: 'Private & Secure Storage Abstraction',
      desc: 'Your uploaded financial and identity records are isolated, encrypted, and accessible only to your authenticated session.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-950 text-teal-300 border border-teal-800/60 inline-block mb-4">
            Platform Capabilities
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">FinClosure Core Features</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-base">
            Designed to turn chaotic financial settlement into a clear, manageable, step-by-step path.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="glass-card p-6 rounded-2xl border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-teal-950 text-teal-400 border border-teal-800/80 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};
