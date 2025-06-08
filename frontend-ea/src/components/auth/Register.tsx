// src/components/auth/Register.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../lib/api';

export default function Register() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [invitationValid, setInvitationValid] = useState<boolean | null>(null);
  const [showAgreement, setShowAgreement] = useState(true);
  const [agreementAccepted, setAgreementAccepted] = useState(false);

  // Extract invitation token from URL
  const invitationToken = searchParams.get('invitation');

  // Validate invitation token on mount
  useEffect(() => {
    const validateInvitation = async () => {
      if (!invitationToken) {
        setError('Invalid or missing invitation. Please use a valid invitation link.');
        setInvitationValid(false);
        return;
      }

      try {
        setError(null);
        await api.post('/api/invitation/validate', { token: invitationToken });
        setInvitationValid(true);
      } catch (error: any) {
        console.error('Full Invitation Validation Error:', error);
        setError(
          error.response?.data?.message ||
            'Invalid invitation link. Please contact the admin.'
        );
        setInvitationValid(false);
      }
    };

    validateInvitation();
  }, [invitationToken]);

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
    portOfLoading: Yup.string().required('Port of loading is required'),
    containerCapacity: Yup.number()
      .min(1, 'Must be at least 1')
      .required('Container capacity is required'),
    importDutiesInfo: Yup.string().required('Import duties information is required'),
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
      portOfLoading: '',
      containerCapacity: '',
      importDutiesInfo: '',
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
            portOfLoading: values.portOfLoading,
            containerCapacity: values.containerCapacity,
            importDutiesInfo: values.importDutiesInfo,
          },
          businessDocs: [], // Empty for now; handled later
          invitationToken, // Include the invitation token
        });
        const data = response.data as { message?: string };
        if (data.message === 'Registration successful') {
          setSuccess('Registration successful! Please log in.');
          setTimeout(() => router.push('/login'), 2000);
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

  const handleAcceptAgreement = () => {
    setAgreementAccepted(true);
    setShowAgreement(false);
  };

  const handleDeclineAgreement = () => {
    setError('You must accept the agreement to proceed.');
    setShowAgreement(false);
    router.push('/'); // Redirect to homepage if declined
  };

  if (invitationValid === null) {
    return <div className="text-center p-4">Validating invitation...</div>;
  }

  if (invitationValid === false) {
    return (
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold">Error</h1>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold">Register</h1>
      {showAgreement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h2 className="text-xl font-bold mb-4">Terms of Service</h2>
            <p className="mb-4">
              Please read and accept the terms of service to proceed with registration.
              [Placeholder for actual terms...]
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleAcceptAgreement}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Accept
              </button>
              <button
                onClick={handleDeclineAgreement}
                className="bg-red-500 text-white p-2 rounded"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
      {!showAgreement && agreementAccepted && (
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
          <div>
            <label htmlFor="portOfLoading" className="block">
              Port of Loading
            </label>
            <input
              id="portOfLoading"
              name="portOfLoading"
              type="text"
              className="w-full p-2 border rounded"
              onChange={formik.handleChange}
              value={formik.values.portOfLoading}
            />
            {formik.errors.portOfLoading && (
              <p className="text-red-500">{formik.errors.portOfLoading}</p>
            )}
          </div>
          <div>
            <label htmlFor="containerCapacity" className="block">
              Container Capacity (Cartons per Container)
            </label>
            <input
              id="containerCapacity"
              name="containerCapacity"
              type="number"
              className="w-full p-2 border rounded"
              onChange={formik.handleChange}
              value={formik.values.containerCapacity}
            />
            {formik.errors.containerCapacity && (
              <p className="text-red-500">{formik.errors.containerCapacity}</p>
            )}
          </div>
          <div>
            <label htmlFor="importDutiesInfo" className="block">
              Import Duties Information
            </label>
            <input
              id="importDutiesInfo"
              name="importDutiesInfo"
              type="text"
              className="w-full p-2 border rounded"
              onChange={formik.handleChange}
              value={formik.values.importDutiesInfo}
            />
            {formik.errors.importDutiesInfo && (
              <p className="text-red-500">{formik.errors.importDutiesInfo}</p>
            )}
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Register
          </button>
        </form>
      )}
    </div>
  );
}