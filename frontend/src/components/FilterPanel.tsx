import { IssueFilters } from '@/lib/types';

interface FilterPanelProps {
  filters: IssueFilters;
  setFilters: (filters: IssueFilters) => void;
}

export default function FilterPanel({ filters, setFilters }: FilterPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            value={filters.gender}
            onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
            className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
            onChange={(e) => setFilters({ ...filters, school: e.target.value })}
            className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
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
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
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
            className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="Indian">Indian</option>
            <option value="International">NRI</option>
            <option value="International">Foreign</option>
          </select>
        </div>
      </div>

      <button
        onClick={() =>
          setFilters({ gender: '', school: '', status: '', category: '' })
        }
        className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        Clear All Filters
      </button>
    </div>
  );
}