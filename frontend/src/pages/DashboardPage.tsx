import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../services/apiServices';
import { DashboardData } from '../types';
import { DashboardHeader } from '../components/DashboardHeader';
import { KpiCard } from '../components/KpiCard';
import { ClosureProgressCard } from '../components/ClosureProgressCard';
import { HeroBannerCard } from '../components/HeroBannerCard';
import { AIAssistantPanel } from '../components/AIAssistantPanel';
import { AssetsCard } from '../components/AssetsCard';
import { LiabilitiesCard } from '../components/LiabilitiesCard';
import { MoneyToRecoverCard } from '../components/MoneyToRecoverCard';
import { DocumentsPanel } from '../components/DocumentsPanel';
import { ActiveClaimCard } from '../components/ActiveClaimCard';
import { Landmark, ShieldCheck, FileCheck, Users, Heart, Lock, CheckCircle2, AlertCircle, Award, Landmark as BankIcon, CreditCard } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardApi.getData();
        setData(res);
      } catch (err) {
        console.error('[Dashboard Fetch Error]', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-500 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-bold text-slate-700">Loading FinClosure Financial Discovery...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 bg-[#F7F9F8] min-h-screen text-slate-900 font-sans select-none">
      {/* Header */}
      <DashboardHeader />

      {/* Discovery Headline Banner matching Requirement 6 */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Financial Footprint Found
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
                ✓ AI Scan Complete
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Verified portfolio discovered for Late Rajesh Sharma (DEMO Profile)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            🔒 Masked Aadhaar: XXXX XXXX 4821
          </span>
          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            🛡️ Masked PAN: ABCDE****F
          </span>
        </div>
      </div>

      {/* 6 KPI Cards Grid matching Requirement 6 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <KpiCard
          title="Total Assets"
          value="₹1.18 Cr+"
          subtitle="6 items found"
          icon={Landmark}
          colorScheme="emerald"
          linkTo="/assets"
        />
        <KpiCard
          title="Insurance Coverage"
          value="₹1.05 Cr+"
          subtitle="LIC & Star Health"
          icon={ShieldCheck}
          colorScheme="emerald"
          linkTo="/assets?tab=Insurance"
        />
        <KpiCard
          title="Investments"
          value="₹6.00 L"
          subtitle="Axis FD & Reliance Stocks"
          icon={BankIcon}
          colorScheme="blue"
          linkTo="/assets?tab=Investments"
        />
        <KpiCard
          title="Government Benefits"
          value="₹3.00 L"
          subtitle="EPFO Pension / Benefit"
          icon={Award}
          colorScheme="purple"
          linkTo="/assets?tab=Government"
        />
        <KpiCard
          title="Outstanding Loans"
          value="₹5.50 L"
          subtitle="Home & Vehicle Loan"
          icon={CreditCard}
          colorScheme="rose"
          linkTo="/assets?tab=Liabilities"
        />
        <KpiCard
          title="Money to Recover"
          value="₹1.10 L"
          subtitle="3 receivables pending"
          icon={Users}
          colorScheme="amber"
          linkTo="/assets?tab=Money+to+Recover"
        />
      </div>

      {/* Security & Privacy Section matching Requirement 9 */}
      <div className="p-4 rounded-2xl bg-emerald-950 text-white border border-emerald-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-800 text-emerald-300 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Your financial information is protected.</h4>
            <p className="text-[11px] text-emerald-200/80">
              Identity numbers are masked, sensitive numbers are never shown in full, and demo data is isolated.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-[11px] text-emerald-300 font-semibold shrink-0">
          <span className="flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Identity Masked</span>
          </span>
          <span className="flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Demo Isolated</span>
          </span>
          <span className="flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>User Consent Verified</span>
          </span>
        </div>
      </div>

      {/* Middle Section: Closure Progress, Hero Banner, AI Assistant Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-4 h-full">
          <ClosureProgressCard />
        </div>

        <div className="lg:col-span-4 h-full">
          <HeroBannerCard />
        </div>

        <div className="lg:col-span-4 h-full">
          <AIAssistantPanel />
        </div>
      </div>

      {/* Lower Section: Assets (Left), Liabilities (Center), Money to Recover & Documents (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-4 h-full">
          <AssetsCard />
        </div>

        <div className="lg:col-span-4 h-full">
          <LiabilitiesCard />
        </div>

        <div className="lg:col-span-4 space-y-5 flex flex-col justify-between">
          <MoneyToRecoverCard />
          <DocumentsPanel />
        </div>
      </div>

      {/* Bottom Section: Active Claim Stepper Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        <div className="lg:col-span-9">
          <ActiveClaimCard />
        </div>

        <div className="lg:col-span-3 h-full">
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white p-5 shadow-2xs h-full min-h-[160px] flex flex-col justify-between group">
            <img
              src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=400&q=80"
              alt="Plant aesthetic"
              className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="relative z-10 flex justify-end">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center shadow-xs">
                <Heart className="w-4 h-4" />
              </div>
            </div>
            <div className="relative z-10 space-y-1">
              <p className="text-xs font-serif italic text-slate-800 font-bold leading-tight">
                “A more secure tomorrow for their loved ones.”
              </p>
              <p className="text-[10px] text-slate-500 font-semibold">
                FinClosure Family Support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

