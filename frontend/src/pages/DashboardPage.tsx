import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dashboardApi } from '../services/apiServices';
import { DashboardData } from '../types';
import { ProgressRing } from '../components/ProgressRing';
import { useLanguage } from '../context/LanguageContext';
import { TalkingAgentModal } from '../components/TalkingAgentModal';
import {
  Landmark,
  FileText,
  FileCheck,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Plus,
  CheckCircle2,
  Clock,
  Mic,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoiceAgentOpen, setIsVoiceAgentOpen] = useState(false);

  const { t } = useLanguage();
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
      <div className="py-12 text-center text-slate-400">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-medium">Calculating financial closure status...</p>
      </div>
    );
  }

  const stats = data?.stats || {
    totalAssets: 0,
    potentialAssets: 0,
    confirmedAssets: 0,
    activeClaims: 0,
    completedClaims: 0,
    pendingDocuments: 0,
    closureProgressPercentage: 0,
  };

  const activeDeceased = data?.activeDeceasedProfile;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
              {t('activeProfile')}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400 font-medium">{activeDeceased?.relationship || 'Family Record'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {activeDeceased ? activeDeceased.fullName : 'Deceased Profile Overview'}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Claimant Role: <span className="text-slate-200 font-medium">{activeDeceased?.claimantRole || 'Nominee'}</span>
          </p>
        </div>

        <div className="flex items-center space-x-2.5 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
          <button
            onClick={() => setIsVoiceAgentOpen(true)}
            className="flex-1 sm:flex-initial px-3.5 py-2.5 text-xs font-bold text-teal-300 bg-teal-950/80 hover:bg-teal-900 border border-teal-800/60 rounded-xl transition-all flex items-center justify-center shadow-sm"
          >
            <Mic className="w-4 h-4 mr-2 text-teal-400 animate-pulse" />
            {t('talkToAi')}
          </button>
          <Link
            to="/assets"
            className="flex-1 sm:flex-initial px-3.5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-xl transition-all shadow-md flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            {t('addAsset')}
          </Link>
        </div>
      </div>

      {/* Progress & Core Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        {/* Overall FinClosure Progress Meter Card */}
        <div className="md:col-span-1 glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center">
          <ProgressRing percentage={stats.closureProgressPercentage} size={120} label={t('closureProgress')} />
          <p className="text-[11px] text-slate-400 mt-3 max-w-[200px] leading-tight">
            {t('closureProgressDesc')}
          </p>
        </div>

        {/* Stats Grid Cards */}
        <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="glass-card p-4 sm:p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">{t('totalAssets')}</span>
              <Landmark className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">{stats.totalAssets}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center flex-wrap">
              <span className="text-teal-400 font-semibold mr-1">{stats.confirmedAssets} {t('confirmedAssets')}</span>
            </div>
          </div>

          <div className="glass-card p-4 sm:p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">{t('activeClaims')}</span>
              <FileCheck className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">{stats.activeClaims}</div>
            <div className="text-[11px] text-slate-400 mt-1">
              <span className="text-emerald-400 font-semibold">{stats.completedClaims} {t('settledClaims')}</span>
            </div>
          </div>

          <div className="glass-card p-4 sm:p-5 rounded-2xl col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">{t('pendingDocs')}</span>
              <FileText className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">{stats.pendingDocuments}</div>
            <div className="text-[11px] text-slate-400 mt-1">Uploaded & pending review</div>
          </div>

          {/* Quick Action Tile */}
          <div
            onClick={() => navigate('/assets')}
            className="glass-card glass-card-hover p-4 sm:p-5 rounded-2xl cursor-pointer col-span-2 sm:col-span-3 flex items-center justify-between bg-slate-900/90 border-teal-900/30"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-teal-950 text-teal-400 flex items-center justify-center border border-teal-800/40">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">{t('aiDiscoveryTile')}</h4>
                <p className="text-[11px] sm:text-xs text-slate-400">{t('aiDiscoveryDesc')}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-teal-400" />
          </div>
        </div>
      </div>

      {/* Needs Your Attention Section */}
      <div>
        <h2 className="text-sm sm:text-base font-bold text-white mb-3 sm:mb-4 flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2 text-amber-400" />
          {t('needsAttention')}
        </h2>

        {data?.attentionItems && data.attentionItems.length > 0 ? (
          <div className="space-y-3">
            {data.attentionItems.map((item) => (
              <div
                key={item.id}
                className="glass-card p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white flex items-center">
                    <span className="w-2 h-2 rounded-full bg-amber-400 mr-2" />
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{item.message}</p>
                </div>
                <Link
                  to={item.link}
                  className="w-full sm:w-auto text-center px-3.5 py-2 text-xs font-semibold text-teal-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors shrink-0"
                >
                  {item.actionLabel}
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-6 rounded-xl text-center text-slate-400 text-xs">
            <CheckCircle2 className="w-6 h-6 text-teal-400 mx-auto mb-2" />
            {t('noAttentionItems')}
          </div>
        )}
      </div>

      {/* Recent Activity Audit Log */}
      <div>
        <h2 className="text-sm sm:text-base font-bold text-white mb-3 sm:mb-4 flex items-center">
          <Clock className="w-4 h-4 mr-2 text-slate-400" />
          {t('recentActivity')}
        </h2>

        <div className="glass-card rounded-2xl divide-y divide-slate-800/60 overflow-hidden">
          {data?.recentActivity && data.recentActivity.length > 0 ? (
            data.recentActivity.map((log) => (
              <div key={log._id} className="p-3.5 text-xs flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-200 mr-2">{log.action.replace('_', ' ')}</span>
                  <span className="text-slate-400 hidden sm:inline">{log.details}</span>
                </div>
                <span className="text-slate-500 font-mono text-[11px]">
                  {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-slate-500">{t('noRecentActivity')}</div>
          )}
        </div>
      </div>

      {/* Talking Agent Modal */}
      <TalkingAgentModal
        isOpen={isVoiceAgentOpen}
        onClose={() => setIsVoiceAgentOpen(false)}
        deceasedId={activeDeceased?._id}
      />
    </div>
  );
};
