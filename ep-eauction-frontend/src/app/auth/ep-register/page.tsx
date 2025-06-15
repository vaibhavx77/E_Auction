'use client';

import { useState } from 'react';

const roles = ['Admin', 'Manager', 'Viewer'] as const;
type Role = typeof roles[number];

export default function EpRegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Manager' as Role,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/create-ep-member`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      alert('EP Member registered successfully!');
      setForm({ name: '', email: '', password: '', role: 'Manager' });
    } else {
      const data = await res.json();
      alert(data.message || 'Registration failed');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow max-w-md w-full space-y-4"
      >
        <h1 className="text-xl font-bold mb-4 text-center">EP Member Registration</h1>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full border p-2 rounded text-sm"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className="w-full border p-2 rounded text-sm"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => handleChange('password', e.target.value)}
          className="w-full border p-2 rounded text-sm"
          required
        />
        <select
          value={form.role}
          onChange={(e) => handleChange('role', e.target.value)}
          className="w-full border p-2 rounded text-sm"
        >
          {roles.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded font-medium"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </main>
  );
}