'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import Image from "next/image";
import { CurrencyRateModal } from "@/components/modal/CurrencyRateModal";
import { Button } from "@/components/ui/button";
const API_BASE = "http://localhost:5000";
// Add more currencies if needed!
const currencyNames: Record<string, string> = {
  USD: "US Dollar",
  EUR: "Euro",
  JPY: "Japanese Yen",
  GBP: "British Pound",
  CHF: "Swiss Franc",
  AUD: "Australian Dollar",
  CAD: "Canadian Dollar",
};

export default function WeeklyCurrencyRatesPage() {
  const router = useRouter();
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [modalData, setModalData] = useState<any>({});

  // Fetch currencies from backend
  useEffect(() => {
    fetch(`${API_BASE}/api/currency-rate`)
      .then((res) => res.json())
      .then((data) => setCurrencies(data));
  }, []);

  // Only show rates where to === "GBP"
  const gbpCurrencies = currencies.filter((row) => row.to === "GBP");

  const filteredCurrencies = gbpCurrencies.filter((row) =>
    (`${currencyNames[row.from] || ""} ${row.from}`.toLowerCase())
      .includes(searchQuery.trim().toLowerCase())
  );

  // Modal open handlers
  const handleAdd = () => {
    setModalMode("add");
    setModalData({});
    setModalOpen(true);
  };

  const handleEdit = (row: any) => {
    setModalMode("edit");
    setModalData({
      from: row.from,
      rate: row.rate,
    });
    setModalOpen(true);
  };

  // Save handler (add or edit)
  const handleSave = async (data: { from: string; to: string; rate: number }) => {
    await fetch(`${API_BASE}/api/currency-rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setModalOpen(false);
    // Re-fetch updated currency rates
    fetch(`${API_BASE}/api/currency-rate`)
      .then((res) => res.json())
      .then((data) => setCurrencies(data));
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
            <Image width={16} height={16} src="/icons/arrow_back.svg" alt="Back" className="w-4 h-4" />
            <h1 className="text-lg font-semibold text-body">Weekly Currency Rates</h1>
          </div>
          <p className="text-sm text-muted">
            Update exchange rates used in landed cost calculations.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handleAdd} variant="outline">
            <Image width={16} height={16} src="/icons/add.svg" alt="Plus" className="w-4 h-4" />
            <span className="ml-2">Add Currency</span>
          </Button>
        </div>
      </div>
      {/* Search Bar */}
      <div className="flex items-center gap-2 w-[400px] mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search Currency/code"
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
      </div>
      {/* Table */}
      <div className="border border-border rounded overflow-hidden text-sm">
        <table className="w-full text-left">
          <thead className="bg-background-subtle text-body font-medium border-b border-border">
            <tr>
              <th className="px-4 py-4 border-r border-border">Currency</th>
              <th className="px-4 py-4 border-r border-border">Code</th>
              <th className="px-4 py-4 border-r border-border">Exchange Rate (to GBP)</th>
              <th className="px-4 py-4 border-r border-border">Last Updated</th>
              <th className="px-4 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {filteredCurrencies.length > 0 ? (
              filteredCurrencies.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-border hover:bg-background"
                >
                  <td className="px-4 py-4 border-r border-border">
                    {currencyNames[row.from] || row.from}
                  </td>
                  <td className="px-4 py-4 border-r border-border">{row.from}</td>
                  <td className="px-4 py-4 border-r border-border">{row.rate}</td>
                  <td className="px-4 py-4">
                    {row.date ? new Date(row.date).toLocaleDateString() : ""}
                  </td>
                  <td className="px-4 py-4">
                    <Image
                      width={16}
                      height={16}
                      src="/icons/edit_pen.svg"
                      alt="Edit"
                      className="w-4 h-4 cursor-pointer opacity-60 hover:opacity-100"
                      onClick={() => handleEdit(row)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
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
    </DashboardLayout>
  );
}
