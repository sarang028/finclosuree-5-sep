import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { HeartHandshake, Shield, Compass } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <div className="w-12 h-12 rounded-2xl bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center mx-auto mb-4">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">About FinClosure</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-base">
            Our tagline embodies our singular focus: <span className="text-teal-400 font-semibold">"Closing Finances. Securing Futures."</span>
          </p>
        </div>

        <div className="glass-card p-8 rounded-2xl border-slate-800 space-y-6 text-sm text-slate-300 leading-relaxed mb-12">
          <h2 className="text-xl font-bold text-white mb-2">Our Mission</h2>
          <p>
            Losing a loved one is one of life’s most difficult moments. In the aftermath, families are often confronted with complex financial bureaucracy across multiple banks, insurers, investment funds, and pension boards.
          </p>
          <p>
            FinClosure was created to serve as an intelligent, compassionate workflow companion. We bring structure to financial asset discovery, document organization, and claim tracking so that legal heirs and nominees can navigate the closure process with clarity and peace of mind.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="font-bold text-white mb-1 flex items-center">
                <Compass className="w-4 h-4 mr-2 text-teal-400" /> Human-Centered Technology
              </h3>
              <p className="text-xs text-slate-400">Simple, respectful design that minimizes cognitive stress.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="font-bold text-white mb-1 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-teal-400" /> Responsible AI Principles
              </h3>
              <p className="text-xs text-slate-400">AI suggests and assists, but never fabricates or claims legal authority.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
