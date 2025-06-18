type AuctionSettingsStepProps = {
  data: any;
  onChange: (data: any) => void;
  showErrors?: boolean;
};

export default function AuctionSettingsStep({ data, onChange, showErrors }: AuctionSettingsStepProps) {
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
            className={`w-full border px-3 py-2 rounded text-sm ${
              showErrors && !data.startTime ? 'border-red-500' : 'border-[#DDE1EB]'
            }`}
            value={data.startTime || ''}
            onChange={e => onChange({ startTime: e.target.value })}
          />
          {showErrors && !data.startTime && (
            <span className="text-xs text-red-500">Required</span>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1">Auction End Date & Time</label>
          <input
            type="datetime-local"
            className={`w-full border px-3 py-2 rounded text-sm ${
              showErrors && !data.endTime ? 'border-red-500' : 'border-[#DDE1EB]'
            }`}
            value={data.endTime || ''}
            onChange={e => onChange({ endTime: e.target.value })}
          />
          {showErrors && !data.endTime && (
            <span className="text-xs text-red-500">Required</span>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1">Enable Auto Extension (Checkbox)</label>
          <input
            type="text"
            placeholder="Allow Pause/Resume During Auction (Toggle)"
            className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm"
            // Add logic if you want to make this interactive!
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Allow Pause/Resume During Auction (Toggle)</label>
          <input
            type="text"
            placeholder="Allow Pause/Resume During Auction (Toggle)"
            className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm"
            // Add logic if you want to make this interactive!
          />
        </div>
      </div>
    </div>
  );
}
