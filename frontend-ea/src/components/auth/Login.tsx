// src/components/auth/Login.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export default function Login() {
  const router = useRouter();
  const { setAuth } = useContext(AuthContext);
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState('');

  const loginSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('This field is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('This field is required'),
  });

  const otpSchema = Yup.object({
    otp: Yup.string().required('This field is required'),
  });

  const loginFormik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
          {
            email: values.email,
            password: values.password,
          }
        );
        if (response.data.mfaRequired) {
          setEmail(values.email);
          setShowOtp(true);
        } else {
          setAuth({
            userId: response.data.userId,
            role: response.data.role,
            token: response.data.token,
          });
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Login error:', error);
      }
    },
  });

  const otpFormik = useFormik({
    initialValues: { otp: '' },
    validationSchema: otpSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`,
          {
            email,
            otp: values.otp,
          }
        );
        setAuth({
          userId: response.data.userId,
          role: response.data.role,
          token: response.data.token,
        });
        router.push('/dashboard');
      } catch (error) {
        console.error('OTP verification error:', error);
      }
    },
  });

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold">Login</h1>
      {!showOtp ? (
        <form onSubmit={loginFormik.handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full p-2 border rounded"
              onChange={loginFormik.handleChange}
              value={loginFormik.values.email}
            />
            {loginFormik.errors.email && (
              <p className="text-red-500">{loginFormik.errors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full p-2 border rounded"
              onChange={loginFormik.handleChange}
              value={loginFormik.values.password}
            />
            {loginFormik.errors.password && (
              <p className="text-red-500">{loginFormik.errors.password}</p>
            )}
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Login
          </button>
        </form>
      ) : (
        <form onSubmit={otpFormik.handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block">
              Enter OTP
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              className="w-full p-2 border rounded"
              onChange={otpFormik.handleChange}
              value={otpFormik.values.otp}
            />
            {otpFormik.errors.otp && (
              <p className="text-red-500">{otpFormik.errors.otp}</p>
            )}
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Login
          </button>
        </form>
      )}
    </div>
  );
}