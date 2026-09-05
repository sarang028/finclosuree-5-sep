import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Home, Car, AlertTriangle, ArrowRight } from 'lucide-react';

export const LiabilitiesCard: React.FC = () => {
  const navigate = useNavigate();

  const liabilities = [
    {
      name: 'Home Loan',
      amount: '₹4,00,000',
      status: 'Outstanding',
      icon: Home,
    },
    {
      name: 'Vehicle Loan',
      amount: '(Amount not shown)',
      status: 'Outstanding',
      icon: Car,
    },
  ];

  return (
    <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-3xl shadow-2xs space-y-4 h-full flex flex-col justify-between">
      {/* Header matching Reference Screen */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center border border-rose-200">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">Liabilities</h2>
            <p className="text-base font-black text-rose-800 leading-none mt-0.5">₹4.00 Lakh</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/assets?tab=Liabilities')}
          className="text-xs font-bold text-slate-600 hover:text-rose-800 flex items-center"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </button>
      </div>

      {/* Liabilities List matching Reference Screen */}
      <div className="space-y-3 flex-1">
        {liabilities.map((item, idx) => {
          const ItemIcon = item.icon;
          return (
            <div
              key={idx}
              onClick={() => navigate('/assets?tab=Liabilities')}
              className="flex items-center justify-between p-3 bg-rose-50/30 hover:bg-rose-50/60 rounded-2xl border border-rose-100 transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-rose-100/80 text-rose-700 flex items-center justify-center shrink-0">
                  <ItemIcon className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-extrabold text-slate-900">{item.name}</span>
              </div>

              <div className="text-right">
                <div className="text-xs font-black text-slate-900">{item.amount}</div>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md border border-rose-200 inline-block mt-0.5">
                  {item.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Important Warning Callout Box matching Reference Screen */}
      <div className="p-3.5 bg-amber-50/90 border border-amber-200/90 rounded-2xl flex items-start space-x-2.5 text-xs text-amber-950">
        <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
          !
        </div>
        <div className="space-y-0.5">
          <strong className="block font-black text-amber-950">Important</strong>
          <p className="text-[11px] font-semibold text-amber-900 leading-snug">
            Outstanding liabilities should be reviewed and managed to avoid legal or financial risks.
          </p>
        </div>
      </div>
    </div>
  );
};
