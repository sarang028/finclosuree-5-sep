import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Landmark,
  FileText,
  CreditCard,
  MoreHorizontal,
} from 'lucide-react';

interface MobileBottomNavProps {
  onToggleTalkingAgent: () => void;
  onToggleMobileDrawer: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onToggleMobileDrawer,
}) => {
  return (
    <nav aria-label="Mobile Bottom Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-2 min-w-[56px] text-[11px] font-medium transition-colors ${
            isActive ? 'text-finclosure-800 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/assets"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-2 min-w-[56px] text-[11px] font-medium transition-colors ${
            isActive ? 'text-finclosure-800 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <Landmark className="w-5 h-5 mb-0.5" />
        <span>Assets</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-2 min-w-[56px] text-[11px] font-medium transition-colors ${
            isActive ? 'text-finclosure-800 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <CreditCard className="w-5 h-5 mb-0.5" />
        <span>Liabilities</span>
      </NavLink>

      <NavLink
        to="/documents"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-2 min-w-[56px] text-[11px] font-medium transition-colors ${
            isActive ? 'text-finclosure-800 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <FileText className="w-5 h-5 mb-0.5" />
        <span>Documents</span>
      </NavLink>

      <button
        onClick={onToggleMobileDrawer}
        className="flex flex-col items-center py-1 px-2 min-w-[56px] text-[11px] font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <MoreHorizontal className="w-5 h-5 mb-0.5" />
        <span>More</span>
      </button>
    </nav>
  );
};
