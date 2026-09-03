import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/apiServices';
import { HeartHandshake } from 'lucide-react';

export const GoogleCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const token = searchParams.get('token');
      const hasProfile = searchParams.get('hasProfile');
      const errParam = searchParams.get('error');

      if (errParam) {
        setError(errParam);
        setTimeout(() => {
          navigate(`/login?error=${encodeURIComponent(errParam)}`, { replace: true });
        }, 2000);
        return;
      }

      if (!token) {
        setError('No authentication token received from server.');
        setTimeout(() => {
          navigate('/login?error=No%20token%20received%20from%20server.', { replace: true });
        }, 2000);
        return;
      }

      try {
        // Save token to localStorage temporary header for getMe request
        localStorage.setItem('finclosure_token', token);
        const res = await authApi.getMe();
        
        // Populate AuthContext
        login(token, res.user);

        // Determine destination: /dashboard if onboarding complete, else /onboarding
        if (hasProfile === 'true') {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/onboarding', { replace: true });
        }
      } catch (err: any) {
        console.error('[GoogleCallback Page Error]', err);
        setError('Failed to authenticate session token. Please log in again.');
        setTimeout(() => {
          navigate('/login?error=Failed%20to%20authenticate%20session.', { replace: true });
        }, 2000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full glass-card p-8 rounded-2xl border-slate-800 shadow-2xl text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-sky-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-900/40 animate-pulse">
          <HeartHandshake className="w-6 h-6 text-white" />
        </div>
        
        <h2 className="text-xl font-bold text-white tracking-tight mb-2">
          {error ? 'Authentication Error' : 'Authenticating with Google...'}
        </h2>
        
        {error ? (
          <p className="text-xs text-rose-400 font-medium">{error}</p>
        ) : (
          <div className="flex flex-col items-center mt-3">
            <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-slate-400">Verifying secure Google credentials and restoring session...</p>
          </div>
        )}
      </div>
    </div>
  );
};
