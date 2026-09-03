import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Landmark,
  FileText,
  FileCheck,
  Bot,
  Bell,
  LogOut,
  Sparkles,
  HeartHandshake,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const navItems = [
    { labelKey: 'navDashboard', path: '/dashboard', icon: LayoutDashboard },
    { labelKey: 'navProfile', path: '/profile', icon: User },
    { labelKey: 'navAssets', path: '/assets', icon: Landmark },
    { labelKey: 'navDocuments', path: '/documents', icon: FileText },
    { labelKey: 'navClaims', path: '/claims', icon: FileCheck },
    { labelKey: 'navAssistant', path: '/assistant', icon: Bot, highlight: true },
    { labelKey: 'navNotifications', path: '/notifications', icon: Bell },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="md:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        />
      )}

      <aside
        className={`w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed md:sticky top-0 left-0 z-50 transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shadow-md shadow-teal-900/30">
              <HeartHandshake className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">{t('brandName')}</h1>
              <p className="text-[11px] text-teal-400 font-medium">{t('tagline')}</p>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-900/40'
                      : item.highlight
                      ? 'text-teal-300 hover:bg-slate-800 bg-teal-950/40 border border-teal-800/40'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`
                }
              >
                <Icon className="w-4 h-4 mr-3 shrink-0" />
                <span className="truncate">{t(item.labelKey)}</span>
                {item.highlight && (
                  <Sparkles className="w-3.5 h-3.5 ml-auto text-teal-400 animate-pulse" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Language Selector & User Info Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-3">
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Language
            </label>
            <LanguageSelector />
          </div>

          <div className="flex items-center space-x-3 pt-2 border-t border-slate-800/60">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-teal-400 font-bold flex items-center justify-center text-xs border border-slate-700">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-semibold text-white truncate">{user?.fullName || 'Account'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-md transition-colors border border-slate-800 hover:border-rose-900/50"
          >
            <LogOut className="w-3.5 h-3.5 mr-2" />
            {t('signOut')}
          </button>
        </div>
      </aside>
    </>
  );
};
