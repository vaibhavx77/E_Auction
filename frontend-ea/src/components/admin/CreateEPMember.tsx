// src/components/admin/CreateEPMember.tsx
'use client';
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../lib/api';
import AuthContext from '../../contexts/AuthContext';

export default function CreateEPMember() {
  const router = useRouter();
  const { role } = useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Redirect non-admins to login
  if (role !== 'Admin') {
    router.push('/login');
    return null;
  }

  const createEPMemberSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    role: Yup.string()
      .oneOf(['Admin', 'Manager', 'Viewer'], 'Invalid role')
      .required('Role is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: '',
    },
    validationSchema: createEPMemberSchema,
    onSubmit: async (values) => {
      try {
        setError(null);
        setSuccess(null);
        const response = await api.post('/api/auth/create-ep-member', {
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
          profile: {}, // Empty as per backend spec
        });
        if (response.data.message === 'EP member account created successfully') {
          setSuccess('EP member created successfully!');
          formik.resetForm();
        }
      } catch (error: any) {
        console.error('Full Create EP Member Error:', error);
        if (error.code === 'ERR_NETWORK') {
          setError('Cannot connect to the server. Please ensure the backend is running.');
        } else {
          setError(error.response?.data?.message || 'Failed to create EP member');
        }
      }
    },
  });

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold">Create EP Member</h1>
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
          <label htmlFor="role" className="block">
            Role
          </label>
          <select
            id="role"
            name="role"
            className="w-full p-2 border rounded"
            onChange={formik.handleChange}
            value={formik.values.role}
          >
            <option value="" disabled>
              Select a role
            </option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Viewer">Viewer</option>
          </select>
          {formik.errors.role && <p className="text-red-500">{formik.errors.role}</p>}
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Create EP Member
        </button>
      </form>
    </div>
  );
}