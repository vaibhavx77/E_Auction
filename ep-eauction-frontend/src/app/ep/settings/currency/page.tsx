'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import Image from "next/image";
import { CurrencyRateModal } from "@/components/modal/CurrencyRateModal";
import { Button } from "@/components/ui/button";

const API_BASE = "http://localhost:5000";

// ---- Currency type definition ----
type Currency = {
  _id?: string;
  currency: string;
  code: string;
  rate: number;
  updatedAt?: string;
};

export default function WeeklyCurrencyRatesPage() {
  const router = useRouter();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [modalData, setModalData] = useState<Partial<Currency>>({});
  const [deleteMode, setDeleteMode] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Currency | null>(null);

  // Fetch currencies from backend
  const fetchCurrencies = () => {
    fetch(`${API_BASE}/api/currency-rate`)
      .then((res) => res.json())
      .then((data: Currency[]) => setCurrencies(data));
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  // Filter by search
  const filteredCurrencies = currencies.filter((row) =>
    `${row.currency} ${row.code}`.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  // Modal open handlers
  const handleAdd = () => {
    setModalMode("add");
    setModalData({});
    setModalOpen(true);
  };

  const handleEdit = (row: Currency) => {
    setModalMode("edit");
    setModalData({
      _id: row._id,
      currency: row.currency,
      code: row.code,
      rate: row.rate,
    });
    setModalOpen(true);
  };

  // Save handler (add or edit)
  const handleSave = async (data: { currency: string; code: string; rate: number }) => {
    await fetch(`${API_BASE}/api/currency-rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setModalOpen(false);
    fetchCurrencies();
  };

  // Delete logic
  const handleDelete = async () => {
    if (!deleteTarget || !deleteTarget._id) return;
    await fetch(`${API_BASE}/api/currency-rate/${deleteTarget._id}`, {
      method: "DELETE",
    });
    setDeleteTarget(null);
    fetchCurrencies();
  };

  return (
    <DashboardLayout>
      {/* Top Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div
            className="flex items-center gap-2 mb-1 cursor-pointer"
            onClick={() => router.push("/ep/settings")}
          >
            <Image width={16} height={16} src="/icons/arrow_left.svg" alt="Back" className="w-4 h-4" />
            <h1 className="text-lg font-semibold text-body">Weekly Currency Rates</h1>
          </div>
          <p className="text-sm ">
            Update exchange rates used in landed cost calculations.
          </p>
        </div>
        <Button onClick={handleAdd} variant="outline">
          <Image width={16} height={16} src="/icons/add.svg" alt="Plus" className="w-4 h-4" />
          <span className="ml-2">Add Currency</span>
        </Button>
      </div>
      {/* Search + Delete Button Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-[400px]">
          <input
            type="text"
            placeholder="Search Currency/Code"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-borderInput p-2 pl-10 rounded text-sm"
          />
          <Image
            width={16}
            height={16}
            src="/icons/magnifying.svg"
            alt="Search"
            className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2"
          />
        </div>
        {!deleteMode ? (
          <button
            onClick={() => setDeleteMode(true)}
            className="flex items-center gap-2 bg-background-red text-red-600 px-4 py-2 rounded text-sm font-semibold transition bg-white border border-red-200"
          >
            <Image width={16} height={16} src="/icons/trash_filled.svg" alt="Delete" />
            Delete
          </button>
        ) : (
          <button
            onClick={() => setDeleteMode(false)}
            className="flex items-center gap-2 border border-gray-400 text-gray-700 px-4 py-2 rounded text-sm font-semibold transition bg-white"
          >
            Cancel
          </button>
        )}
      </div>
      {/* Table */}
<div className="border border-border rounded overflow-hidden text-sm">
  <table className="w-full table-fixed text-left">
    <thead className="bg-background-subtle text-body font-medium border-b border-border">
      <tr>
        <th className="px-4 py-4 border-r border-border w-1/3">Currency Name</th>
        <th className="px-4 py-4 border-r border-border w-1/6">Code</th>
        <th className="px-4 py-4 border-r border-border w-1/3">Exchange Rate (to GBP)</th>
        <th className="px-4 py-4 border-r border-border w-1/4">Last Updated</th>
      </tr>
    </thead>
    <tbody>
      {filteredCurrencies.length > 0 ? (
        filteredCurrencies.map((row, index) => (
          <tr
            key={row._id || index}
            className="border-b border-border hover:bg-background"
          >
            <td className="px-4 py-4 border-r border-border relative group">
              <div className="flex items-center justify-between min-w-0 overflow-hidden">
                <span className="truncate">{row.currency}</span>
                {deleteMode && (
                  <button
                    className="ml-2 flex-shrink-0 w-6 h-6 flex items-center justify-center p-0 hover:bg-red-50 rounded transition"
                    title="Delete"
                    onClick={() => setDeleteTarget(row)}
                    style={{ minWidth: 24, minHeight: 24 }}
                  >
                    <Image
                      width={20}
                      height={20}
                      src="/icons/trash_filled.svg"
                      alt="Delete"
                      className="w-5 h-5"
                    />
                  </button>
                )}
              </div>
            </td>
            <td className="px-4 py-4 border-r border-border">{row.code}</td>
            <td className="px-4 py-4 border-r border-border">
              <div className="flex items-center justify-between">
                <span>{row.rate}</span>
                <Image
                  width={16}
                  height={16}
                  src="/icons/edit_pen.svg"
                  alt="Edit"
                  className="w-4 h-4 cursor-pointer opacity-60 hover:opacity-100 ml-2"
                  onClick={() => handleEdit(row)}
                />
              </div>
            </td>
            <td className="px-4 py-4 border-r border-border">
              {row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : ""}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-500">
            No results found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>



      {/* Currency Rate Modal */}
      <CurrencyRateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={modalData}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-lg flex flex-col gap-5 items-center">
            <Image src="/icons/trash_filled.svg" width={32} height={32} alt="Delete" className="mb-1" />
            <h2 className="text-lg font-semibold mb-2 text-red-600">Delete Currency</h2>
            <p className="text-center text-body">
              Are you sure you want to delete <b>{deleteTarget.currency} ({deleteTarget.code})</b>?<br />
              This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-2 w-full justify-center">
              <button
                className="px-5 py-2 bg-gray-100 rounded text-body hover:bg-gray-200 transition"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                onClick={handleDelete}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
