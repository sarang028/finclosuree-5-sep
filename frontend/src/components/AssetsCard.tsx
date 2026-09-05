import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, Building, ShieldAlert, TrendingUp, Award, ArrowRight } from 'lucide-react';

export const AssetsCard: React.FC = () => {
  const navigate = useNavigate();

  const assets = [
    {
      name: 'Axis Bank Account',
      amount: '₹4,00,000',
      status: 'Verified',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      icon: Building,
      iconColor: 'bg-blue-50 text-blue-700',
    },
    {
      name: 'Reliance Industries (Stocks)',
      amount: '₹2,00,000',
      status: 'Verified',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      icon: TrendingUp,
      iconColor: 'bg-indigo-50 text-indigo-700',
    },
    {
      name: 'Life Insurance Policy',
      amount: '₹1,00,00,000',
      status: 'Claim Pending',
      statusColor: 'text-amber-800 bg-amber-50 border-amber-200',
      icon: ShieldAlert,
      iconColor: 'bg-emerald-50 text-emerald-800',
    },
    {
      name: 'Health Insurance Policy',
      amount: '₹5,00,000',
      status: 'Active',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      icon: ShieldAlert,
      iconColor: 'bg-purple-50 text-purple-700',
    },
    {
      name: 'Government Scheme',
      amount: '₹3,00,000',
      status: 'Eligibility Check',
      statusColor: 'text-blue-800 bg-blue-50 border-blue-200',
      icon: Award,
      iconColor: 'bg-amber-50 text-amber-800',
    },
    {
      name: 'Fixed Deposit (FD)',
      amount: '₹4,00,000',
      status: 'Claim Pending',
      statusColor: 'text-amber-800 bg-amber-50 border-amber-200',
      icon: Building,
      iconColor: 'bg-teal-50 text-teal-800',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-3xl shadow-2xs space-y-4 h-full flex flex-col justify-between">
      {/* Header matching Reference Screen */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">Assets</h2>
            <p className="text-base font-black text-emerald-800 leading-none mt-0.5">₹1.18 Cr</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/assets')}
          className="text-xs font-bold text-slate-600 hover:text-emerald-800 flex items-center"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </button>
      </div>

      {/* Asset Items List matching Reference Screen */}
      <div className="space-y-2.5 flex-1">
        {assets.map((item, idx) => {
          const ItemIcon = item.icon;
          return (
            <div
              key={idx}
              onClick={() => navigate('/assets')}
              className="flex items-center justify-between p-2.5 bg-slate-50/70 hover:bg-slate-100/80 rounded-2xl border border-slate-100 transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.iconColor}`}>
                  <ItemIcon className="w-4 h-4" />
                </div>
                <span className="text-xs font-extrabold text-slate-900 truncate max-w-[140px] sm:max-w-[180px]">
                  {item.name}
                </span>
              </div>

              <div className="text-right">
                <div className="text-xs font-black text-slate-900">{item.amount}</div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border inline-block ${item.statusColor}`}>
                  {item.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
