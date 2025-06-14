'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import EPHeader from '@/components/EPHeader';
import AuctionBreadcrumb from '@/components/AuctionBreadcrumb';
import AuctionDetailsStep from '@/components/CreateAuctionSteps/AuctionDetailsStep';
import ProductLotStep from '@/components/CreateAuctionSteps/ProductLotStep';
import AuctionSettingsStep from '@/components/CreateAuctionSteps/AuctionSettingsStep';
import SupplierInvitationStep from '@/components/CreateAuctionSteps/SupplierInvitationStep';
import ReviewLaunchStep from '@/components/CreateAuctionSteps/ReviewLaunchStep';

const steps = [
  'Auction Details',
  'Product & LOT',
  'Auction Settings',
  'Supplier Invitations',
  'Review & Launch',
];

export default function CreateAuctionPage() {
  const [step, setStep] = useState(0);
  const [auctionData, setAuctionData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const goNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const updateAuctionData = (data: any) => {
    setAuctionData((prev: any) => ({ ...prev, ...data }));
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: return <AuctionDetailsStep data={auctionData} onChange={updateAuctionData} />;
      case 1: return <ProductLotStep data={auctionData} onChange={updateAuctionData} />;
      case 2: return <AuctionSettingsStep data={auctionData} onChange={updateAuctionData} />;
      case 3: return <SupplierInvitationStep data={auctionData} onChange={updateAuctionData} />;
      case 4: return <ReviewLaunchStep data={auctionData} />;
      default: return null;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!auctionData.title || !auctionData.reservePrice || !auctionData.currency || !auctionData.startTime || !auctionData.endTime) {
      alert('Please fill all required fields.');
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auction/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(auctionData),
      });
      setLoading(false);
      if (res.ok) {
        alert('Auction created successfully!');
        router.push('/ep/dashboard');
      } else {
        const data = await res.json();
        alert(data.message || 'Auction creation failed');
      }
    } catch (err) {
      setLoading(false);
      alert('Network error');
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-[#383838] flex-col">
      <EPHeader />

      <main className="flex-1 p-8 max-w-6xl mx-auto">
        {/* Header with back button */}
        <div
          className="flex items-center gap-2 mb-1 cursor-pointer"
          onClick={() => router.push('/ep/dashboard')}
        >
          <Image width={5} height={5} src="/icons/arrow_left.svg" alt="Back" className="w-4 h-4" />
          <h1 className="text-xl font-semibold">Create Auction</h1>
        </div>
        <p className="text-sm text-[#5E5E65] mb-6">
          Fill out the details and create a new auction
        </p>

        {/* Stepper */}
        <AuctionBreadcrumb
          steps={steps}
          currentStep={step}
          onStepClick={(index) => setStep(index)}
        />

        {/* Step Content */}
        <div className="bg-white pt-6 rounded border-t border-[#EAECF0]">
          {renderStepContent(step)}
        </div>

        {/* Footer navigation */}
        <div className="flex bottom-0 justify-between mt-6">
          <button className="border border-[#DDE1EB] px-4 py-2 rounded text-sm">Save Draft</button>
          <div className="flex gap-4">
            <button
              onClick={step === steps.length - 1 ? handleSubmit : goNext}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
              disabled={loading}
            >
              {loading
                ? 'Submitting...'
                : step === steps.length - 1
                ? 'Launch Auction'
                : 'Next'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
