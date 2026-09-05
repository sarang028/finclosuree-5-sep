import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dashboardApi } from '../services/apiServices';
import { DashboardData } from '../types';
import { ProgressRing } from '../components/ProgressRing';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { TalkingAgentModal } from '../components/TalkingAgentModal';
import {
  Landmark,
  FileText,
  FileCheck,
  CreditCard,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  HandCoins,
  ShieldCheck,
  Building,
  AlertCircle,
  Clock,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoiceAgentOpen, setIsVoiceAgentOpen] = useState(false);

  const { t } = useLanguage();
  const { user, isDemoMode } = useAuth();
  const navigate = useNavigate();

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
      <div className="py-16 text-center text-slate-500">
        <div className="w-8 h-8 border-4 border-finclosure-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold">Loading dashboard overview...</p>
      </div>
    );
  }

  const stats = data?.stats || {
    totalAssets: 6,
    totalAssetsValue: 11800000,
    totalLiabilitiesCount: 2,
    totalLiabilitiesValue: 650000,
    totalRecoverableCount: 3,
    totalRecoverableValue: 110000,
    potentialAssets: 1,
    confirmedAssets: 5,
    activeClaims: 2,
    completedClaims: 0,
    pendingDocuments: 9,
    closureProgressPercentage: 65,
  };

  const activeDeceased = data?.activeDeceasedProfile;
  const userName = user?.fullName?.split(' ')[0] || 'Ankit';

  return (
    <div className="space-y-6">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Dashboard
            </h1>
            {isDemoMode && (
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 border border-amber-600 shadow-2xs">
                DEMO MODE
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Welcome back, {userName} 👋 {isDemoMode && '— Viewing Late Rajesh Sharma (DEMO Profile)'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsVoiceAgentOpen(true)}
            className="px-3.5 py-2 text-xs font-bold text-finclosure-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all shadow-2xs flex items-center"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-finclosure-800" />
            <span>Talking Agent</span>
          </button>
          <Link
            to="/assets"
            className="px-3.5 py-2 text-xs font-bold text-white bg-finclosure-800 hover:bg-finclosure-900 rounded-xl transition-all shadow-sm flex items-center"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Add Asset</span>
          </Link>
        </div>
      </div>

      {/* 5 Key Metric Cards Grid (Total Assets, Total Liabilities, Money to Recover, Documents, Claims) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Assets Summary Card */}
        <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Landmark className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-emerald-950">Total Assets</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{stats.totalAssets || 6}</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Holdings & Policies</div>
          </div>
          <div className="text-xs font-extrabold text-emerald-800 mt-3 pt-2 border-t border-emerald-200/60">
            ₹1,18,00,000 <span className="text-[10px] text-slate-500 font-medium">(₹1.18 Cr)</span>
          </div>
        </div>

        {/* Total Liabilities Summary Card */}
        <div className="bg-rose-50/80 border border-rose-200 p-4 rounded-2xl flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-rose-950">Liabilities</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{stats.totalLiabilitiesCount || 2}</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Loans Outstanding</div>
          </div>
          <div className="text-xs font-extrabold text-rose-800 mt-3 pt-2 border-t border-rose-200/60">
            ₹6,50,000 <span className="text-[10px] font-bold text-rose-600">(Pending)</span>
          </div>
        </div>

        {/* Money to Recover Summary Card */}
        <div className="bg-sky-50/80 border border-sky-200 p-4 rounded-2xl flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
                <HandCoins className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-sky-950">Money to Recover</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{stats.totalRecoverableCount || 3}</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Personal & Relative Loans</div>
          </div>
          <div className="text-xs font-extrabold text-sky-800 mt-3 pt-2 border-t border-sky-200/60">
            ₹1,10,000 <span className="text-[10px] font-bold text-sky-600">(Receivable)</span>
          </div>
        </div>

        {/* Documents Summary Card */}
        <div className="bg-purple-50/80 border border-purple-200 p-4 rounded-2xl flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-purple-950">Documents</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{stats.pendingDocuments || 9}</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Uploaded & Extracted</div>
          </div>
          <div className="text-xs font-extrabold text-purple-800 mt-3 pt-2 border-t border-purple-200/60">
            9 Verified Files
          </div>
        </div>

        {/* Claims Summary Card */}
        <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-amber-950">Claims</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{stats.activeClaims || 2}</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-0.5">In Progress</div>
          </div>
          <div className="text-xs font-extrabold text-amber-800 mt-3 pt-2 border-t border-amber-200/60">
            Active Settlements
          </div>
        </div>
      </div>

      {/* Main Portfolio Overview & Status Badges Card */}
      <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-3xl shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center">
              <span>Financial Portfolio Breakdown</span>
              {isDemoMode && (
                <span className="ml-2 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                  DEMO RECORDS
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Overview of assets, liabilities, receivables & active status badges
            </p>
          </div>
          <Link to="/assets" className="text-xs font-bold text-finclosure-800 hover:underline flex items-center">
            <span>View All Records</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {/* 3 Columns: Assets, Liabilities, Money to Recover */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Column 1: Assets */}
          <div className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
              <span className="text-xs font-extrabold text-emerald-950 flex items-center">
                <Landmark className="w-3.5 h-3.5 mr-1.5 text-emerald-700" />
                ASSETS (₹1,18,00,000)
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                6 Items
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Life Insurance Policy</span>
                  <span className="font-black text-emerald-800">₹1,00,00,000</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">LIC of India</span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold border border-amber-200">
                    Claim Not Started
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Axis Bank Savings</span>
                  <span className="font-black text-slate-900">₹4,00,000</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Axis Bank</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold border border-emerald-200">
                    Confirmed
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Bank FD (Axis Bank FD)</span>
                  <span className="font-black text-slate-900">₹4,00,000</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Axis Bank</span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold border border-amber-200">
                    Claim Not Started
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Health Insurance</span>
                  <span className="font-black text-slate-900">₹5,00,000</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Star Health</span>
                  <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-900 font-bold border border-teal-200">
                    Policy Active / Guidance
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Government Scheme</span>
                  <span className="font-black text-slate-900">₹3,00,000</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">GOI / EPFO</span>
                  <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 font-bold border border-purple-200">
                    Eligibility/Claim Pending
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Reliance / Jio Stocks</span>
                  <span className="font-black text-slate-900">₹2,00,000</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Reliance / Jio</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold border border-emerald-200">
                    Confirmed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Liabilities */}
          <div className="bg-rose-50/40 border border-rose-100 p-4 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-rose-200/60">
              <span className="text-xs font-extrabold text-rose-950 flex items-center">
                <CreditCard className="w-3.5 h-3.5 mr-1.5 text-rose-700" />
                LIABILITIES (₹6,50,000)
              </span>
              <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
                2 Loans
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">Home Loan</span>
                  <span className="font-black text-rose-700">₹4,00,000</span>
                </div>
                <p className="text-[11px] text-slate-500">HDFC Housing Finance</p>
                <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Category: Housing Loan</span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 font-bold border border-rose-200">
                    Outstanding
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">Vehicle Loan</span>
                  <span className="font-black text-rose-700">₹2,50,000</span>
                </div>
                <p className="text-[11px] text-slate-500">SBI Auto Loan (Demo Value)</p>
                <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Category: Vehicle Loan</span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 font-bold border border-rose-200">
                    Outstanding
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Money to Recover */}
          <div className="bg-sky-50/40 border border-sky-100 p-4 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-sky-200/60">
              <span className="text-xs font-extrabold text-sky-950 flex items-center">
                <HandCoins className="w-3.5 h-3.5 mr-1.5 text-sky-700" />
                MONEY TO RECOVER (₹1,10,000)
              </span>
              <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
                3 Debtors
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">Rakesh</span>
                  <span className="font-black text-sky-800">₹30,000</span>
                </div>
                <p className="text-[11px] text-slate-500">Friend/Relative Loan</p>
                <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Receivable</span>
                  <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-900 font-bold border border-sky-200">
                    Recovery Pending
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">Shreyansh</span>
                  <span className="font-black text-sky-800">₹30,000</span>
                </div>
                <p className="text-[11px] text-slate-500">Friend/Relative Loan</p>
                <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Receivable</span>
                  <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-900 font-bold border border-sky-200">
                    Recovery Pending
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">Rahul + Anuj</span>
                  <span className="font-black text-sky-800">₹50,000</span>
                </div>
                <p className="text-[11px] text-slate-500">Combined Personal Loan</p>
                <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Receivable</span>
                  <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-900 font-bold border border-sky-200">
                    Recovery Pending
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Overall Progress Ring + Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Overall Progress Card */}
        <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-3xl shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-extrabold text-slate-900">Overall Closure Progress</h2>
            <Link to="/claims" className="text-xs font-bold text-finclosure-800 hover:underline">
              View Details
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 py-2">
            <ProgressRing percentage={stats.closureProgressPercentage || 65} size={110} />
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-base font-bold text-slate-900">Demo Progress Status</h3>
              <p className="text-xs text-slate-500 mt-1 mb-3">6 of 9 records processed</p>
              
              <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Deceased Profile Loaded (Late Rajesh Sharma)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>6 Assets, 2 Liabilities, 3 Receivables Recorded</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>9 Documents Uploaded & Analyzed</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(isDemoMode ? '/claims/demo_claim_1' : '/claims')}
            className="w-full mt-4 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center"
          >
            <span>View Claim Processing Journey</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-3xl shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-extrabold text-slate-900">Recent Activity Log</h2>
            <Link to="/notifications" className="text-xs font-bold text-finclosure-800 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Life Insurance Policy Bond loaded (₹1 Crore)</p>
                  <p className="text-[11px] text-slate-500">Just now</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Axis Bank Statement & FD Certificate verified</p>
                  <p className="text-[11px] text-slate-500">1 hour ago</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Home Loan & Vehicle Loan liabilities logged</p>
                  <p className="text-[11px] text-slate-500">2 hours ago</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
                  <HandCoins className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Receivables recorded: Rakesh, Shreyansh, Rahul+Anuj</p>
                  <p className="text-[11px] text-slate-500">3 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Assistant Modal */}
      <TalkingAgentModal
        isOpen={isVoiceAgentOpen}
        onClose={() => setIsVoiceAgentOpen(false)}
        deceasedId={activeDeceased?._id}
      />
    </div>
  );
};
