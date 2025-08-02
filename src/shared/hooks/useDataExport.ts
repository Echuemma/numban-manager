 // src/shared/hooks/useDataExport.ts

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { StorageService } from '../services/storageService';

const storage = StorageService.getInstance();

export const useDataExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const nubanHistory = useSelector((state: RootState) => state.nuban.history);
  const validationHistory = useSelector((state: RootState) => state.validation.history);

  const exportToFile = async (format: 'json' | 'csv' = 'json') => {
    setIsExporting(true);
    try {
      let data: string;
      let filename: string;
      let mimeType: string;

      if (format === 'json') {
        data = storage.exportData();
        filename = `nuban-export-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      } else {
        data = convertToCSV();
        filename = `nuban-export-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      }

      const blob = new Blob([data], { type: mimeType });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return { success: true, message: `Data exported as ${filename}` };
    } catch (error) {
      return { success: false, message: `Export failed: ${(error as Error).message}` };
    } finally {
      setIsExporting(false);
    }
  };

  const importFromFile = async (file: File): Promise<{ success: boolean; message: string }> => {
    setIsImporting(true);
    try {
      const text = await file.text();
      const result = storage.importData(text);
      
      if (result.success) {
        // Trigger page reload to load imported data
        setTimeout(() => window.location.reload(), 1000);
      }
      
      return result;
    } catch (error) {
      return { success: false, message: `Import failed: ${(error as Error).message}` };
    } finally {
      setIsImporting(false);
    }
  };

  const convertToCSV = (): string => {
    const headers = ['NUBAN', 'Bank Code', 'Bank Name', 'Serial Number', 'Check Digit', 'Generated At', 'Status'];
    
    const rows = nubanHistory.map((nuban: { accountNumber: any; bankCode: any; bankName: any; serialNumber: any; checkDigit: any; generatedAt: string | number | Date; }) => [
      nuban.accountNumber,
      nuban.bankCode,
      nuban.bankName,
      nuban.serialNumber,
      nuban.checkDigit,
      new Date(nuban.generatedAt).toLocaleString(),
      'Generated'
    ]);

    validationHistory.forEach((validation: { nuban: any; bankCode: any; bankName: any; validatedAt: string | number | Date; isValid: any; }) => {
      rows.push([
        validation.nuban,
        validation.bankCode || 'N/A',
        validation.bankName || 'N/A',
        'N/A',
        'N/A',
        new Date(validation.validatedAt).toLocaleString(),
        validation.isValid ? 'Valid' : 'Invalid'
      ]);
    });

    return [headers, ...rows].map(row => 
      row.map((field: any) => `"${field}"`).join(',')
    ).join('\n');
  };

  const clearAllData = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const success = storage.clear();
      if (success) {
        setTimeout(() => window.location.reload(), 500);
        return { success: true, message: 'All data cleared successfully' };
      }
      return { success: false, message: 'Failed to clear data' };
    } catch (error) {
      return { success: false, message: `Clear failed: ${(error as Error).message}` };
    }
  };

  const getStorageStats = () => {
    const info = storage.getStorageInfo();
    const usedMB = (info.usedSpace / (1024 * 1024)).toFixed(2);
    const totalMB = (info.totalSpace / (1024 * 1024)).toFixed(2);
    const percentUsed = ((info.usedSpace / info.totalSpace) * 100).toFixed(1);

    return {
      ...info,
      usedMB,
      totalMB,
      percentUsed,
      nubanCount: nubanHistory.length,
      validationCount: validationHistory.length
    };
  };

  return {
    exportToFile,
    importFromFile,
    clearAllData,
    getStorageStats,
    isExporting,
    isImporting
  };
};
