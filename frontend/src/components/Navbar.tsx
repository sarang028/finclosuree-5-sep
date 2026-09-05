import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { isAuthenticated, startDemo } = useAuth();
  const navigate = useNavigate();

  const handleStartDemo = () => {
    startDemo();
    navigate('/dashboard');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B132B]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-900/30 group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5 text-white fill-white/20" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white leading-none">
              FinClosure
            </span>
            <span className="text-[10px] font-medium text-emerald-400 tracking-wide mt-0.5">
              Closing Finances. Securing Futures.
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">
            How It Works
          </Link>
          <Link to="/features" className="hover:text-emerald-400 transition-colors">
            Features
          </Link>
          <Link to="/about" className="hover:text-emerald-400 transition-colors">
            About
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {!isAuthenticated && (
            <button
              onClick={handleStartDemo}
              className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-full transition-all shadow-md shadow-emerald-950/50"
              title="Instant Access Demo Account"
            >
              <span>Start Demo</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </button>
          )}

          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-full transition-all shadow-md shadow-emerald-900/40"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

