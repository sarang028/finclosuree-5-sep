import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { TalkingAgentModal } from './TalkingAgentModal';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Bell, RefreshCw, Menu, HeartHandshake } from 'lucide-react';
import { demoApi } from '../services/apiServices';

export const AppLayout: React.FC = () => {
  const [isSeedingDemo, setIsSeedingDemo] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState<string | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isTalkingAgentOpen, setIsTalkingAgentOpen] = useState(false);

  const { t } = useLanguage();
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
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-100">
      {/* Sidebar Drawer */}
      <Sidebar
        isOpenMobile={isMobileDrawerOpen}
        onCloseMobile={() => setIsMobileDrawerOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/90 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center md:hidden">
                <HeartHandshake className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-950 text-teal-300 border border-teal-800/60 hidden sm:flex items-center">
                <span className="w-2 h-2 rounded-full bg-teal-400 mr-2 animate-pulse" />
                {t('activeSession')}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Selector */}
            <LanguageSelector compact className="shrink-0" />

            {/* Talking Agent Trigger */}
            <button
              onClick={() => setIsTalkingAgentOpen(true)}
              className="hidden sm:inline-flex items-center px-3 py-1.5 text-xs font-semibold text-teal-300 bg-teal-950/80 hover:bg-teal-900 border border-teal-700/60 rounded-lg transition-all shadow-sm"
              title="Talk to FinClosure Voice Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
              <span>{t('talkToAi')}</span>
            </button>

            {/* Hackathon Demo Loader */}
            <button
              onClick={handleSeedDemo}
              disabled={isSeedingDemo}
              className="inline-flex items-center px-2.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all"
              title="Load Hackathon Sample Scenario"
            >
              {isSeedingDemo ? (
                <RefreshCw className="w-3.5 h-3.5 sm:mr-1.5 animate-spin text-teal-400" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 sm:mr-1.5 text-amber-400" />
              )}
              <span className="hidden sm:inline">
                {isSeedingDemo ? t('seedingDemo') : t('loadDemo')}
              </span>
            </button>

            <button
              onClick={() => navigate('/notifications')}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors relative"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {seedSuccess && (
          <div className="bg-teal-950 border-b border-teal-800 text-teal-200 text-xs px-4 py-2 flex items-center justify-between">
            <span>✨ {seedSuccess}</span>
          </div>
        )}

        {/* Page Main Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
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
