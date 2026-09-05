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
import { ActiveClaimCard } from '../components/ActiveClaimCard';
import {
  Landmark,
  ShieldCheck,
  Users,
  Lock,
  CheckCircle2,
  Award,
  Landmark as BankIcon,
  CreditCard,
  Shield,
  Eye,
  HeartHandshake,
  UserCheck,
} from 'lucide-react';

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
    <div className="relative min-h-screen bg-[#F0F5F2] text-slate-900 font-sans select-none overflow-hidden pb-12">
      {/* ================================================== */}
      {/* LAYERED BACKGROUND COMPOSITION (BACKGROUND — VERY IMPORTANT) */}
      {/* ================================================== */}

      {/* Ambient background tint overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#EBF3EE] via-[#F4F8F5] to-[#E6F0EA] pointer-events-none -z-20" />

      {/* Top Background SVG: Subtle house roof, trees & leaf line-art */}
      <div className="absolute top-0 right-0 w-full max-w-5xl h-64 pointer-events-none opacity-20 -z-10 overflow-hidden">
        <svg viewBox="0 0 1000 240" className="w-full h-full text-emerald-900" fill="currentColor">
          <path d="M500,40 L650,140 L350,140 Z" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4" />
          <path d="M750,160 Q850,110 950,160 T1050,160" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
          <path d="M100,200 Q200,140 300,200" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
          {/* Leaves */}
          <path d="M820,50 C840,40 860,60 850,80 C830,90 810,70 820,50 Z" opacity="0.3" />
          <path d="M860,70 C880,60 900,80 890,100 C870,110 850,90 860,70 Z" opacity="0.3" />
        </svg>
      </div>

      {/* Top Cursive Watermark matching Reference */}
      <div className="absolute top-10 right-28 pointer-events-none select-none font-cursive text-5xl text-emerald-950/15 font-bold tracking-wide hidden lg:block -z-10">
        Legacies Live On
      </div>

      {/* Left Margin Background SVG: Subtle family silhouettes & leaves */}
      <div className="absolute bottom-20 left-0 w-80 h-96 pointer-events-none opacity-15 -z-10 hidden xl:block">
        <svg viewBox="0 0 300 400" className="w-full h-full text-emerald-900" fill="currentColor">
          <path d="M0,400 Q80,320 180,360 T300,400 Z" opacity="0.5" />
          {/* Leaves line art */}
          <path d="M30,120 Q80,100 60,180 Q10,160 30,120 Z" opacity="0.4" />
          <path d="M70,180 Q120,160 100,240 Q50,220 70,180 Z" opacity="0.4" />
        </svg>
      </div>

      {/* Right Margin Vertical Watermark & Quick Values Column matching Reference Screen */}
      <div className="hidden xl:flex flex-col items-center justify-start space-y-6 fixed right-4 top-28 bottom-12 w-20 z-20 pointer-events-none select-none">
        {/* Cursive vertical watermark */}
        <div className="font-cursive text-2xl text-emerald-900/30 whitespace-nowrap -rotate-90 origin-center tracking-widest pt-8">
          Every End is a New Beginning
        </div>

        {/* 4 Vertical Floating Pill Badges */}
        <div className="mt-auto space-y-4 pointer-events-auto">
          <div className="flex flex-col items-center space-y-1 text-center group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-2xs text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-600">Security</span>
          </div>

          <div className="flex flex-col items-center space-y-1 text-center group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-2xs text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Eye className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-600">Clarity</span>
          </div>

          <div className="flex flex-col items-center space-y-1 text-center group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-2xs text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-600">Support</span>
          </div>

          <div className="flex flex-col items-center space-y-1 text-center group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-2xs text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserCheck className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-600 leading-tight">Together<br/>Forward</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout Container */}
      <div className="max-w-[1380px] mx-auto px-3 sm:px-5 lg:px-6 space-y-5">
        {/* Header */}
        <DashboardHeader />

        {/* Discovery Milestone Card matching Reference Image */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Financial Footprint Found
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-extrabold border border-emerald-300">
                  ✓ AI Scan Complete
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Verified portfolio discovered for Late Rajesh Sharma (DEMO Profile)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
              🔒 Masked Aadhaar: XXXX XXXX 4821
            </span>
            <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
              🛡️ Masked PAN: ABCDE****F
            </span>
          </div>
        </div>

        {/* 6 KPI Cards Grid matching Reference Image */}
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

        {/* Security Banner matching Reference Image */}
        <div className="p-4 rounded-2xl bg-[#0C3529] text-white border border-emerald-900 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-700">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">Your financial information is protected.</h4>
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

        {/* Main 3-Column Section matching Reference Image: Left (Progress) | Center (Story) | Right (AI Assistant) */}
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

        {/* Lower 3-Column Section: Assets | Liabilities | Money to Recover */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-4 h-full">
            <AssetsCard />
          </div>

          <div className="lg:col-span-4 h-full">
            <LiabilitiesCard />
          </div>

          <div className="lg:col-span-4 h-full">
            <MoneyToRecoverCard />
          </div>
        </div>

        {/* Claim Processing Stepper Card */}
        <div className="pt-2">
          <ActiveClaimCard />
        </div>
      </div>
    </div>
  );
};

