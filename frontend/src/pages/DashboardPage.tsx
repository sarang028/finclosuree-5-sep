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
import { Landmark, CreditCard, FileCheck, Users, Heart } from 'lucide-react';

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
        <p className="text-xs font-bold text-slate-700">Loading FinClosure Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 bg-[#F7F9F8] min-h-screen text-slate-900 font-sans select-none">
      {/* Top Header matching Reference Screen */}
      <DashboardHeader />

      {/* Top KPI Cards Row (4 Columns matching Reference Screen) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <KpiCard
          title="Total Assets"
          value="₹1.18 Cr"
          subtitle="6 assets identified"
          icon={Landmark}
          colorScheme="emerald"
          linkTo="/assets"
        />
        <KpiCard
          title="Total Liabilities"
          value="₹4.00 Lakh"
          subtitle="2 outstanding"
          icon={CreditCard}
          colorScheme="rose"
          linkTo="/assets?tab=Liabilities"
        />
        <KpiCard
          title="Active Claims"
          value="3"
          subtitle="1 in verification"
          icon={FileCheck}
          colorScheme="blue"
          linkTo="/claims"
        />
        <KpiCard
          title="Money to Recover"
          value="₹1.10 Lakh"
          subtitle="3 people"
          icon={Users}
          colorScheme="purple"
          linkTo="/assets?tab=Money+to+Recover"
        />
      </div>

      {/* Middle Section: Closure Progress (Left), Hero Banner (Center), AI Assistant Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Financial Closure Progress (4 cols on lg) */}
        <div className="lg:col-span-4 h-full">
          <ClosureProgressCard />
        </div>

        {/* Hero Photographic Banner (4 cols on lg) */}
        <div className="lg:col-span-4 h-full">
          <HeroBannerCard />
        </div>

        {/* Persistent AI Assistant Panel (4 cols on lg) */}
        <div className="lg:col-span-4 h-full">
          <AIAssistantPanel />
        </div>
      </div>

      {/* Lower Section: Assets (Left), Liabilities (Center), Money to Recover & Documents (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Assets List Card (4 cols on lg) */}
        <div className="lg:col-span-4 h-full">
          <AssetsCard />
        </div>

        {/* Liabilities Card & Warning Box (4 cols on lg) */}
        <div className="lg:col-span-4 h-full">
          <LiabilitiesCard />
        </div>

        {/* Right Column: Money to Recover & Compact Documents Panel (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-5 flex flex-col justify-between">
          <MoneyToRecoverCard />
          <DocumentsPanel />
        </div>
      </div>

      {/* Bottom Section: Active Claim Stepper Card & Nature Aesthetic Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Active Claim Wide Timeline Card (9 cols on lg) */}
        <div className="lg:col-span-9">
          <ActiveClaimCard />
        </div>

        {/* Bottom Right Plant Photography Accent Card matching Reference Screen (3 cols on lg) */}
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
