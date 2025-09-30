import { AlertCircle, Calendar, BookOpen, GraduationCap, Users, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Issue } from '@/lib/types';

interface IssueListProps {
  issues: Issue[];
}

export default function IssueList({ issues }: IssueListProps) {
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

  if (issues.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
        <p className="text-gray-600">No issues found</p>
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Assigned to:{' '}
                <span className="font-medium text-gray-900">
                  {issue.assignedFaculty.name}
                </span>
              </p>
            </div>
          )}

          {issue.remark && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Remark: <span className="text-gray-900">{issue.remark}</span>
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
