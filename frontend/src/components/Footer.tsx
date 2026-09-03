import React from 'react';
import { HeartHandshake, Shield, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-sm py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">FinClosure</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed mb-4">
              Closing Finances. Securing Futures. GenAI-powered financial closure workflow dedicated to supporting nominees and legal heirs with compassion, security, and clarity.
            </p>
            <div className="flex items-center space-x-4 text-xs text-slate-500">
              <span className="flex items-center">
                <Shield className="w-3.5 h-3.5 mr-1 text-teal-500" /> AES-256 Encrypted
              </span>
              <span className="flex items-center">
                <Lock className="w-3.5 h-3.5 mr-1 text-teal-500" /> Private & Protected
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Platform</h4>
            <ul className="space-y-2">
              <li><a href="/how-it-works" className="hover:text-teal-400 transition-colors">How It Works</a></li>
              <li><a href="/features" className="hover:text-teal-400 transition-colors">Key Features</a></li>
              <li><a href="/about" className="hover:text-teal-400 transition-colors">Our Mission</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Trust & Legal Notice</h4>
            <p className="text-xs text-slate-500 leading-normal">
              FinClosure is an assistance workflow platform and does not provide legal, financial, or tax advice. Always confirm formal requirements with financial institutions.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FinClosure. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Built with care for families during sensitive transitions.</p>
        </div>
      </div>
    </footer>
  );
};
