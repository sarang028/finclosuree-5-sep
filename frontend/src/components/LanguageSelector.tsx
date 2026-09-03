import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGES, Language } from '../types/translations';
import { Globe } from 'lucide-react';

export const LanguageSelector: React.FC<{ compact?: boolean; className?: string }> = ({
  compact = false,
  className = '',
}) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <Globe className="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        aria-label="Select Language"
        className={`pl-8 pr-7 py-1.5 bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-medium rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors ${
          compact ? 'w-auto' : 'w-full min-w-[130px]'
        }`}
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200 py-1">
            {lang.nativeName} ({lang.name})
          </option>
        ))}
      </select>
      <div className="absolute right-2 pointer-events-none text-slate-400 text-[10px]">▼</div>
    </div>
  );
};
