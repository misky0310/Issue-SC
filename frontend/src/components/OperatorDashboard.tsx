'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { api } from '@/lib/api';
import RaiseIssueForm from './RaiseIssueForm';
import IssueList from './IssueList';
import SearchPanel from './SearchPanel';
import { Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface OperatorDashboardProps {
  user: User;
}

export default function OperatorDashboard({ user }: OperatorDashboardProps) {
  const [activeTab, setActiveTab] = useState<'issues' | 'raise' | 'search'>('issues');
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    gender: '',
    school: '',
    status: '',
    category: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  useEffect(() => {
    if (activeTab === 'issues') {
      fetchIssues(1);
    }
  }, [filters, activeTab]);

  const fetchIssues = async (page = 1) => {
    setLoading(true);
    try {
      const searchParams: any = {
        page,
        limit: pagination.limit,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };

      // Add filters
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
      console.error('Failed to fetch issues:', err);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchIssues(newPage);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('issues')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'issues'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          View Issues
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'search'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Search size={18} />
          Advanced Search
        </button>
        <button
          onClick={() => setActiveTab('raise')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'raise'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Raise Issue
        </button>
      </div>

      {activeTab === 'issues' ? (
        <div>
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">All Issues</h2>
              {pagination.total > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Showing {pagination.total} issue{pagination.total !== 1 ? 's' : ''} (
                  Page {pagination.page} of {pagination.totalPages})
                </p>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 hover:cursor-pointer rounded-lg transition-colors"
            >
              <Filter size={18} />
              Quick Filters
            </button>
          </div>

          {showFilters && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={filters.gender}
                    onChange={(e) =>
                      setFilters({ ...filters, gender: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School
                  </label>
                  <select
                    value={filters.school}
                    onChange={(e) =>
                      setFilters({ ...filters, school: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All</option>
                    <option value="SENSE">SENSE</option>
                    <option value="Engineering">Engineering</option>
                    <option value="SCOPE">SCOPE</option>
                    <option value="VITBS">VITBS</option>
                    <option value="SMEC">SMEC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All</option>
                    <option value="Indian">Indian</option>
                    <option value="International">International</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() =>
                  setFilters({ gender: '', school: '', status: '', category: '' })
                }
                className="mt-4 text-sm text-blue-600 hover:text-blue-700"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading issues...</p>
            </div>
          ) : (
            <>
              <IssueList issues={issues} />
              
              {pagination.totalPages > 1 && (
                <div className="bg-white rounded-lg shadow-sm p-4 mt-4 flex justify-center items-center gap-4">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1 || loading}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <span className="px-4 py-2 bg-gray-800 rounded-lg text-sm font-medium">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages || loading}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ) : activeTab === 'search' ? (
        <SearchPanel user={user} />
      ) : (
        <RaiseIssueForm
          user={user}
          onSuccess={() => {
            setActiveTab('issues');
            fetchIssues(1);
          }}
        />
      )}
    </div>
  );
}