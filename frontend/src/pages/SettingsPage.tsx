import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types/translations';
import {
  User,
  Bell,
  Globe,
  ShieldCheck,
  HelpCircle,
  Info,
  CheckCircle2,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [activeSection, setActiveSection] = useState<'profile' | 'notifications' | 'language' | 'security' | 'support' | 'about'>('language');

  const languagesList: Array<{ code: Language; name: string; nativeName: string }> = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी (Hindi)' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी (Marathi)' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage your preferences, language, and security settings.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xs overflow-hidden grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 min-h-[420px]">
        {/* Left Section List matching Reference Screen 10 */}
        <div className="p-4 space-y-1 bg-slate-50/50">
          <button
            onClick={() => setActiveSection('profile')}
            className={`w-full flex items-start p-3 rounded-2xl text-left transition-colors ${
              activeSection === 'profile' ? 'bg-white shadow-2xs border border-slate-200' : 'hover:bg-slate-100/60'
            }`}
          >
            <User className="w-4 h-4 text-slate-500 mr-3 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-extrabold text-slate-900">Profile Settings</p>
              <p className="text-[11px] text-slate-500">Manage your personal information</p>
            </div>
          </button>

          <button
            onClick={() => setActiveSection('notifications')}
            className={`w-full flex items-start p-3 rounded-2xl text-left transition-colors ${
              activeSection === 'notifications' ? 'bg-white shadow-2xs border border-slate-200' : 'hover:bg-slate-100/60'
            }`}
          >
            <Bell className="w-4 h-4 text-slate-500 mr-3 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-extrabold text-slate-900">Notification Settings</p>
              <p className="text-[11px] text-slate-500">Manage your notifications</p>
            </div>
          </button>

          <button
            onClick={() => setActiveSection('language')}
            className={`w-full flex items-start p-3 rounded-2xl text-left transition-colors ${
              activeSection === 'language' ? 'bg-white shadow-2xs border border-slate-200' : 'hover:bg-slate-100/60'
            }`}
          >
            <Globe className="w-4 h-4 text-finclosure-800 mr-3 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-extrabold text-slate-900">Language</p>
              <p className="text-[11px] text-slate-500">English, Hindi, Marathi</p>
            </div>
          </button>

          <button
            onClick={() => setActiveSection('security')}
            className={`w-full flex items-start p-3 rounded-2xl text-left transition-colors ${
              activeSection === 'security' ? 'bg-white shadow-2xs border border-slate-200' : 'hover:bg-slate-100/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-slate-500 mr-3 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-extrabold text-slate-900">Security & Privacy</p>
              <p className="text-[11px] text-slate-500">Manage your account security</p>
            </div>
          </button>

          <button
            onClick={() => setActiveSection('support')}
            className={`w-full flex items-start p-3 rounded-2xl text-left transition-colors ${
              activeSection === 'support' ? 'bg-white shadow-2xs border border-slate-200' : 'hover:bg-slate-100/60'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-slate-500 mr-3 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-extrabold text-slate-900">Help & Support</p>
              <p className="text-[11px] text-slate-500">Get help and support</p>
            </div>
          </button>

          <button
            onClick={() => setActiveSection('about')}
            className={`w-full flex items-start p-3 rounded-2xl text-left transition-colors ${
              activeSection === 'about' ? 'bg-white shadow-2xs border border-slate-200' : 'hover:bg-slate-100/60'
            }`}
          >
            <Info className="w-4 h-4 text-slate-500 mr-3 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-extrabold text-slate-900">About FinClosure</p>
              <p className="text-[11px] text-slate-500">Version 1.0.0</p>
            </div>
          </button>
        </div>

        {/* Right Active Content Panel matching Reference Screen 10 */}
        <div className="md:col-span-2 p-6 flex flex-col justify-between">
          {activeSection === 'language' && (
            <div className="space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900">Language</h2>

              <div className="space-y-3">
                {languagesList.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <div
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'border-slate-300 bg-white shadow-2xs'
                          : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs font-extrabold text-slate-900">{lang.nativeName}</span>

                      {/* Green Radio Button matching Reference Screen 10 */}
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-finclosure-800 bg-finclosure-800' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeSection !== 'language' && (
            <div className="py-12 text-center text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 text-finclosure-800 mx-auto mb-2" />
              Settings section configured and active.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
