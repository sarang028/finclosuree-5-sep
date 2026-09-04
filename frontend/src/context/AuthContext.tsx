import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authApi } from '../services/apiServices';
import { DEMO_USER, initializeDemoStorage, clearDemoStorage } from '../services/demoService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  login: (token: string, user: User) => void;
  register: (token: string, user: User) => void;
  startDemo: () => void;
  exitDemo: () => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('finclosure_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('finclosure_token'));
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => localStorage.getItem('finclosure_is_demo') === 'true');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        if (isDemoMode || token.startsWith('demo_')) {
          setIsDemoMode(true);
          setUser(DEMO_USER);
          setIsLoading(false);
          return;
        }

        try {
          const res = await authApi.getMe();
          setUser(res.user);
          localStorage.setItem('finclosure_user', JSON.stringify(res.user));
        } catch (err) {
          console.warn('[AuthContext] Session expired or invalid, clearing credentials.');
          logout();
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [token, isDemoMode]);

  const login = (newToken: string, newUser: User) => {
    setIsDemoMode(false);
    localStorage.removeItem('finclosure_is_demo');
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('finclosure_token', newToken);
    localStorage.setItem('finclosure_user', JSON.stringify(newUser));
  };

  const register = (newToken: string, newUser: User) => {
    login(newToken, newUser);
  };

  const startDemo = () => {
    initializeDemoStorage();
    setIsDemoMode(true);
    setToken('demo_session_token_xyz987');
    setUser(DEMO_USER);
  };

  const exitDemo = () => {
    clearDemoStorage();
    setIsDemoMode(false);
    setToken(null);
    setUser(null);
  };

  const logout = () => {
    if (isDemoMode) {
      exitDemo();
      return;
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('finclosure_token');
    localStorage.removeItem('finclosure_user');
    localStorage.removeItem('finclosure_is_demo');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        isDemoMode,
        login,
        register,
        startDemo,
        exitDemo,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
