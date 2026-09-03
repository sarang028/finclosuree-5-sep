import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-sky-500 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <HeartHandshake className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-teal-400 bg-clip-text text-transparent">
              FinClosure
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium text-teal-400/80 tracking-wide uppercase px-2 py-0.5 rounded-full bg-teal-950/60 border border-teal-800/40">
              Securing Futures
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <Link to="/how-it-works" className="hover:text-teal-400 transition-colors">
            How It Works
          </Link>
          <Link to="/features" className="hover:text-teal-400 transition-colors">
            Features
          </Link>
          <Link to="/about" className="hover:text-teal-400 transition-colors">
            About
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-all shadow-md shadow-teal-900/40"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 rounded-lg transition-all shadow-md shadow-teal-900/30"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
