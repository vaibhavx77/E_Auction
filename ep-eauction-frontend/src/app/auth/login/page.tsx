'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import OtpModal from '@/components/OtpModal';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

const [showOtp, setShowOtp] = useState(false);

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    setShowOtp(true); // 👈 show OTP modal
  } catch (err: any) {
    alert(err.response?.data?.message || 'Login failed');
  }
};

const handleOtpVerified = (token: string, role: string) => {
  localStorage.setItem('token', token);
  router.push(role === 'supplier' ? '/supplier/dashboard' : '/ep/dashboard');
};


  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm"
      >
        <h2 className="text-center text-base font-semibold mb-6">
          Login into your account
        </h2>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-[#DDE1EB] rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#DDE1EB] rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-2 flex items-center text-xs text-blue-600"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#007AFF] text-white text-sm font-medium py-2 rounded hover:opacity-90 transition"
        >
          Login
        </button>
      </form>
      <OtpModal
  email={email}
  open={showOtp}
  onClose={() => setShowOtp(false)}
  onVerified={handleOtpVerified}
/>

    </main>
  );
}

