import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { TalkingAgentModal } from './TalkingAgentModal';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Bell, RefreshCw, Menu, ShieldCheck, LogOut } from 'lucide-react';
import { demoApi } from '../services/apiServices';

export const AppLayout: React.FC = () => {
  const [isSeedingDemo, setIsSeedingDemo] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState<string | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isTalkingAgentOpen, setIsTalkingAgentOpen] = useState(false);

  const { t } = useLanguage();
  const { user, isDemoMode, exitDemo } = useAuth();
  const navigate = useNavigate();

  const handleSeedDemo = async () => {
    setIsSeedingDemo(true);
    setSeedSuccess(null);
    try {
      await demoApi.seed();
      setSeedSuccess(t('demoSuccess'));
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (err: any) {
      console.error('[Demo Seed Error]', err);
    } finally {
      setIsSeedingDemo(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 font-sans">
      {/* Sidebar Drawer */}
      <Sidebar
        isOpenMobile={isMobileDrawerOpen}
        onCloseMobile={() => setIsMobileDrawerOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        {/* Top App Banner when in Demo Mode */}
        {isDemoMode && (
          <div className="bg-amber-500 text-slate-950 font-extrabold text-xs px-4 py-2 flex items-center justify-between shadow-xs border-b border-amber-600 sticky top-0 z-40">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
              <span>⚠️ DEMO MODE — Simulated Demonstration Environment (No Database Writes)</span>
            </div>
            <button
              onClick={() => {
                exitDemo();
                navigate('/login');
              }}
              className="bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold px-3 py-1 rounded-lg text-xs transition-colors flex items-center space-x-1"
            >
              <span>Exit Demo</span>
              <LogOut className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        )}

        {/* Top App Header */}
        <header className="h-16 border-b border-slate-200 bg-white/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-finclosure-800 flex items-center justify-center md:hidden text-white shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight md:hidden">FinClosure</h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Selector */}
            <LanguageSelector compact className="shrink-0" />

            {/* Talking Agent Trigger */}
            <button
              onClick={() => setIsTalkingAgentOpen(true)}
              className="hidden sm:inline-flex items-center px-3 py-1.5 text-xs font-semibold text-finclosure-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all shadow-2xs"
              title="Talk to FinClosure Voice Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-finclosure-800" />
              <span>{t('talkToAi')}</span>
            </button>

            {/* Hackathon Demo Loader */}
            <button
              onClick={handleSeedDemo}
              disabled={isSeedingDemo}
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all"
              title="Load Hackathon Sample Scenario"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:mr-1.5 ${isSeedingDemo ? 'animate-spin text-finclosure-800' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">
                {isSeedingDemo ? t('seedingDemo') : t('loadDemo')}
              </span>
            </button>

            <button
              onClick={() => navigate('/notifications')}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>

            <div className="hidden md:flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-finclosure-800 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <span className="text-xs font-bold text-slate-800 truncate max-w-[100px]">
                {user?.fullName?.split(' ')[0] || 'User'}
              </span>
            </div>
          </div>
        </header>

        {seedSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs px-4 py-2 flex items-center justify-between font-semibold">
            <span>✨ {seedSuccess}</span>
          </div>
        )}

        {/* Page Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav
          onToggleTalkingAgent={() => setIsTalkingAgentOpen(true)}
          onToggleMobileDrawer={() => setIsMobileDrawerOpen((prev) => !prev)}
        />

        {/* Talking Agent Modal */}
        <TalkingAgentModal
          isOpen={isTalkingAgentOpen}
          onClose={() => setIsTalkingAgentOpen(false)}
        />
      </div>
    </div>
  );
};
