type SupplierInvitationStepProps = {
  data: any;
  onChange: (data: any) => void;
};

export default function SupplierInvitationStep({ data, onChange }: SupplierInvitationStepProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Supplier Invitations</h2>
      <div>
        <label className="block text-sm mb-1">Supplier Emails (comma separated)</label>
        <input
          type="text"
          placeholder="supplier1@email.com, supplier2@email.com"
          className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm"
          value={data.suppliers || ''}
          onChange={e => onChange({ suppliers: e.target.value })}
        />
      </div>
      {/* Add more invitation logic as needed */}
    </div>
  );
}
