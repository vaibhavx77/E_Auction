'use client';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import api from '../../../lib/api';

// Mock data (replace with API call when backend is ready)
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

  // Fetch data (using mock data for now)
  useEffect(() => {
    // Simulate API call
    setImportDuties(mockImportDuties);

    // Uncomment this when backend is ready
    /*
    const fetchImportDuties = async () => {
      try {
        const response = await api.get('/api/import-duties');
        setImportDuties(response.data);
      } catch (error) {
        console.error('Failed to fetch import duties:', error);
      }
    };
    fetchImportDuties();
    */
  }, []);

  // Sorting logic
  const handleSort = (column: keyof ImportDuty) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedDuties = [...importDuties].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

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

        <div className="border border-gray-300 rounded-lg overflow-hidden">
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
              {sortedDuties.map((duty) => (
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
      </div>
    </div>
  );
}