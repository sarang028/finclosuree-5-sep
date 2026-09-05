import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Landmark, CreditCard, FileCheck, Users, LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  colorScheme: 'emerald' | 'rose' | 'blue' | 'purple';
  linkTo: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  colorScheme,
  linkTo,
}) => {
  const navigate = useNavigate();

  const colorStyles = {
    emerald: {
      cardBg: 'bg-white',
      iconBg: 'bg-emerald-100/90 text-emerald-800 border-emerald-200',
      btnBg: 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-200',
    },
    rose: {
      cardBg: 'bg-white',
      iconBg: 'bg-rose-100/90 text-rose-800 border-rose-200',
      btnBg: 'bg-rose-50 text-rose-800 hover:bg-rose-100 border-rose-200',
    },
    blue: {
      cardBg: 'bg-white',
      iconBg: 'bg-blue-100/90 text-blue-800 border-blue-200',
      btnBg: 'bg-blue-50 text-blue-800 hover:bg-blue-100 border-blue-200',
    },
    purple: {
      cardBg: 'bg-white',
      iconBg: 'bg-purple-100/90 text-purple-800 border-purple-200',
      btnBg: 'bg-purple-50 text-purple-800 hover:bg-purple-100 border-purple-200',
    },
  };

  const scheme = colorStyles[colorScheme];

  return (
    <div
      onClick={() => navigate(linkTo)}
      className={`${scheme.cardBg} border border-slate-200/90 p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between group`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${scheme.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-xs font-extrabold text-slate-800 tracking-tight">{title}</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(linkTo);
          }}
          className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all group-hover:scale-105 ${scheme.btnBg}`}
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
          {value}
        </div>
        <div className="text-[11px] font-bold text-slate-500 mt-1">
          {subtitle}
        </div>
      </div>
    </div>
  );
};
