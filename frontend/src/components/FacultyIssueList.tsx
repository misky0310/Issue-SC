'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  BookOpen,
  GraduationCap,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { Issue } from '@/lib/types';

interface FacultyIssueListProps {
  issues: Issue[];
  onPickIssue: (id: string) => void;
  onResolveIssue: (id: string, remark: string) => void;
  view: 'all' | 'mine';
}

export default function FacultyIssueList({
  issues,
  onPickIssue,
  onResolveIssue,
  view,
}: FacultyIssueListProps) {
  const [resolvingIssue, setResolvingIssue] = useState<string | null>(null);
  const [remark, setRemark] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Open':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Resolved':
        return <CheckCircle size={16} />;
      case 'In Progress':
        return <Clock size={16} />;
      case 'Open':
        return <AlertTriangle size={16} />;
      default:
        return <AlertTriangle size={16} />;
    }
  };

  const handleResolveClick = (issueId: string) => {
    if (resolvingIssue === issueId) {
      if (remark.trim()) {
        onResolveIssue(issueId, remark);
        setResolvingIssue(null);
        setRemark('');
      } else {
        alert('Please enter a remark');
      }
    } else {
      setResolvingIssue(issueId);
      setRemark('');
    }
  };

  if (issues.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
        <p className="text-gray-600">
          {view === 'mine'
            ? 'No issues assigned to you yet'
            : 'No unassigned issues available'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <div
          key={issue._id}
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {issue.name}
                </h3>
                <span className="text-sm text-gray-600">({issue.regNo})</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                    issue.status
                  )}`}
                >
                  {getStatusIcon(issue.status)}
                  {issue.status}
                </span>
              </div>
              <p className="text-gray-700 mb-3">{issue.issue}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={16} />
              <span>{new Date(issue.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <BookOpen size={16} />
              <span>{issue.school}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <GraduationCap size={16} />
              <span>{issue.programme}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users size={16} />
              <span>{issue.gender}</span>
            </div>
          </div>

          {issue.assignedFaculty && typeof issue.assignedFaculty === 'object' && (
            <div className="mb-3 pb-3 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                Assigned to:{' '}
                <span className="font-medium text-gray-900">
                  {issue.assignedFaculty.name}
                </span>
                {issue.assignedFaculty.school && (
                  <span className="text-gray-500"> ({issue.assignedFaculty.school})</span>
                )}
              </p>
            </div>
          )}

          {issue.remark && (
            <div className="mb-3 pb-3 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                Remark: <span className="text-gray-900">{issue.remark}</span>
              </p>
            </div>
          )}

          {resolvingIssue === issue._id && (
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resolution Remark
              </label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter resolution details..."
              />
            </div>
          )}

          <div className="flex gap-3">
            {view === 'all' && !issue.assignedFaculty && (
              <button
                onClick={() => onPickIssue(issue._id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Pick This Issue
              </button>
            )}

            {view === 'mine' && issue.status !== 'Resolved' && (
              <>
                <button
                  onClick={() => handleResolveClick(issue._id)}
                  className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                    resolvingIssue === issue._id
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-yellow-600 text-white hover:bg-yellow-700'
                  }`}
                >
                  {resolvingIssue === issue._id
                    ? 'Submit Resolution'
                    : 'Mark as Resolved'}
                </button>

                {resolvingIssue === issue._id && (
                  <button
                    onClick={() => {
                      setResolvingIssue(null);
                      setRemark('');
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
