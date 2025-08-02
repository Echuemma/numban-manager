import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../app/store';
import { clearHistory, removeValidation } from '../store/validationSlice';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import {
  History,
  CheckCircle,
  XCircle,
  Search,
  Trash2,
  Download,
  Calendar,
  Clock,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';

export const ValidationHistory: React.FC = () => {
  const dispatch = useDispatch();
  const { history, stats } = useSelector((state: RootState) => state.validation);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'valid' | 'invalid'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'nuban' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort history
  const filteredHistory = history
    .filter((item: { nuban: string; bankName: string; isValid: any; }) => {
      const matchesSearch = item.nuban.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.bankName && item.bankName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filterStatus === 'all' ||
        (filterStatus === 'valid' && item.isValid) ||
        (filterStatus === 'invalid' && !item.isValid);
      return matchesSearch && matchesFilter;
    })
    .sort((a: { validatedAt: string | number | Date; nuban: string; isValid: any; }, b: { validatedAt: string | number | Date; nuban: any; isValid: any; }) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.validatedAt).getTime() - new Date(b.validatedAt).getTime();
          break;
        case 'nuban':
          comparison = a.nuban.localeCompare(b.nuban);
          break;
        case 'status':
          comparison = (a.isValid ? 1 : 0) - (b.isValid ? 1 : 0);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all validation history? This action cannot be undone.')) {
      dispatch(clearHistory());
    }
  };

  const handleRemoveValidation = (id: string) => {
    dispatch(removeValidation(id));
  };

  const exportHistoryToCSV = () => {
    const headers = ['NUBAN', 'Bank Code', 'Bank Name', 'Valid', 'Reason', 'Validated At'];
    const rows = filteredHistory.map((item: { nuban: any; bankCode: any; bankName: any; isValid: any; reason: any; validatedAt: string | number | Date; }) => [
      item.nuban,
      item.bankCode || 'N/A',
      item.bankName || 'N/A',
      item.isValid ? 'Yes' : 'No',
      item.reason || 'N/A',
      format(new Date(item.validatedAt), 'yyyy-MM-dd HH:mm:ss')
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map((field: any) => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `validation-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (history.length === 0) {
    return (
      <Card className="p-8 text-center">
        <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Validation History</h3>
        <p className="text-gray-500 mb-4">
          Validate some NUBAN numbers to see your history here.
        </p>
        <Button
          onClick={() => window.location.hash = '#generator'}
          className="inline-flex items-center gap-2"
        >
          <History className="w-4 h-4" />
          Go to Generator
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Validations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalValidations}</p>
            </div>
            <History className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valid NUBANs</p>
              <p className="text-2xl font-bold text-green-600">{stats.validCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Invalid NUBANs</p>
              <p className="text-2xl font-bold text-red-600">{stats.invalidCount}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.totalValidations > 0 ? Math.round((stats.validCount / stats.totalValidations) * 100) : 0}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search NUBAN or bank..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'valid' | 'invalid')}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="valid">Valid Only</option>
              <option value="invalid">Invalid Only</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split('-');
                setSortBy(by as 'date' | 'nuban' | 'status');
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="nuban-asc">NUBAN A-Z</option>
              <option value="nuban-desc">NUBAN Z-A</option>
              <option value="status-desc">Valid First</option>
              <option value="status-asc">Invalid First</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportHistoryToCSV}
              disabled={filteredHistory.length === 0}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearHistory}
              disabled={history.length === 0}
              className="flex items-center gap-2 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredHistory.length} of {history.length} validations
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NUBAN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Validated At
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHistory.map((validation: { id: string; nuban: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; bankName: any; bankCode: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; isValid: any; reason: any; validatedAt: string | number | Date; }) => (
                <tr key={validation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono font-medium text-gray-900">
                      {validation.nuban}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">{validation.bankName || 'Unknown Bank'}</div>
                      {validation.bankCode && (
                        <div className="text-gray-500 text-xs">{validation.bankCode}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${validation.isValid
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {validation.isValid ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {validation.isValid ? 'Valid' : 'Invalid'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {validation.reason || 'No reason provided'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(validation.validatedAt), 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Clock className="w-3 h-3" />
                      {format(new Date(validation.validatedAt), 'HH:mm:ss')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveValidation(validation.id)}
                      className="text-red-600 hover:bg-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filters.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};