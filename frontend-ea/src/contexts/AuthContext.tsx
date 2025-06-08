// src/contexts/AuthContext.tsx
'use client';
import { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthState {
  userId: string | null;
  name: string | null; // Add name field
  role: string | null;
  token: string | null;
  setAuth: (auth: { userId: string; name: string; role: string; token: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState>({
  userId: null,
  name: null,
  role: null,
  token: null,
  setAuth: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null); // Add name state
  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    const storedName = localStorage.getItem('name'); // Add name
    const storedRole = localStorage.getItem('role');
    if (storedToken && storedUserId && storedRole) {
      setToken(storedToken);
      setUserId(storedUserId);
      setName(storedName);
      setRole(storedRole);
    }
  }, []);

  const setAuth = ({ userId, name, role, token }: { userId: string; name: string; role: string; token: string }) => {
    setUserId(userId);
    setName(name); // Set name
    setRole(role);
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('name', name); // Store name
    localStorage.setItem('role', role);
  };

  const logout = () => {
    setUserId(null);
    setName(null); // Clear name
    setRole(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('name'); // Remove name
    localStorage.removeItem('role');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ userId, name, role, token, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;