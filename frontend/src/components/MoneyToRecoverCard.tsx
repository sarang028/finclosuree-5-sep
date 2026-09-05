import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, HandCoins, ArrowRight, Info } from 'lucide-react';

export const MoneyToRecoverCard: React.FC = () => {
  const navigate = useNavigate();

  const debtors = [
    {
      name: 'Rakesh',
      initial: 'R',
      avatarBg: 'bg-rose-100 text-rose-800',
      amount: '₹30,000',
      status: 'Recovery Pending',
    },
    {
      name: 'Shreyansh',
      initial: 'S',
      avatarBg: 'bg-amber-100 text-amber-800',
      amount: '₹30,000',
      status: 'Recovery Pending',
    },
    {
      name: 'Rahul + Anuj',
      initial: 'R+A',
      avatarBg: 'bg-indigo-100 text-indigo-800',
      amount: '₹50,000',
      status: 'Recovery Pending',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-3xl shadow-2xs space-y-4 h-full flex flex-col justify-between">
      {/* Header matching Reference Screen */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center border border-purple-200">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">Money to Recover</h2>
            <p className="text-base font-black text-purple-800 leading-none mt-0.5">₹1.10 Lakh</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/assets?tab=Money+to+Recover')}
          className="text-xs font-bold text-slate-600 hover:text-purple-800 flex items-center"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </button>
      </div>

      {/* Debtors List matching Reference Screen */}
      <div className="space-y-3 flex-1">
        {debtors.map((item, idx) => (
          <div
            key={idx}
            onClick={() => navigate('/assets?tab=Money+to+Recover')}
            className="flex items-center justify-between p-2.5 bg-purple-50/20 hover:bg-purple-50/50 rounded-2xl border border-purple-100/80 transition-all cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${item.avatarBg}`}>
                {item.initial}
              </div>
              <span className="text-xs font-extrabold text-slate-900">{item.name}</span>
            </div>

            <div className="text-right">
              <div className="text-xs font-black text-slate-900">{item.amount}</div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 inline-block mt-0.5">
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Explanatory Message Box matching Reference Screen */}
      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center space-x-2.5 text-xs text-slate-600">
        <div className="w-5 h-5 rounded-full bg-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
          O
        </div>
        <p className="text-[11px] font-semibold text-slate-600 leading-snug">
          Track and follow up with people who owe money to the deceased.
        </p>
      </div>
    </div>
  );
};
