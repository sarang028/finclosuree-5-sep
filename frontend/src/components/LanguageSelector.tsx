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
      <Globe className="w-4 h-4 text-slate-500 absolute left-2.5 pointer-events-none" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        aria-label="Select Language"
        className={`pl-8 pr-7 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-900 text-xs font-semibold rounded-xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-finclosure-800 transition-colors shadow-2xs ${
          compact ? 'w-auto' : 'w-full min-w-[130px]'
        }`}
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-white text-slate-900 py-1">
            {lang.nativeName} ({lang.name})
          </option>
        ))}
      </select>
      <div className="absolute right-2.5 pointer-events-none text-slate-400 text-[10px]">▼</div>
    </div>
  );
};
