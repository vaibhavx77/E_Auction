'use client';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import api from '../../../lib/api';

// Mock data (fallback if API call fails)
const mockImportDuties = [
  {
    id: 1,
    country: 'USA',
    productCategory: 'Electronics',
    dutyRate: 5.2,
    effectiveDate: '2025-01-01',
  },
  {
    id: 2,
    country: 'India',
    productCategory: 'Textiles',
    dutyRate: 12.5,
    effectiveDate: '2025-03-15',
  },
  {
    id: 3,
    country: 'China',
    productCategory: 'Machinery',
    dutyRate: 8.0,
    effectiveDate: '2025-06-01',
  },
  {
    id: 4,
    country: 'Germany',
    productCategory: 'Automotive',
    dutyRate: 3.5,
    effectiveDate: '2025-02-10',
  },
  // Add more mock data for testing pagination
  {
    id: 5,
    country: 'Japan',
    productCategory: 'Electronics',
    dutyRate: 4.0,
    effectiveDate: '2025-04-01',
  },
  {
    id: 6,
    country: 'USA',
    productCategory: 'Textiles',
    dutyRate: 6.5,
    effectiveDate: '2025-05-01',
  },
  {
    id: 7,
    country: 'India',
    productCategory: 'Machinery',
    dutyRate: 9.0,
    effectiveDate: '2025-07-01',
  },
  {
    id: 8,
    country: 'China',
    productCategory: 'Automotive',
    dutyRate: 2.5,
    effectiveDate: '2025-08-01',
  },
  {
    id: 9,
    country: 'Germany',
    productCategory: 'Electronics',
    dutyRate: 5.0,
    effectiveDate: '2025-09-01',
  },
  {
    id: 10,
    country: 'Japan',
    productCategory: 'Textiles',
    dutyRate: 7.0,
    effectiveDate: '2025-10-01',
  },
];

interface ImportDuty {
  id: number;
  country: string;
  productCategory: string;
  dutyRate: number;
  effectiveDate: string;
}

export default function ImportDutyTable() {
  const [importDuties, setImportDuties] = useState<ImportDuty[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof ImportDuty>('country');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);
  const rowsPerPage = 5;

  // Fetch import duties from the backend (falls back to mock data on failure)
  useEffect(() => {
    const fetchImportDuties = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/api/import-duties');
        setImportDuties(response.data);
      } catch (error: any) {
        setError('Failed to load import duties. Using mock data instead.');
        setImportDuties(mockImportDuties);
      } finally {
        setLoading(false);
      }
    };

    fetchImportDuties();
  }, []);

  // Handle column sorting
  const handleSort = (column: keyof ImportDuty) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Filter and sort data
  const filteredDuties = filterCountry
    ? importDuties.filter((duty) => duty.country === filterCountry)
    : importDuties;

  const sortedDuties = [...filteredDuties].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate data
  const totalPages = Math.ceil(sortedDuties.length / rowsPerPage);
  const paginatedDuties = sortedDuties.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Get unique countries for filter dropdown
  const uniqueCountries = Array.from(new Set(importDuties.map((duty) => duty.country))).sort();

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 md:p-10 lg:p-12 border border-gray-300 rounded-lg shadow-md w-full max-w-4xl space-y-6">
        <div className="flex flex-col items-center mb-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold pb-2 text-center text-blue-900">
            Import Duty Rates
          </h1>
          <p className="text-sm text-center text-gray-600 mb-6">
            View the latest import duty rates for various countries and product categories.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="country-filter" className="text-gray-700">
              Filter by Country:
            </label>
            <Select onValueChange={(value) => setFilterCountry(value === 'all' ? null : value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {uniqueCountries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-red-500 mb-4">{error}</p>}

        {!loading && sortedDuties.length === 0 && !error && (
          <p className="text-center text-gray-600">No import duties found.</p>
        )}

        {!loading && sortedDuties.length > 0 && (
          <>
            <div className="border border-gray-300 rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('country')}
                        className="flex items-center space-x-1"
                      >
                        <span>Country</span>
                        {sortColumn === 'country' && (
                          <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="text-left">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('productCategory')}
                        className="flex items-center space-x-1"
                      >
                        <span>Product Category</span>
                        {sortColumn === 'productCategory' && (
                          <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="text-left">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('dutyRate')}
                        className="flex items-center space-x-1"
                      >
                        <span>Duty Rate (%)</span>
                        {sortColumn === 'dutyRate' && (
                          <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="text-left">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('effectiveDate')}
                        className="flex items-center space-x-1"
                      >
                        <span>Effective Date</span>
                        {sortColumn === 'effectiveDate' && (
                          <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDuties.map((duty) => (
                    <TableRow key={duty.id}>
                      <TableCell>{duty.country}</TableCell>
                      <TableCell>{duty.productCategory}</TableCell>
                      <TableCell>{duty.dutyRate}%</TableCell>
                      <TableCell>{duty.effectiveDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}