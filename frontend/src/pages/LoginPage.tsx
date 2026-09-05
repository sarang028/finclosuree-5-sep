import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
  ArrowRight,
  AlertCircle,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const { login, startDemo } = useAuth();
  const navigate = useNavigate();

  const handleStartDemo = () => {
    startDemo();
    navigate('/dashboard');
  };

  useEffect(() => {
    const err = searchParams.get('error');
    if (err) {
      setError(err);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await authApi.login({ email, password });
      login(res.token, res.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${getBackendBaseUrl()}/api/auth/google`;
  };

  return (
    <div className="min-h-screen bg-[#0B132B] text-slate-100 flex flex-col justify-between font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Simple Header */}
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

      {/* Main Split Layout matching Reference Image Screen 1 */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          {/* LEFT SIDE: Brand Narrative + Authentic Family Photo */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Secure your family's{' '}
              <span className="text-emerald-400">financial closure.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Discover, organize, claim and track all financial matters of your loved ones — in one secure place.
            </p>

            {/* 3 Trust Points matching Reference Image Screen 1 */}
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
                  <h4 className="text-xs font-bold text-white">Simplify Complexity</h4>
                  <p className="text-[11px] text-slate-400">Clear step-by-step guidance</p>
                </div>
              </div>
            </div>

            {/* Authentic Family Photography Card with Cursive Overlay */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-800 max-w-lg hidden sm:block">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
                alt="Indian family multi-generation portrait"
                className="w-full h-44 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-3 left-4">
                <p className="font-serif italic text-sm text-emerald-200">
                  "Because their tomorrow still matters..."
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: FinClosure Login Card matching Reference Image Screen 1 */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-white text-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-100 text-center">
              {/* Brand Header inside Card */}
              <div className="w-12 h-12 rounded-xl bg-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-md">
                <Leaf className="w-6 h-6 text-white fill-white/20" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">FinClosure</h2>
              <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider mb-6">
                Closing Finances. Securing Futures.
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center text-left">
                  <AlertCircle className="w-4 h-4 mr-2 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* 1. Continue with Google Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-3.5 px-4 bg-[#064E3B] hover:bg-[#04392B] text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center space-x-3 shadow-md mb-3 active:scale-98"
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

              {/* 2. Start Demo (Instant Access) Button */}
              <button
                type="button"
                onClick={handleStartDemo}
                className="w-full py-3.5 px-4 bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-emerald-200 text-emerald-900 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-between shadow-xs mb-3 active:scale-98 group"
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span className="font-bold">Start Demo (Instant Access)</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-normal group-hover:underline hidden sm:inline">
                  Explore with sample data
                </span>
              </button>

              {/* 3. Continue with Email Button / Toggle */}
              {!showEmailForm ? (
                <button
                  type="button"
                  onClick={() => setShowEmailForm(true)}
                  className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center space-x-2 shadow-2xs mb-4"
                >
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span>Continue with Email</span>
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 text-left my-3 pt-3 border-t border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center disabled:opacity-50"
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </button>
                </form>
              )}

              <p className="text-[10px] text-slate-400 mb-4">
                By continuing, you agree to our{' '}
                <span className="text-slate-600 underline font-medium">Terms & Privacy Policy</span>
              </p>

              {/* DEMO MODE Box matching Reference Image Screen 1 */}
              <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-emerald-200/70 text-emerald-950 text-left flex items-start space-x-2.5">
                <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block">
                    DEMO MODE
                  </span>
                  <p className="text-[11px] text-emerald-800 leading-snug">
                    Try FinClosure with sample data. No real financial information is stored.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Trust Badges matching Reference Image Screen 1 */}
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

