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
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoiceAgentOpen, setIsVoiceAgentOpen] = useState(false);

  const { t } = useLanguage();
  const { user } = useAuth();
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
    totalAssets: 12,
    potentialAssets: 4,
    confirmedAssets: 12,
    activeClaims: 3,
    completedClaims: 1,
    pendingDocuments: 18,
    closureProgressPercentage: 68,
  };

  const activeDeceased = data?.activeDeceasedProfile;
  const userName = user?.fullName?.split(' ')[0] || 'Rohan';

  return (
    <div className="space-y-6">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Welcome back, {userName} 👋
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

      {/* 4 Summary Cards Grid matching Reference Image */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Assets Summary Card */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 p-4 rounded-2xl flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Landmark className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-emerald-950">Assets</span>
            </div>
            <div className="text-2xl font-black text-slate-900">{stats.totalAssets || 12}</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Discovered</div>
          </div>
          <div className="text-xs font-extrabold text-emerald-800 mt-3 pt-2 border-t border-emerald-200/60">
            ₹20,65,000
          </div>
        </div>

        {/* Liabilities Summary Card */}
        <div className="bg-rose-50/70 border border-rose-200/80 p-4 rounded-2xl flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-rose-950">Liabilities</span>
            </div>
            <div className="text-2xl font-black text-slate-900">5</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Recorded</div>
          </div>
          <div className="text-xs font-extrabold text-rose-800 mt-3 pt-2 border-t border-rose-200/60">
            ₹21,65,000
          </div>
        </div>

        {/* Documents Summary Card */}
        <div className="bg-blue-50/70 border border-blue-200/80 p-4 rounded-2xl flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-blue-950">Documents</span>
            </div>
            <div className="text-2xl font-black text-slate-900">{stats.pendingDocuments || 18}</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Uploaded</div>
          </div>
          <div className="text-xs font-extrabold text-blue-800 mt-3 pt-2 border-t border-blue-200/60">
            Verified Files
          </div>
        </div>

        {/* Claims Summary Card */}
        <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-2xl flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-amber-950">Claims</span>
            </div>
            <div className="text-2xl font-black text-slate-900">{stats.activeClaims || 3}</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-0.5">In Progress</div>
          </div>
          <div className="text-xs font-extrabold text-amber-800 mt-3 pt-2 border-t border-amber-200/60">
            Active Settlements
          </div>
        </div>
      </div>

      {/* Main Grid: Overall Progress Ring + Recent Activity matching Reference Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Overall Progress Card */}
        <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-3xl shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-extrabold text-slate-900">Overall Progress</h2>
            <Link to="/claims" className="text-xs font-bold text-finclosure-800 hover:underline">
              View Details
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 py-2">
            <ProgressRing percentage={stats.closureProgressPercentage || 68} size={110} />
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-base font-bold text-slate-900">You're doing great!</h3>
              <p className="text-xs text-slate-500 mt-1 mb-3">6 of 9 steps completed</p>
              
              <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Add Deceased Profile</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Discover Assets & Liabilities</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Upload Legal Documents</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/claims')}
            className="w-full mt-4 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-3xl shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-extrabold text-slate-900">Recent Activity</h2>
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
                  <p className="text-xs font-bold text-slate-900">SBI Savings Account added</p>
                  <p className="text-[11px] text-slate-500">2 hours ago</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">LIC Policy document uploaded</p>
                  <p className="text-[11px] text-slate-500">5 hours ago</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Home Loan liability recorded</p>
                  <p className="text-[11px] text-slate-500">1 day ago</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">EPF Claim created</p>
                  <p className="text-[11px] text-slate-500">2 days ago</p>
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
