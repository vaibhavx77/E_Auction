// src/components/shared/Header.tsx
'use client';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import AuthContext from '../../contexts/AuthContext';

export default function Header() {
  const { userId, name, role, logout } = useContext(AuthContext);
  const router = useRouter();

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div>EP E-Auction</div>
      <div className="space-x-4">
        {userId && (
          <>
            <span>{name || 'User'}</span>
            {role === 'Admin' && (
              <>
                <button onClick={() => router.push('/admin/create-ep-member')}>
                  Create EP Member
                </button>
                <button onClick={() => router.push('/admin/invite-supplier')}>
                  Invite Supplier
                </button>
              </>
            )}
            <button onClick={logout}>Logout</button>
          </>
        )}
        {!userId && (
          <>
            <button onClick={() => router.push('/login')}>
              Login
            </button>
            <button onClick={() => router.push('/register')}>
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
}