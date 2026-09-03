import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard,
  Landmark,
  FileCheck,
  Sparkles,
  Menu,
} from 'lucide-react';

interface MobileBottomNavProps {
  onToggleTalkingAgent: () => void;
  onToggleMobileDrawer: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onToggleTalkingAgent,
  onToggleMobileDrawer,
}) => {
  const { t } = useLanguage();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-2 min-w-[56px] text-[10px] font-medium transition-colors ${
            isActive ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'
          }`
        }
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span>{t('navDashboard')}</span>
      </NavLink>

      <NavLink
        to="/assets"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-2 min-w-[56px] text-[10px] font-medium transition-colors ${
            isActive ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'
          }`
        }
      >
        <Landmark className="w-5 h-5 mb-0.5" />
        <span>{t('navAssets')}</span>
      </NavLink>

      {/* Center Action: Voice Agent */}
      <button
        onClick={onToggleTalkingAgent}
        className="flex flex-col items-center justify-center -mt-4 w-12 h-12 rounded-full bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-950 transition-transform active:scale-95 border-2 border-slate-900"
        title="Talk to FinClosure AI Voice Agent"
      >
        <Sparkles className="w-5 h-5" />
      </button>

      <NavLink
        to="/claims"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-2 min-w-[56px] text-[10px] font-medium transition-colors ${
            isActive ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'
          }`
        }
      >
        <FileCheck className="w-5 h-5 mb-0.5" />
        <span>{t('navClaims')}</span>
      </NavLink>

      <button
        onClick={onToggleMobileDrawer}
        className="flex flex-col items-center py-1 px-2 min-w-[56px] text-[10px] font-medium text-slate-400 hover:text-slate-200 transition-colors"
      >
        <Menu className="w-5 h-5 mb-0.5" />
        <span>Menu</span>
      </button>
    </div>
  );
};
