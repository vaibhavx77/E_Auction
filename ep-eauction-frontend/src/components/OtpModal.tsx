'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function OtpModal({
  email,
  open,
  onClose,
  onVerified,
}: {
  email: string;
  open: boolean;
  onClose: () => void;
  onVerified: (token: string, role: string) => void;
}) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30); // countdown in seconds

  // Countdown effect
  useEffect(() => {
    let timer: any;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      onVerified(res.data.token, res.data.role);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/resend-otp', { email });
      setResendTimer(30); // reset timer after resend
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter OTP</DialogTitle>
        </DialogHeader>

        <Input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button onClick={handleVerify} disabled={loading} className="mt-3 w-full">
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Button>

        <div className="mt-4 text-sm text-center">
          {resendTimer > 0 ? (
            <p className="text-gray-500">Resend OTP in {resendTimer}s</p>
          ) : (
            <Button variant="link" onClick={handleResendOtp}>
              Resend OTP
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
