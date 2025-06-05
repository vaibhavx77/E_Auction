// src/components/admin/InviteSupplier.tsx
'use client';
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import AuthContext from '../../contexts/AuthContext';

export default function InviteSupplier() {
  const router = useRouter();
  const { role } = useContext(AuthContext);
  const [invitationLink, setInvitationLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Redirect non-admins to login
  // if (role !== 'Admin') {
  //   router.push('/login');
  //   return null;
  // }

  const handleGenerateLink = async () => {
    try {
      setError(null);
      setInvitationLink(null);
      setCopied(false);
      const response = await api.post('/api/invitation/generate', {});
      const { token } = response.data;

      // Use a fallback URL if window.location.origin is not available
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const link = `${baseUrl}/register?invitation=${token}`;
      setInvitationLink(link);
    } catch (error: any) {
      console.error('Full Invitation Generation Error:', error);
      if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to the server. Please ensure the backend is running.');
      } else {
        setError(error.response?.data?.message || 'Failed to generate invitation link');
      }
    }
  };

  const handleCopyLink = () => {
    if (invitationLink) {
      navigator.clipboard.writeText(invitationLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied status after 2 seconds
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold">Invite Supplier</h1>
      <p className="mt-2">
        Generate an invitation link to send to a supplier for registration.
      </p>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button
        onClick={handleGenerateLink}
        className="bg-blue-500 text-white p-2 rounded mt-4"
      >
        Generate Invitation Link
      </button>
      {invitationLink && (
        <div className="mt-4">
          <p className="text-sm">Invitation Link:</p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={invitationLink}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
            <button
              onClick={handleCopyLink}
              className="bg-green-500 text-white p-2 rounded"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-sm mt-2">
            Copy this link and send it to the supplier via email.
          </p>
        </div>
      )}
    </div>
  );
}