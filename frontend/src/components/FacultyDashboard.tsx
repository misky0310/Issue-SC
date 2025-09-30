'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { User } from '@/lib/types';
import { api } from '@/lib/api';
import FacultyIssueList from './FacultyIssueList';
import SearchPanel from './SearchPanel';

interface FacultyDashboardProps {
  user: User;
}

export default function FacultyDashboard({ user }: FacultyDashboardProps) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'all' | 'mine' | 'search'>('mine');
  const [errorMessage, setErrorMessage] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  useEffect(() => {
    if (view !== 'search') {
      fetchIssues(1);
    }
  }, [view]);

  const fetchIssues = async (page = 1) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const searchParams: any = {
        page,
        limit: pagination.limit,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };

      if (view === 'mine') {
        searchParams.mine = 'true';
      }

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

  const handlePickIssue = async (issueId: string) => {
    setErrorMessage('');
    try {
      await api.pickIssue(user.token, issueId);
      // Switch to "My Issues" view and fetch
      setView('mine');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to pick issue');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const handleResolveIssue = async (issueId: string, remark: string) => {
    setErrorMessage('');
    try {
      await api.resolveIssue(user.token, issueId, remark);
      fetchIssues(pagination.page);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resolve issue');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setView('mine')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            view === 'mine'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          My Issues
        </button>
        <button
          onClick={() => setView('all')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            view === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          All Unassigned Issues
        </button>
        <button
          onClick={() => setView('search')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
            view === 'search'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Search size={18} />
          Advanced Search
        </button>
      </div>

      {view === 'search' ? (
        <SearchPanel user={user} />
      ) : (
        <>
          {pagination.total > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <p className="text-sm text-gray-600">
                Showing {pagination.total} issue{pagination.total !== 1 ? 's' : ''} (
                Page {pagination.page} of {pagination.totalPages})
              </p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading issues...</p>
            </div>
          ) : (
            <>
              <FacultyIssueList
                issues={issues}
                onPickIssue={handlePickIssue}
                onResolveIssue={handleResolveIssue}
                view={view}
              />

              {pagination.totalPages > 1 && (
                <div className="bg-white rounded-lg shadow-sm p-4 mt-4 flex justify-center items-center gap-4">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1 || loading}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <span className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages || loading}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
