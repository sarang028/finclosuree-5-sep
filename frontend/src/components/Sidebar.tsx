import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Landmark,
  FileCheck,
  FileText,
  CreditCard,
  HandCoins,
  Bot,
  User,
  LogOut,
  X,
  Leaf,
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
  const { logout, isDemoMode } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Assets', path: '/assets', icon: Landmark },
    { label: 'Claims', path: '/claims', icon: FileCheck },
    { label: 'Documents', path: '/documents', icon: FileText },
    { label: 'Liabilities', path: '/assets?tab=Liabilities', icon: CreditCard },
    { label: 'Money to Recover', path: '/assets?tab=Money+to+Recover', icon: HandCoins },
    { label: 'AI Assistant', path: '/assistant', icon: Bot },
    { label: 'Profile', path: '/profile', icon: User },
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
        className={`w-60 sm:w-64 bg-[#EEF4F0] text-slate-800 border-r border-slate-300/70 flex flex-col h-screen fixed md:sticky top-0 left-0 z-50 transition-transform duration-300 shrink-0 select-none ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header matching Reference Image */}
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <Leaf className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900 leading-tight">
                FinClosure
              </h1>
              <p className="text-[10px] text-emerald-800 font-semibold tracking-wide">
                For the journeys that live on
              </p>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 text-slate-500 hover:text-slate-900 rounded-lg"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List matching Reference Image */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
                      ? 'bg-[#C2E7D9] text-[#0F382B] shadow-2xs font-extrabold border border-emerald-300/60'
                      : 'text-slate-600 hover:bg-emerald-100/50 hover:text-emerald-950'
                  }`
                }
              >
                <Icon className="w-4 h-4 mr-3 shrink-0 text-emerald-800" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Bottom Family Silhouette Illustration matching Reference Image */}
        <div className="p-4 border-t border-slate-200/80 space-y-3 relative overflow-hidden bg-gradient-to-b from-[#EEF4F0] to-[#E2EBE5]">
          {/* Family Silhouette SVG Illustration */}
          <div className="relative py-2 flex flex-col items-center justify-center text-center space-y-2">
            <svg viewBox="0 0 200 90" className="w-full h-20 text-emerald-900/30 opacity-70" fill="currentColor">
              {/* Soft Hills */}
              <path d="M0,90 Q50,60 100,75 T200,90 L200,90 L0,90 Z" fill="currentColor" opacity="0.4" />
              <path d="M0,90 Q80,45 150,65 T200,80 L200,90 L0,90 Z" fill="currentColor" opacity="0.6" />
              {/* Family Silhouettes */}
              {/* Adult 1 */}
              <circle cx="85" cy="40" r="4.5" />
              <path d="M80,58 C80,47 90,47 90,58 L89,75 L81,75 Z" />
              {/* Adult 2 */}
              <circle cx="98" cy="43" r="4" />
              <path d="M94,59 C94,49 102,49 102,59 L101,75 L95,75 Z" />
              {/* Child holding hand */}
              <circle cx="110" cy="52" r="3" />
              <path d="M107,63 C107,56 113,56 113,63 L112,75 L108,75 Z" />
              {/* Birds in sky */}
              <path d="M140,25 Q145,20 150,25 Q155,20 160,25" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M125,18 Q129,14 133,18 Q137,14 141,18" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>

            <p className="text-[11px] font-serif italic text-emerald-950 font-bold leading-tight px-1">
              "A lighter tomorrow for the ones they love."
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-3 py-2 text-xs font-bold rounded-xl transition-all border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5 mr-2 text-emerald-800" />
            <span>{isDemoMode ? 'Exit Demo Mode' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
