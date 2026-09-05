import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MoreHorizontal, ArrowRight, ShieldCheck } from 'lucide-react';

export const DocumentsPanel: React.FC = () => {
  const navigate = useNavigate();

  const documents = [
    { name: 'Death Certificate', status: 'Verified', isVerified: true },
    { name: 'Aadhaar Card', status: 'Verified', isVerified: true },
    { name: 'PAN Card', status: 'Verified', isVerified: true },
    { name: 'Life Insurance Policy', status: 'Pending', isVerified: false },
    { name: 'Health Insurance Policy', status: 'Verified', isVerified: true },
    { name: 'Bank Statement (Axis Bank)', status: 'Verified', isVerified: true },
  ];

  return (
    <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-2xs space-y-4">
      {/* Header matching Reference Screen */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center border border-blue-200">
            <FileText className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Documents</h3>
        </div>

        <button
          onClick={() => navigate('/documents')}
          className="text-xs font-bold text-slate-600 hover:text-blue-800 flex items-center"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </button>
      </div>

      {/* Compact Documents List matching Reference Screen */}
      <div className="space-y-2">
        {documents.map((doc, idx) => (
          <div
            key={idx}
            onClick={() => navigate('/documents')}
            className="flex items-center justify-between p-2.5 bg-slate-50/70 hover:bg-slate-100 rounded-xl border border-slate-100 transition-all cursor-pointer text-xs"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <span className="font-extrabold text-slate-900 truncate max-w-[150px]">
                {doc.name}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                  doc.isVerified
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {doc.status}
              </span>
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
