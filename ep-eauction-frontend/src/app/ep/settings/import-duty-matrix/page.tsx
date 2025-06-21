'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import DutyModal from '../../../../components/modal/DutyModal';

const API_BASE = "http://localhost:5000";

type Country = { _id: string; name: string };
type Product = { _id: string; name: string; hsCode?: string };
type DutyRow = {
  _id: string;
  product: string;
  country: string;
  dutyRate: number | null;
  productId?: string;
  countryId?: string;
  code?: string;
  createdAt?: string;
  updatedAt?: string;
};

function generateCsv(
  products: Product[],
  countries: Country[],
  dutyMatrix: { [product: string]: { [country: string]: { rate: string; id?: string } } }
) {
  const header = ["", ...countries.map(c => c.name)];
  const rows: string[][] = [];

  for (const product of products) {
    const row = [
      product.name,
      product.hsCode ?? ''
    ];
    for (const country of countries) {
      const cell = dutyMatrix[product.name]?.[country.name];
      row.push(cell?.rate || '');
    }
    rows.push(row);
  }
  const csvArray = [header, ...rows];
  return csvArray.map(row => row.map(field => `"${field}"`).join(',')).join('\r\n');
}

function downloadCsv(csv: string, filename = "import-duty-matrix.csv") {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function ImportDutyMatrixPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [dutyRows, setDutyRows] = useState<DutyRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState<{
    open: boolean;
    country?: Country;
    product?: Product;
    currentRate?: number | null;
    dutyRowId?: string;
  }>({ open: false });

  const [showAddCountry, setShowAddCountry] = useState(false);
  const [newCountry, setNewCountry] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState('');
  const [deleteMode, setDeleteMode] = useState(false);

  const [confirm, setConfirm] = useState<{
    open: boolean;
    type: 'country' | 'product' | null;
    id: string;
    name: string;
  }>({ open: false, type: null, id: '', name: '' });

  const router = useRouter();

  // Fetch countries
  const loadCountries = () => {
    fetch(`${API_BASE}/api/import-duty/countries`)
      .then(res => res.json())
      .then(data => setCountries(Array.isArray(data) ? data : []))
      .catch(console.error);
  };
  useEffect(loadCountries, []);

  // Fetch products
  const loadProducts = () => {
    fetch(`${API_BASE}/api/import-duty/products`)
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(console.error);
  };
  useEffect(loadProducts, []);

  // Fetch duty matrix
  const loadDuties = () => {
    setLoading(true);
    fetch(`${API_BASE}/api/import-duty/`)
      .then(res => res.json())
      .then(data => {
        setDutyRows(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  };
  useEffect(loadDuties, []);

  const dutyMatrix = useMemo(() => {
    const matrix: { [product: string]: { [country: string]: { rate: string, id?: string } } } = {};
    for (const row of dutyRows ?? []) {
      if (!matrix[row.product]) matrix[row.product] = {};
      matrix[row.product][row.country] = {
        rate: row.dutyRate != null ? row.dutyRate + '%' : '',
        id: row._id,
      };
    }
    return matrix;
  }, [dutyRows]);

  const countryKeys = countries.map(c => c.name);

  const getCountryByName = (name: string) => countries.find(c => c.name === name);

  const handleOpenAdd = (product: Product, country: Country) => {
    setModal({ open: true, product, country, currentRate: null, dutyRowId: undefined });
  };
  const handleOpenEdit = (product: Product, country: Country, rate: string, dutyRowId?: string) => {
    setModal({
      open: true,
      product,
      country,
      currentRate: Number(rate.replace('%', '')) || 0,
      dutyRowId,
    });
  };
  const handleCloseModal = () => setModal({ open: false });

  const handleSaveDuty = async (product: Product, country: Country, rate: number) => {
    try {
      await fetch(`${API_BASE}/api/import-duty/`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: product._id,
          country: country._id,
          dutyRate: rate,
        }),
      });
      handleCloseModal();
      loadDuties();
    } catch {
      alert('Failed to save duty rate');
    }
  };

  const handleAddCountry = async () => {
    if (!newCountry.trim()) return;
    await fetch(`${API_BASE}/api/import-duty/country`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCountry.trim() }),
    });
    setNewCountry('');
    setShowAddCountry(false);
    loadCountries();
  };

  const handleAddProduct = async () => {
    if (!newProduct.trim()) return;
    await fetch(`${API_BASE}/api/import-duty/product`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newProduct.trim() }),
    });
    setNewProduct('');
    setShowAddProduct(false);
    loadProducts();
  };

  const handleDeleteCountry = async (id: string) => {
    alert(`Country deleted (id: ${id})`);
    setConfirm({ open: false, type: null, id: '', name: '' });
    loadCountries();
    loadDuties();
  };

  const handleDeleteProduct = async (id: string) => {
    alert(`Product deleted (id: ${id})`);
    setConfirm({ open: false, type: null, id: '', name: '' });
    loadProducts();
    loadDuties();
  };

  const handleSaveChanges = () => {
    alert('Changes saved!');
    loadDuties();
  };

  return (
    <DashboardLayout>
      {/* Top header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div
            className="flex items-center gap-2 mb-1 cursor-pointer"
            onClick={() => router.push('/ep/settings')}
          >
            <Image width={5} height={5} src="/icons/arrow_left.svg" alt="Back" className="w-4 h-4" />
            <h1 className="text-lg font-semibold text-body">Import Duty Matrix</h1>
          </div>
          <p className="text-sm ">
            Configure import duty percentages by country and product type
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              const csv = generateCsv(products, countries, dutyMatrix);
              downloadCsv(csv);
            }}
            className="flex items-center gap-2 border border-borderInput px-4 py-2 rounded text-sm text-body"
          >
            <Image width={5} height={5} src="/icons/export.svg" alt="Download" className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={handleSaveChanges}
            className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded"
          >
            Save changes
          </button>
        </div>
      </div>
      {/* Search + Add buttons */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products or HS codes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-borderInput p-2 pl-10 rounded text-sm w-72"
            />
            <Image
              width={5}
              height={5}
              src="/icons/magnifying.svg"
              alt="Search"
              className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-icon"
            />
          </div>
          <button
            onClick={() => setShowAddCountry(true)}
            className="flex items-center gap-2 bg-background-blue text-status-scheduled text-sm font-medium px-4 py-2 rounded"
          >
            <Image width={5} height={5} src="/icons/add.svg" alt="Plus" className="w-4 h-4" />
            Add Country
          </button>
          <button
            onClick={() => setShowAddProduct(true)}
            className="flex items-center gap-2 bg-status-success-light text-status-success text-sm font-medium px-4 py-2 rounded"
          >
            <Image width={5} height={5} src="/icons/add_green.svg" alt="Plus" className="w-4 h-4" />
            Add Product
          </button>
        </div>
        {!deleteMode ? (
          <button
            onClick={() => setDeleteMode(true)}
            className="flex items-center gap-2 bg-background-red text-red-600 px-4 py-2 rounded text-sm font-semibold transition bg-white"
          >
            <Image width={16} height={16} src="/icons/trash.svg" alt="Delete" />
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

      {/* Add Country Modal */}
      {showAddCountry && (
        <div className="fixed inset-0 z-40 bg-black/20 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Add Country</h2>
            <input
              type="text"
              value={newCountry}
              onChange={e => setNewCountry(e.target.value)}
              placeholder="Country name"
              className="border border-borderInput p-2 rounded w-full mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button className="px-4 py-2" onClick={() => setShowAddCountry(false)}>Cancel</button>
              <button className="bg-primary text-white px-4 py-2 rounded" onClick={handleAddCountry}>Add</button>
            </div>
          </div>
        </div>
      )}
      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 z-40 bg-black/20 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Add Product</h2>
            <input
              type="text"
              value={newProduct}
              onChange={e => setNewProduct(e.target.value)}
              placeholder="Product name"
              className="border border-borderInput p-2 rounded w-full mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button className="px-4 py-2" onClick={() => setShowAddProduct(false)}>Cancel</button>
              <button className="bg-primary text-white px-4 py-2 rounded" onClick={handleAddProduct}>Add</button>
            </div>
          </div>
        </div>
      )}

      {confirm.open && (
  <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
    <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-xl flex flex-col gap-5 min-w-[340px]">
      {/* Title left, icon on right */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-bold text-gray-900">
          Confirm Deletion
        </span>
      </div>
      {/* Description */}
      <div className="text-left mb-2">
        <span>
          Are you sure you want to delete{' '}
          <b className="text-red-600">
            {confirm.type === 'country' ? 'country' : 'product'} {confirm.name}
          </b>
          ?
        </span>
        <div className="text-xs mt-8 mt-1">
          This action cannot be undone.
        </div>
      </div>
      {/* Buttons aligned right */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          className="px-5 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium"
          onClick={() => setConfirm({ open: false, type: null, id: '', name: '' })}
        >
          Cancel
        </button>
        <button
          className="px-5 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
          onClick={() => {
            if (confirm.type === 'country') handleDeleteCountry(confirm.id);
            if (confirm.type === 'product') handleDeleteProduct(confirm.id);
          }}
        >
          OK
        </button>
      </div>
    </div>
  </div>
)}


      {/* Table */}
      <div className="border border-border rounded text-sm overflow-x-auto w-full">
        <table className="w-full border-collapse text-left">
          <thead className="bg-background-subtle text-body font-medium border-b border-border">
            <tr>
              <th
                className="min-w-[300px] px-4 py-3 sticky left-0 bg-background-subtle z-20 border-r border-border whitespace-nowrap shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span>Product <span className="text-xs">(HS Code)</span></span>
                  {/* Product Delete icon is per row, not in header */}
                </div>
              </th>
              {countryKeys.map((country, cIdx) => (
                <th
                  key={country}
                  className="pl-2 pr-12 py-1 border-l border-border bg-background-subtle whitespace-nowrap"
                >
                  <div className="flex items-center justify-between">
                    <span>
                      {country} <span className="text-xs ml-1">Duty %</span>
                    </span>
                    {deleteMode && (
                      <button
                        title={`Delete ${country}`}
                        onClick={() => setConfirm({ open: true, type: 'country', id: countries[cIdx]._id, name: country })}
                        className="ml-2"
                      >
                        <Image width={16} height={16} src="/icons/trash_filled.svg" alt="Delete Country" className="inline-block" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={1 + countryKeys.length} className="text-center py-8">
                  Loading...
                </td>
              </tr>
            ) : (
              products
                .filter(
                  (prod) =>
                    prod.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
                )
                .map((prod) => (
                  <tr key={prod._id} className="border-b border-border">
                    <td className="px-4 py-4 sticky left-0 bg-white z-20 border-r border-border shadow-md">
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                          <span>
                            {prod.name}
                            {prod.hsCode && (
                              <span className="text-xs block">{prod.hsCode}</span>
                            )}
                          </span>
                          {deleteMode && (
                            <button
                              title={`Delete ${prod.name}`}
                              onClick={() => setConfirm({ open: true, type: 'product', id: prod._id, name: prod.name })}
                              className="ml-2"
                            >
                              <Image width={16} height={16} src="/icons/trash_filled.svg" alt="Delete Product" className="inline-block" />
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                    {countryKeys.map((country) => {
                      const cell = dutyMatrix[prod.name]?.[country];
                      return (
                        <td
                          key={country}
                          className="pr-4 py-1 text-center border-l border-border"
                        >
                          {cell && cell.rate ? (
                            <div className="flex items-center justify-between px-2">
                              <span className="text-left">{cell.rate}</span>
                              <Image
                                width={5}
                                height={5}
                                src="/icons/edit_pen.svg"
                                alt="Edit"
                                className="w-4 h-4 cursor-pointer opacity-60 hover:opacity-100"
                                onClick={() =>
                                  handleOpenEdit(
                                    prod,
                                    getCountryByName(country)!,
                                    cell.rate,
                                    cell.id
                                  )
                                }
                              />
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                handleOpenAdd(prod, getCountryByName(country)!)
                              }
                              className="text-status-scheduled text-xl leading-none hover:bg-background-blue rounded w-7 h-7 flex items-center justify-center mx-auto"
                            >
                              +
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for add/edit duty */}
      <DutyModal
        open={modal.open}
        country={modal.country}
        product={modal.product}
        currentRate={modal.currentRate}
        onClose={handleCloseModal}
        onSave={handleSaveDuty}
      />
    </DashboardLayout>
  );
}
