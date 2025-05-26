// src/components/ClientWrapper.tsx
'use client';
import { AuthProvider } from '../contexts/AuthContext';
import { ReactNode } from 'react';

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}