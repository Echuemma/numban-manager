import React, { useRef, useState } from 'react';
// Fix: Remove unused Upload import
import { Download, Trash2, Database, AlertTriangle } from 'lucide-react';
import { useDataExport } from '../../../shared/hooks/useDataExport';
import { Button } from '../../../shared/components/ui/Button';
import { Card } from '../../../shared/components/ui/Card';

export const DataManagement: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const {
    exportToFile,
    importFromFile,
    clearAllData,
    getStorageStats,
    isExporting,
    isImporting
  } = useDataExport();

  const stats = getStorageStats();

  const handleExport = async (format: 'json' | 'csv') => {
    const result = await exportToFile(format);
    setNotification({
      type: result.success ? 'success' : 'error',
      message: result.message
    });
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = await importFromFile(file);
    setNotification({
      type: result.success ? 'success' : 'error',
      message: result.message
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearData = async () => {
    const result = await clearAllData();
    setNotification({
      type: result.success ? 'success' : 'error',
      message: result.message
    });
    setShowClearConfirm(false);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Database className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Data Management</h2>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-medium mb-3">Storage Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">NUBANs Generated</div>
            <div className="font-semibold text-lg">{stats.nubanCount}</div>
          </div>
          <div>
            <div className="text-gray-600">Validations</div>
            <div className="font-semibold text-lg">{stats.validationCount}</div>
          </div>
          <div>
            <div className="text-gray-600">Storage Used</div>
            <div className="font-semibold text-lg">{stats.usedMB} MB</div>
          </div>
          <div>
            <div className="text-gray-600">Usage</div>
            <div className="font-semibold text-lg">{stats.percentUsed}%</div>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                parseFloat(stats.percentUsed) > 80 ? 'bg-red-500' : 
                parseFloat(stats.percentUsed) > 60 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(parseFloat(stats.percentUsed), 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-3">Export Data</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => handleExport('json')}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-3">Import Data</h3>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          disabled={isImporting}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <p className="text-xs text-gray-500 mt-1">
          Select a JSON file exported from this application
        </p>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-medium mb-3 text-red-600">Danger Zone</h3>
        {!showClearConfirm ? (
          <Button
            variant="outline"
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            Clear All Data
          </Button>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-red-800 mb-1">Are you sure?</h4>
                <p className="text-sm text-red-700 mb-3">
                  This will permanently delete all your NUBAN history, validation records, and preferences. This action cannot be undone.
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={handleClearData}
                  >
                    Yes, Clear All Data
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowClearConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notification */}
      {notification && (
        <div className={`mt-4 p-3 rounded-lg ${
          notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
          'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {notification.message}
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </Card>
  );
};