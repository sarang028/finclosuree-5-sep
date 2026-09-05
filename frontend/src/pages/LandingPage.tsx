import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  FileText,
  ShieldCheck,
  Flag,
  ArrowRight,
  Play,
  Users,
  CheckCircle2,
  Heart,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { startDemo } = useAuth();
  const navigate = useNavigate();

  const handleStartDemo = () => {
    startDemo();
    navigate('/dashboard');
  };

  const journeyStages = [
    {
      step: '01',
      title: 'DISCOVER',
      desc: 'Uncover bank accounts, investments, insurance, deposits and liabilities.',
      icon: Search,
    },
    {
      step: '02',
      title: 'ORGANIZE',
      desc: 'Centralize documents and understand what is required.',
      icon: FileText,
    },
    {
      step: '03',
      title: 'CLAIM',
      desc: 'Get guided instructions, submit claims and track institutional processing.',
      icon: ShieldCheck,
    },
    {
      step: '04',
      title: 'CLOSE',
      desc: 'Complete approvals, recover outstanding money and finish financial closure.',
      icon: Flag,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B132B] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Clear Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Closing Finances.{' '}
              <span className="text-emerald-400 block sm:inline">
                Securing Futures.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl">
              Discover, organize, claim and track the financial assets and liabilities of a loved one — in one secure place.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={handleStartDemo}
                className="px-7 py-3.5 text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-full transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2.5 active:scale-98"
              >
                <span>Start Demo (Instant Access)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#how-it-works"
                className="px-6 py-3.5 text-sm font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-full transition-all flex items-center justify-center space-x-2"
              >
                <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                  <Play className="w-2.5 h-2.5 fill-slate-300 ml-0.5" />
                </div>
                <span>See How It Works</span>
              </a>
            </div>

            {/* 3 Key Trust / Value Badges matching reference image */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-800/80">
              <div className="flex items-center space-x-2.5 text-slate-300">
                <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold">For Families Who Care</span>
              </div>
              <div className="flex items-center space-x-2.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold">Simple & Guided Process</span>
              </div>
              <div className="flex items-center space-x-2.5 text-slate-300">
                <Heart className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold">A More Secure Tomorrow</span>
              </div>
            </div>
          </div>

          {/* Right Column: Emotional Family Photography */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-700/60 group">
              <img
                src="https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&w=1000&q=80"
                alt="Indian Grandfather hugging daughter warmly"
                className="w-full h-[420px] object-cover object-center group-hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-transparent to-transparent opacity-80" />

              {/* Emotional Overlay Cursive Quote matching reference image */}
              <div className="absolute bottom-6 right-6 text-right max-w-xs">
                <p className="font-serif italic text-xl sm:text-2xl text-emerald-200 drop-shadow-md">
                  "More than finances. A legacy of love."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE FINCLOSURE JOURNEY SECTION */}
      <section id="how-it-works" className="py-16 bg-[#070D1E] border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 block mb-2">
              THE FINCLOSURE JOURNEY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              From Uncertainty to Closure
            </h2>
            <p className="text-sm text-slate-400">
              A simple, guided process to help you handle what matters.
            </p>
          </div>

          {/* 4 Visually Dominant Stage Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative">
            {journeyStages.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <div key={stage.step} className="relative group">
                  <div className="h-full p-6 rounded-2xl bg-[#0F1836] border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between shadow-lg">
                    <div>
                      {/* Step Number & Icon Header */}
                      <div className="flex items-center justify-between mb-5">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 font-extrabold text-xs border border-emerald-800/60">
                          {stage.step}
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-slate-800/80 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-900/50 transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Stage Title */}
                      <h3 className="text-base font-extrabold text-white mb-2 tracking-wide">
                        {stage.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {stage.desc}
                      </p>
                    </div>

                    {/* Arrow Connector indicator for desktop */}
                    {idx < journeyStages.length - 1 && (
                      <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                        <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOTTOM COMPASSIONATE BANNER */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-[#0C2D24] to-[#0A1D18] border border-emerald-800/50 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                Technology for tough times.
              </h3>
              <p className="text-xs text-emerald-200/80">
                Support for brighter tomorrows.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs font-serif italic text-emerald-200">
              Because every story deserves a closure.
            </span>
            <button
              onClick={handleStartDemo}
              className="w-10 h-10 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 flex items-center justify-center shadow-lg transition-transform hover:scale-105 shrink-0"
              title="Start Demo"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

