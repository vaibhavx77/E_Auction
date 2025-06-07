'use client';
import { useState, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import api from '../../lib/api';
import AuthContext from '../../contexts/AuthContext';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import Image from 'next/image';

interface VerifyOtpResponse {
  userId: string;
  name: string;
  role: string;
  token: string;
}

interface LoginFormValues {
  email: string;
  password: string;
}

interface OtpFormValues {
  otp: string;
}

export default function Login() {
  const router = useRouter();
  const { setAuth } = useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);
  const [otpStage, setOtpStage] = useState(false);
  const [email, setEmail] = useState('');

  const loginSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const otpSchema = Yup.object({
    otp: Yup.string().required('OTP is required').length(6, 'OTP must be 6 digits'),
  });

  const loginForm = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: yupResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    try {
      setError(null);
      console.log('Request URL:', `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`);
      const response = await api.post('/api/auth/login', values);
      setEmail(values.email);
      setOtpStage(true);
    } catch (error: any) {
      console.log('Full Login Error:', error);
      if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to the server. Please ensure the backend is running.');
      } else {
        setError(error.response?.data?.message || 'Login failed');
      }
    }
  };

  const onOtpSubmit = async (values: OtpFormValues) => {
    try {
      setError(null);
      const response = await api.post<{ data: VerifyOtpResponse }>('/api/auth/verify-otp', {
        email,
        otp: values.otp,
      });
      const { userId, name, role, token } = response.data.data;
      setAuth({ userId, name, role, token });
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Full OTP Error:', error);
      if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to the server. Please ensure the backend is running.');
      } else {
        setError(error.response?.data?.message || 'OTP verification failed');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 md:p-10 lg:p-12 border border-gray-300 rounded-lg shadow-md w-full max-w-md space-y-6">
        {!otpStage ? (
          <>
            <div className="flex flex-col items-center mb-4">
              {/* Replace with your app's logo */}
              <Image
                src="/logo/lightbglogo.webp" // Replace with your logo path
                alt="E-Auction Platform Logo"
                height={120}
                width={120}
                className="mb-3 object-contain"
              />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold pb-2 text-center text-blue-900">
                Welcome
              </h1>
              <p className="text-sm text-center text-gray-600 mb-6">
                Sign in to your E-Auction Platform account
              </p>
            </div>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="flex flex-col space-y-4">
              <div className="space-y-1">
                <label htmlFor="email" className="text-gray-700">
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  placeholder="you@company.com"
                  className="w-full text-black font-medium px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...loginForm.register("email")}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="text-gray-700">
                  Password
                </label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  className="w-full text-black font-medium px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...loginForm.register("password")}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                size="lg"
                type="submit"
                disabled={loginForm.formState.isSubmitting || !loginForm.formState.isValid}
                className="w-full"
              >
                {loginForm.formState.isSubmitting ? "Submitting..." : "Continue"}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">Enter email and password to continue</p>
              </div>

              {/* Optional: Add a divider for future alternative login methods */}
              <div className="flex items-center justify-between my-4">
                <hr className="w-full border-gray-300" />
                <p className="text-xs text-gray-600 px-2">OR</p>
                <hr className="w-full border-gray-300" />
              </div>
              {/* Placeholder for alternative login methods (e.g., Google) */}
              <Button
                disabled
                className="w-full bg-white hover:bg-gray-100 text-gray-600 py-2 rounded-lg border border-gray-300 shadow-sm flex items-center justify-center space-x-2 transition duration-300"
              >
                {/* <Image
                  height={20}
                  width={20}
                  src="/logo/google-logo.webp" // Replace with Google logo path if you add Google login
                  alt="Google"
                /> */}
                <span>Continue with Google (Coming Soon)</span>
              </Button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center mb-4">
            <Image
              src="/logo/lightbglogo.webp" // Replace with your logo path
              alt="E-Auction Platform Logo"
              height={120}
              width={120}
              className="mb-3 object-contain"
            />
            <h1 className="text-center text-2xl mt-6 mb-4 text-blue-900">Enter OTP</h1>
            <p className="text-sm text-center text-gray-600 mb-6">
              Enter the OTP sent to your email to continue.
            </p>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="flex flex-col space-y-4 w-full">
              <div className="space-y-1">
                <label htmlFor="otp" className="text-gray-700">
                  OTP
                </label>
                <Input
                  type="text"
                  id="otp"
                  placeholder="Enter 6-digit OTP"
                  className="w-full text-black font-medium px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...otpForm.register("otp")}
                />
                {otpForm.formState.errors.otp && (
                  <p className="text-red-500 text-sm mt-1">
                    {otpForm.formState.errors.otp.message}
                  </p>
                )}
              </div>

              <Button
                size="lg"
                type="submit"
                disabled={otpForm.formState.isSubmitting || !otpForm.formState.isValid}
                className="w-full"
              >
                {otpForm.formState.isSubmitting ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}