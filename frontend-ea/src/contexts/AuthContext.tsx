'use client';
import { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthState {
  userId: string | null;
  role: 'admin' | 'manager' | 'viewer' | 'supplier' | null;
  token: string | null;
  setAuth: (data: { userId: string; role: string; token: string }) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthState>({
  userId: null,
  role: null,
  token: null,
  setAuth: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<'admin' | 'manager' | 'viewer' | 'supplier' | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // TODO: Validate token with backend
      setToken(storedToken);
    }
  }, []);

  const setAuth = ({ userId, role, token }: { userId: string; role: string; token: string }) => {
    setUserId(userId);
    setRole(role as 'admin' | 'manager' | 'viewer' | 'supplier');
    setToken(token);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUserId(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ userId, role, token, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}