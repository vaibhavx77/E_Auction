type AuctionDetailsStepProps = {
  data: any;
  onChange: (data: any) => void;
};

export default function AuctionDetailsStep({ data, onChange }: AuctionDetailsStepProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Enter basic auction information</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            type="text"
            placeholder="Auction Title"
            className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm"
            value={data.title || ''}
            onChange={e => onChange({ title: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Auction Type</label>
          <input
            type="text"
            placeholder="Single LOTs / Multiple LOTs"
            className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm"
            value={data.type || ''}
            onChange={e => onChange({ type: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">SAP Code</label>
          <input
            type="text"
            placeholder="SAP Code"
            className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm"
            value={data.sapCode || ''}
            onChange={e => onChange({ sapCode: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Reserve Price</label>
          <input
            type="number"
            placeholder="Reserve Price"
            className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm"
            value={data.reservePrice || ''}
            onChange={e => onChange({ reservePrice: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Currency</label>
          <input
            type="text"
            placeholder="Currency (e.g. GBP)"
            className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm"
            value={data.currency || ''}
            onChange={e => onChange({ currency: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}