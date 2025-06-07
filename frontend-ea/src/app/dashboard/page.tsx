'use client';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 md:p-10 lg:p-12 border border-gray-300 rounded-lg shadow-md w-full max-w-4xl space-y-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold pb-2 text-center text-blue-900">
          Dashboard
        </h1>
        <p className="text-sm text-center text-gray-600 mb-6">
          Welcome to your E-Auction Platform dashboard.
        </p>
        <div className="flex flex-col space-y-4">
          <Link href="/dashboard/import-duties" className="text-blue-600 hover:underline">
            View Import Duty Rates
          </Link>
          {/* Add more links as needed */}
        </div>
      </div>
    </div>
  );
}