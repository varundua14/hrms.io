import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { TableColumn, SortConfig, FilterOption } from '../../types';

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyField: string;
  title?: string;
  filterOptions?: {
    field: string;
    options: FilterOption[];
  }[];
  searchable?: boolean;
  searchFields?: string[];
  onRowClick?: (item: T) => void;
  actions?: React.ReactNode;
}

function DataTable<T>({
  data,
  columns,
  keyField,
  title,
  filterOptions = [],
  searchable = true,
  searchFields = [],
  onRowClick,
  actions,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const processedData = useMemo(() => {
    let result = [...data];

    if (Object.keys(filters).length > 0) {
      result = result.filter((item) => {
        return Object.entries(filters).every(([field, value]) => {
          if (!value) return true;
          const itemValue = (item as any)[field];
          return value === 'all' || itemValue === value;
        });
      });
    }

    if (searchQuery && searchFields.length > 0) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter((item) => {
        return searchFields.some((field) => {
          const fieldValue = String((item as any)[field] || '').toLowerCase();
          return fieldValue.includes(lowerCaseQuery);
        });
      });
    }

    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = (a as any)[sortConfig.key];
        const bValue = (b as any)[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [data, filters, sortConfig, searchQuery, searchFields]);

  const renderSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4 inline-block ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline-block ml-1" />
    );
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          {title && <h2 className="text-xl font-semibold text-gray-800">{title}</h2>}
          
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            {searchable && (
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
            {actions}
          </div>
        </div>

        {filterOptions.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {filterOptions.map((filterOption) => (
              <select
                key={filterOption.field}
                value={filters[filterOption.field] || ''}
                onChange={(e) => handleFilterChange(filterOption.field, e.target.value)}
                className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">All {filterOption.field}</option>
                {filterOption.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ))}
            {Object.keys(filters).length > 0 && (
              <button
                onClick={resetFilters}
                className="text-sm text-gray-600 hover:text-gray-900 hover:underline focus:outline-none"
              >
                Reset filters
              </button>
            )}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  onClick={() => column.sortable && handleSort(column.key)}
                  style={{ cursor: column.sortable ? 'pointer' : 'default' }}
                  className="text-left whitespace-nowrap"
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processedData.length > 0 ? (
              processedData.map((item, index) => (
                <tr
                  key={(item as any)[keyField]}
                  onClick={() => onRowClick && onRowClick(item)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  {columns.map((column) => (
                    <td
                      key={`${(item as any)[keyField]}-${column.key}`}
                      className="whitespace-nowrap"
                    >
                      {column.render ? column.render(item, index) : (item as any)[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center text-gray-500 bg-gray-50"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;