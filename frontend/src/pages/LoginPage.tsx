import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/apiServices';
import { getBackendBaseUrl } from '../services/apiClient';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-8 px-4 sm:px-6">
        <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
          {/* Logo & Brand matching Reference Image Screen 1 */}
          <div className="w-16 h-16 rounded-2xl bg-finclosure-100 flex items-center justify-center mx-auto mb-4 text-finclosure-800 border border-finclosure-200">
            <ShieldCheck className="w-10 h-10" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
            FinClosure
          </h1>
          <p className="text-xs font-bold text-finclosure-800 tracking-wide mb-6">
            Secure. Simplify. Settle.
          </p>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-2 max-w-xs mx-auto">
            Simplifying financial closure for your loved ones.
          </h2>
          <p className="text-xs text-slate-500 mb-8 max-w-xs mx-auto">
            Discover, organize and settle all financial matters with ease.
          </p>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center text-left">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Primary Action: Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3.5 px-4 bg-finclosure-800 hover:bg-finclosure-900 text-white font-bold text-sm rounded-2xl transition-all flex items-center justify-center space-x-3 shadow-sm mb-3 active:scale-98"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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

          {/* Instant Access: Start Demo Mode */}
          <button
            type="button"
            onClick={handleStartDemo}
            className="w-full py-3.5 px-4 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-900 font-bold text-sm rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-2xs mb-3.5 active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-teal-600 animate-pulse" />
            <span>Start Demo (Instant Access)</span>
          </button>

          {/* Secondary Action: Email Sign In Toggle */}
          {!showEmailForm ? (
            <button
              type="button"
              onClick={() => setShowEmailForm(true)}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-2xs mb-6"
            >
              <Mail className="w-4 h-4 text-slate-600" />
              <span>Continue with Email</span>
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left my-4 pt-4 border-t border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-finclosure-800 focus:ring-1 focus:ring-finclosure-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-finclosure-800 focus:ring-1 focus:ring-finclosure-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-finclosure-800 hover:bg-finclosure-900 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center disabled:opacity-50"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            </form>
          )}

          <div className="text-[11px] text-slate-400 mt-6 leading-relaxed">
            By continuing, you agree to our <br className="hidden sm:inline" />
            <span className="font-semibold text-slate-600 underline">Terms & Privacy Policy</span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-finclosure-800 hover:underline font-bold ml-1">
              Create Account
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
