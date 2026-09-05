import React from 'react';
import { Search, Bell, Calendar, ChevronDown, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

export const DashboardHeader: React.FC = () => {
  const { user, isDemoMode } = useAuth();
  const { language } = useLanguage();

  const userName = user?.fullName?.split(' ')[0] || 'Rajesh';

  return (
    <div className="relative overflow-hidden pt-1 pb-2">
      {/* Background House & Tree Illustration matching Reference Image */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-36 pointer-events-none opacity-20 -z-10 overflow-hidden">
        <svg viewBox="0 0 800 160" className="w-full h-full text-emerald-800" fill="currentColor">
          {/* Subtle house roof outline */}
          <path d="M400,20 L500,90 L300,90 Z" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" />
          <rect x="340" y="90" width="120" height="70" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
          <path d="M380,120 L380,160 M420,120 L420,160" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          {/* Gentle Trees & Leaves */}
          <path d="M260,160 Q260,110 240,90 Q220,110 220,160 Z" opacity="0.5" />
          <path d="M540,160 Q540,110 560,90 Q580,110 580,160 Z" opacity="0.5" />
          <path d="M180,160 Q180,125 170,110 Q160,125 160,160 Z" opacity="0.4" />
          <path d="M620,160 Q620,125 630,110 Q640,125 640,160 Z" opacity="0.4" />
        </svg>
      </div>

      {/* Top Navbar Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-9 pr-4 py-2 bg-white/80 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-700 shadow-2xs"
          />
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center space-x-3 self-end md:self-auto">
          {/* Quote top right matching Reference */}
          <span className="font-serif italic text-xs text-slate-600 hidden xl:inline max-w-xs text-right pr-2">
            “A life well lived leaves behind more than memories.”
          </span>

          {/* Notifications Button */}
          <button className="relative p-2 bg-white border border-slate-200 rounded-xl shadow-2xs hover:bg-slate-50">
            <Bell className="w-4 h-4 text-slate-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white font-black text-[9px] flex items-center justify-center border-2 border-white">
              6
            </span>
          </button>

          {/* User Profile Capsule matching Reference Image */}
          <div className="flex items-center space-x-2.5 p-1 pl-1.5 pr-3 bg-white border border-slate-200 rounded-xl shadow-2xs cursor-pointer hover:bg-slate-50">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
              alt="Rajesh Kumar"
              className="w-7 h-7 rounded-full object-cover border border-emerald-300"
            />
            <div className="text-left">
              <span className="text-xs font-bold text-slate-900 block leading-tight">Rajesh Kumar</span>
              <span className="text-[9px] font-semibold text-slate-500 block">Family Member</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <LanguageSelector compact className="shrink-0" />
        </div>
      </div>

      {/* Main Welcome Header Row matching Reference Image */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, {userName}
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
            Let's continue the journey towards financial closure.
          </p>
        </div>

        {/* Date & Peace Capsule matching Reference Image */}
        <div className="flex items-center space-x-2 shrink-0 bg-white/90 border border-slate-200 p-2 px-3 rounded-2xl shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block leading-tight">
              Thu, 5 Sep 2024
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              Take one step closer to peace of mind.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
