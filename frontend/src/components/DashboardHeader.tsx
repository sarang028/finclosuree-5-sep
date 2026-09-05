import React from 'react';
import { Search, Bell, Info, Globe, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

export const DashboardHeader: React.FC = () => {
  const { user, isDemoMode, exitDemo } = useAuth();
  const { language } = useLanguage();

  const userName = user?.fullName?.split(' ')[0] || 'Priya';

  return (
    <div className="space-y-4">
      {/* Top Bar with Search, Notifications, Profile & Demo Mode Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Welcome Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center">
            Good Morning, {userName} 👋
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
            Let's continue your financial closure journey.
          </p>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
          {/* Search Input matching reference image */}
          <div className="relative shrink-0 w-44 sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-9 pr-3 py-2 bg-slate-200/60 border border-slate-300/80 rounded-xl text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-emerald-700"
            />
          </div>

          {/* Notifications Button with Red Badge count 6 */}
          <button className="relative p-2 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-xl shadow-2xs">
            <Bell className="w-4 h-4 text-slate-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white font-black text-[9px] flex items-center justify-center border-2 border-white">
              6
            </span>
          </button>

          {/* User Profile Capsule */}
          <div className="flex items-center space-x-2 p-1 pl-1.5 pr-2.5 bg-white border border-slate-200/80 rounded-xl shadow-2xs cursor-pointer hover:bg-slate-50">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="Priya"
              className="w-7 h-7 rounded-full object-cover border border-slate-300"
            />
            <span className="text-xs font-bold text-slate-800">{userName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Language Selector */}
          <LanguageSelector compact className="shrink-0" />

          {/* DEMO MODE Pill Badge matching Reference Screen */}
          {isDemoMode && (
            <div className="px-3 py-1.5 bg-emerald-50/90 border border-emerald-300 text-emerald-950 rounded-xl flex items-center space-x-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <div className="text-[10px] font-extrabold leading-tight">
                <span className="block font-black text-emerald-950">✓ DEMO MODE</span>
                <span className="text-[9px] text-emerald-800 font-semibold hidden sm:inline">
                  Sample data for presentation only
                </span>
              </div>
              <span title="Simulated Hackathon Environment">
                <Info className="w-3.5 h-3.5 text-emerald-700 ml-1 cursor-pointer" />
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Quote & Deceased Person Framed Portrait matching Reference Screen */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-1">
        {/* Quote text */}
        <p className="text-xs sm:text-sm font-serif italic text-slate-600 max-w-lg leading-relaxed">
          “A life well lived leaves behind more than memories. We help you find what matters.”
        </p>

        {/* Framed Photo of Deceased Person (Late Rajesh Kumar) matching Reference Screen */}
        <div className="flex items-center space-x-4 p-2.5 pr-4 bg-white/90 border border-slate-200 rounded-2xl shadow-xs shrink-0">
          {/* Wooden Frame Photo Container */}
          <div className="relative w-14 h-16 rounded-xl border-4 border-[#5C3A21] bg-slate-900 shadow-md overflow-hidden shrink-0">
            <img
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80"
              alt="Rajesh Kumar"
              className="w-full h-full object-cover grayscale opacity-90"
            />
          </div>

          <div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 block w-max mb-0.5">
              Deceased Profile
            </span>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">Rajesh Kumar</h3>
            <p className="text-[11px] font-semibold text-slate-500 font-mono">12 Jan 1975 – 03 Nov 2024</p>
          </div>

          <div className="pl-3 border-l border-slate-200 hidden sm:block">
            <span className="font-serif italic text-xs text-amber-900/80 block">Their story lives on...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
