import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Landmark,
  CreditCard,
  FileCheck,
  FileText,
  HandCoins,
  Bot,
  BarChart3,
  HeartHandshake,
  LogOut,
  X,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { user, logout, isDemoMode } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home', path: '/dashboard', icon: Home },
    { label: 'Assets', path: '/assets', icon: Landmark },
    { label: 'Liabilities', path: '/assets?tab=Liabilities', icon: CreditCard },
    { label: 'Claims', path: '/claims', icon: FileCheck },
    { label: 'Documents', path: '/documents', icon: FileText },
    { label: 'Recovery', path: '/assets?tab=Money+to+Recover', icon: HandCoins },
    { label: 'AI Assistant', path: '/assistant', icon: Bot },
    { label: 'Reports', path: '/documents', icon: BarChart3 },
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
          className="md:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        className={`w-64 bg-[#122A23] text-slate-200 flex flex-col h-screen fixed md:sticky top-0 left-0 z-50 transition-transform duration-300 shrink-0 select-none ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header matching Reference Screen */}
        <div className="p-5 border-b border-emerald-900/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-700/80 text-white flex items-center justify-center shadow-md">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white leading-tight">
                FinClosure
              </h1>
              <p className="text-[10px] text-emerald-400 font-medium tracking-wide">
                Closing Finances. Securing Futures.
              </p>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 text-emerald-400 hover:text-white rounded-lg"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List matching Reference Screen */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#1E4D3E] text-white shadow-xs font-black'
                      : 'text-slate-300 hover:bg-emerald-900/30 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 mr-3 shrink-0 text-emerald-400" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Bottom Emotional Story Card matching Reference Screen */}
        <div className="p-4 border-t border-emerald-900/40 space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-emerald-800/40 bg-slate-900 text-white p-3.5 shadow-md">
            {/* Background photographic overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80')`,
              }}
            />
            <div className="relative z-10 space-y-1">
              <p className="text-[11px] font-serif italic text-emerald-200 leading-snug">
                "Not just finances, but peace for the ones who stay."
              </p>
              <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">
                Together for brighter tomorrows.
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-3 py-2 text-xs font-bold rounded-xl transition-all border border-emerald-800/60 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900"
          >
            <LogOut className="w-3.5 h-3.5 mr-2" />
            <span>{isDemoMode ? 'Exit Demo Mode' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
