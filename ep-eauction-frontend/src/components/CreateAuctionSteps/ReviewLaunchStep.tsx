type ReviewLaunchStepProps = {
  data: any;
};

export default function ReviewLaunchStep({ data }: ReviewLaunchStepProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Review & Launch</h2>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
      <p className="text-sm text-[#5E5E65] mt-4">
        Please review all details before launching the auction.
      </p>
    </div>
  );
}
