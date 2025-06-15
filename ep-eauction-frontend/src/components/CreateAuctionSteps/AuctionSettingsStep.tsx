type AuctionSettingsStepProps = {
  data: any;
  onChange: (data: any) => void;
};

export default function AuctionSettingsStep({ data, onChange }: AuctionSettingsStepProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Set auction behavior and schedule</h2>
      <p className="text-sm text-[#5E5E65] mb-8">
        Configure timing, rules, and auction type
      </p>
      <div className="grid grid-cols-2 gap-4 rounded">
        <div>
          <label className="block text-sm mb-1">Auction Start Date & Time</label>
          <input
            type="datetime-local"
            className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm"
            value={data.startTime || ''}
            onChange={e => onChange({ startTime: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Auction End Date & Time</label>
          <input
            type="datetime-local"
            className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm"
            value={data.endTime || ''}
            onChange={e => onChange({ endTime: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Enable Auto Extension (Checkbox)</label>
          <input
            type="text"
            placeholder="Allow Pause/Resume During Auction (Toggle)"
            className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Allow Pause/Resume During Auction (Toggle)</label>
          <input
            type="text"
            placeholder="Allow Pause/Resume During Auction (Toggle)"
            className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm"
          />
        </div>
      </div>
    </div>
  );
}