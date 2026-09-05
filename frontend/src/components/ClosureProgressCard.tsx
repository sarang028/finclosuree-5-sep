import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { ProgressRing } from './ProgressRing';

export const ClosureProgressCard: React.FC = () => {
  const checklist = [
    { label: 'Assets discovered', completed: true },
    { label: 'Documents collected', completed: true },
    { label: 'Claims initiated', completed: true },
    { label: 'Liabilities reviewed', completed: true },
    { label: 'Claims approved', completed: false },
    { label: 'Recovery in progress', completed: false },
    { label: 'Closure report', completed: false },
  ];

  return (
    <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-3xl shadow-2xs space-y-4 h-full flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
          Financial Closure Progress
        </h2>
        <span className="text-xs font-serif italic text-slate-500 hidden sm:inline">
          One step closer to peace of mind.
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 py-2 flex-1">
        {/* Circular Progress Indicator matching reference */}
        <div className="flex flex-col items-center shrink-0">
          <ProgressRing percentage={72} size={110} strokeWidth={10} />
          <span className="text-[11px] font-bold text-slate-600 mt-2 text-center">
            6 of 8 financial matters processed
          </span>
        </div>

        {/* Checklist matching reference screen */}
        <div className="space-y-2 text-xs font-semibold flex-1">
          {checklist.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-2.5">
              {item.completed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-300 shrink-0" />
              )}
              <span className={item.completed ? 'text-slate-900 font-bold' : 'text-slate-400 font-medium'}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <p className="text-[11px] font-serif italic text-slate-600 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100/80">
          “Not just numbers. Real peace of mind for your family.”
        </p>
      </div>
    </div>
  );
};
