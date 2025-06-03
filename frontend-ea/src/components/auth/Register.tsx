// src/components/auth/Register.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../lib/api';

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const registerSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    companyName: Yup.string().required('Company name is required'),
    registrationNumber: Yup.string().required('Registration number is required'),
    taxId: Yup.string().required('Tax ID is required'),
    address: Yup.string().required('Address is required'),
    coreCapabilities: Yup.string().required('Core capabilities are required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      companyName: '',
      registrationNumber: '',
      taxId: '',
      address: '',
      coreCapabilities: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      try {
        setError(null);
        setSuccess(null);
        const response = await api.post('/api/auth/register', {
          name: values.name,
          email: values.email,
          password: values.password,
          profile: {
            companyName: values.companyName,
            registrationNumber: values.registrationNumber,
            taxId: values.taxId,
            address: values.address,
            coreCapabilities: values.coreCapabilities,
          },
          businessDocs: [], // Empty for now; we'll handle uploads separately
        });
        if (response.data.message === 'Registration successful') {
          setSuccess('Registration successful! Please log in.');
          setTimeout(() => router.push('/login'), 2000); // Redirect after 2 seconds
        }
      } catch (error: any) {
        console.error('Full Register Error:', error);
        if (error.code === 'ERR_NETWORK') {
          setError('Cannot connect to the server. Please ensure the backend is running.');
        } else {
          setError(error.response?.data?.message || 'Registration failed');
        }
      }
    },
  });

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold">Register</h1>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="w-full p-2 border rounded"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          {formik.errors.name && <p className="text-red-500">{formik.errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full p-2 border rounded"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          {formik.errors.email && <p className="text-red-500">{formik.errors.email}</p>}
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
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          {formik.errors.password && <p className="text-red-500">{formik.errors.password}</p>}
        </div>
        <div>
          <label htmlFor="companyName" className="block">
            Company Name
          </label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            className="w-full p-2 border rounded"
            onChange={formik.handleChange}
            value={formik.values.companyName}
          />
          {formik.errors.companyName && (
            <p className="text-red-500">{formik.errors.companyName}</p>
          )}
        </div>
        <div>
          <label htmlFor="registrationNumber" className="block">
            Registration Number
          </label>
          <input
            id="registrationNumber"
            name="registrationNumber"
            type="text"
            className="w-full p-2 border rounded"
            onChange={formik.handleChange}
            value={formik.values.registrationNumber}
          />
          {formik.errors.registrationNumber && (
            <p className="text-red-500">{formik.errors.registrationNumber}</p>
          )}
        </div>
        <div>
          <label htmlFor="taxId" className="block">
            Tax ID
          </label>
          <input
            id="taxId"
            name="taxId"
            type="text"
            className="w-full p-2 border rounded"
            onChange={formik.handleChange}
            value={formik.values.taxId}
          />
          {formik.errors.taxId && <p className="text-red-500">{formik.errors.taxId}</p>}
        </div>
        <div>
          <label htmlFor="address" className="block">
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            className="w-full p-2 border rounded"
            onChange={formik.handleChange}
            value={formik.values.address}
          />
          {formik.errors.address && <p className="text-red-500">{formik.errors.address}</p>}
        </div>
        <div>
          <label htmlFor="coreCapabilities" className="block">
            Core Capabilities
          </label>
          <input
            id="coreCapabilities"
            name="coreCapabilities"
            type="text"
            className="w-full p-2 border rounded"
            onChange={formik.handleChange}
            value={formik.values.coreCapabilities}
          />
          {formik.errors.coreCapabilities && (
            <p className="text-red-500">{formik.errors.coreCapabilities}</p>
          )}
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}