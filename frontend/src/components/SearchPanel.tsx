'use client';

import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { User } from '@/lib/types';
import { api } from '@/lib/api';
import IssueList from './IssueList';

interface SearchPanelProps {
  user: User;
}

interface SearchFilters {
  name: string;
  regNo: string;
  school: string;
  programme: string;
  gender: string;
  status: string;
  category: string;
  date: string;
  dateFrom: string;
  dateTo: string;
  assigned: string;
}

export default function SearchPanel({ user }: SearchPanelProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    name: '',
    regNo: '',
    school: '',
    programme: '',
    gender: '',
    status: '',
    category: '',
    date: '',
    dateFrom: '',
    dateTo: '',
    assigned: '',
  });

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 25,
    totalPages: 0,
  });

  const handleSearch = async (page = 1) => {
    setLoading(true);
    try {
      const searchParams: any = {
        page,
        limit: pagination.limit,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };

      // Add non-empty filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.trim()) {
          searchParams[key] = value;
        }
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/issues?${new URLSearchParams(
          searchParams
        ).toString()}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await response.json();
      
      setIssues(data.issues || []);
      setPagination({
        total: data.total || 0,
        page: data.page || 1,
        limit: data.limit || 25,
        totalPages: Math.ceil((data.total || 0) / (data.limit || 25)),
      });
    } catch (err) {
      console.error('Search failed:', err);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({
      name: '',
      regNo: '',
      school: '',
      programme: '',
      gender: '',
      status: '',
      category: '',
      date: '',
      dateFrom: '',
      dateTo: '',
      assigned: '',
    });
    setIssues([]);
    setPagination({
      total: 0,
      page: 1,
      limit: 25,
      totalPages: 0,
    });
  };

  const handlePageChange = (newPage: number) => {
    handleSearch(newPage);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Search size={24} />
          Advanced Issue Search
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Name
            </label>
            <input
              type="text"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Search by name..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registration Number
            </label>
            <input
              type="text"
              value={filters.regNo}
              onChange={(e) => setFilters({ ...filters, regNo: e.target.value })}
              className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 22BEC0977"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School
            </label>
            <select
              value={filters.school}
              onChange={(e) => setFilters({ ...filters, school: e.target.value })}
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Schools</option>
              <option value="SENSE">SENSE</option>
              <option value="Engineering">Engineering</option>
              <option value="SCOPE">SCOPE</option>
              <option value="VITBS">VITBS</option>
              <option value="VITSOL">VITSOL</option>
              <option value="SMEC">SMEC</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Programme
            </label>
            <input
              type="text"
              value={filters.programme}
              onChange={(e) =>
                setFilters({ ...filters, programme: e.target.value })
              }
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., B.Tech CSE"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={filters.gender}
              onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="Open">Open</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="Indian">Indian</option>
              <option value="International">NRI</option>
              <option value="International">Foreign</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignment Status
            </label>
            <select
              value={filters.assigned}
              onChange={(e) =>
                setFilters({ ...filters, assigned: e.target.value })
              }
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="true">Assigned</option>
              <option value="false">Unassigned</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exact Date
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date From
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) =>
                setFilters({ ...filters, dateFrom: e.target.value })
              }
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date To
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) =>
                setFilters({ ...filters, dateTo: e.target.value })
              }
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => handleSearch(1)}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
          >
            <Search size={18} />
            {loading ? 'Searching...' : 'Search Issues'}
          </button>

          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Reset
          </button>
        </div>
      </div>

      {issues.length > 0 && (
        <div>
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Search Results
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Found {pagination.total} issue{pagination.total !== 1 ? 's' : ''} (
                Page {pagination.page} of {pagination.totalPages})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1 || loading}
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>

              <span className="px-4 py-2 bg-gray-700 rounded-lg text-sm font-medium">
                {pagination.page} / {pagination.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages || loading}
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <IssueList issues={issues} />
        </div>
      )}

      {!loading && issues.length === 0 && pagination.total === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Search className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">
            No results found. Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}