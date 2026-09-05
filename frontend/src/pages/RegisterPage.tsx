import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/apiServices';
import { getBackendBaseUrl } from '../services/apiClient';
import {
  Leaf,
  ShieldCheck,
  Users,
  FileText,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  ArrowRight,
  AlertCircle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, startDemo } = useAuth();
  const navigate = useNavigate();

  const handleStartDemo = () => {
    startDemo();
    navigate('/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authApi.register({ fullName, email, phone, password });
      register(res.token, res.user);
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${getBackendBaseUrl()}/api/auth/google`;
  };

  return (
    <div className="min-h-screen bg-[#0B132B] text-slate-100 flex flex-col justify-between font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header Bar */}
      <header className="px-6 py-4 border-b border-slate-800/60 bg-[#0B132B]/80 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-900/30">
            <Leaf className="w-5 h-5 text-white fill-white/20" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white block leading-none">
              FinClosure
            </span>
            <span className="text-[10px] font-medium text-emerald-400">
              Closing Finances. Securing Futures.
            </span>
          </div>
        </Link>

        <Link
          to="/"
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          Back to Home
        </Link>
      </header>

      {/* Main Split Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          {/* LEFT SIDE: Value proposition */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Join FinClosure to <br className="hidden sm:inline" />
              <span className="text-emerald-400">secure your family's legacy.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Create your account to discover assets, manage document requirements, and track claims step-by-step.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Secure & Private</h4>
                  <p className="text-[11px] text-slate-400">Bank-grade isolation</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                <Users className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Built for Families</h4>
                  <p className="text-[11px] text-slate-400">Empathetic workflows</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                <FileText className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Simple & Guided</h4>
                  <p className="text-[11px] text-slate-400">No legal jargon</p>
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-800 max-w-lg hidden sm:block">
              <img
                src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80"
                alt="Family togetherness"
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-transparent to-transparent opacity-90" />
            </div>
          </div>

          {/* RIGHT SIDE: Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-white text-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-100 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-md">
                <Leaf className="w-6 h-6 text-white fill-white/20" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
              <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider mb-5">
                FinClosure Settlement Platform
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center text-left">
                  <AlertCircle className="w-4 h-4 mr-2 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-3 px-4 bg-[#064E3B] hover:bg-[#04392B] text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center space-x-3 shadow-md mb-2.5 active:scale-98"
              >
                <svg className="w-4 h-4 bg-white rounded-full p-0.5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Start Demo Button */}
              <button
                type="button"
                onClick={handleStartDemo}
                className="w-full py-3 px-4 bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-emerald-200 text-emerald-900 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center space-x-2 mb-4 active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>Start Demo (Instant Access)</span>
              </button>

              <form onSubmit={handleSubmit} className="space-y-3 text-left pt-3 border-t border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ankit Sharma"
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ankit@example.com"
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center disabled:opacity-50 mt-3"
                >
                  {isLoading ? 'Creating Account...' : 'Continue to Guided Setup'}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>
              </form>

              <div className="mt-4 text-center text-xs text-slate-500">
                Already registered?{' '}
                <Link to="/login" className="text-emerald-700 font-bold hover:underline ml-1">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 border-t border-slate-800/80 bg-[#070D1E] text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-6 sm:gap-12">
          <div className="flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-semibold">AES-256 Encrypted</span>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-semibold">Private & Confidential</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-semibold">Trusted & Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

