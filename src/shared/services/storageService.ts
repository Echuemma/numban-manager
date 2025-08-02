 // src/shared/services/storageService.ts

export interface StorageConfig {
  key: string;
  version: number;
  encrypt?: boolean;
}

export class StorageService {
  private static instance: StorageService;
  private storageKeys = {
    APP_STATE: 'nuban_app_state',
    USER_PREFERENCES: 'nuban_user_prefs',
    EXPORT_DATA: 'nuban_export_data'
  };

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Generic storage methods with error handling
  setItem<T>(key: string, value: T, config?: StorageConfig): boolean {
    try {
      const dataToStore = {
        data: value,
        version: config?.version || 1,
        timestamp: new Date().toISOString(),
        checksum: this.generateChecksum(value)
      };

      const serialized = JSON.stringify(dataToStore);
      
      // For Claude.ai environment, use in-memory storage
      if (typeof window !== 'undefined' && !window.localStorage) {
        // Fallback to in-memory storage if localStorage is not available
        if (!(window as any).__memoryStorage) {
          (window as any).__memoryStorage = new Map();
        }
        (window as any).__memoryStorage.set(key, serialized);
        return true;
      }

      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Failed to store data for key ${key}:`, error);
      return false;
    }
  }

  getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      let stored: string | null = null;

      // Check in-memory storage first (for Claude.ai environment)
      if (typeof window !== 'undefined' && (window as any).__memoryStorage) {
        stored = (window as any).__memoryStorage.get(key) || null;
      } else if (typeof window !== 'undefined' && window.localStorage) {
        stored = localStorage.getItem(key);
      }

      if (!stored) return defaultValue || null;

      const parsed = JSON.parse(stored);
      
      // Verify data integrity
      if (this.generateChecksum(parsed.data) !== parsed.checksum) {
        console.warn(`Data corruption detected for key ${key}`);
        this.removeItem(key);
        return defaultValue || null;
      }

      return parsed.data as T;
    } catch (error) {
      console.error(`Failed to retrieve data for key ${key}:`, error);
      return defaultValue || null;
    }
  }

  removeItem(key: string): boolean {
    try {
      // Remove from in-memory storage
      if (typeof window !== 'undefined' && (window as any).__memoryStorage) {
        (window as any).__memoryStorage.delete(key);
      }
      
      // Remove from localStorage if available
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
      }
      
      return true;
    } catch (error) {
      console.error(`Failed to remove item ${key}:`, error);
      return false;
    }
  }

  clear(): boolean {
    try {
      // Clear in-memory storage
      if (typeof window !== 'undefined' && (window as any).__memoryStorage) {
        Object.values(this.storageKeys).forEach(key => {
          (window as any).__memoryStorage.delete(key);
        });
      }

      // Clear localStorage if available
      if (typeof window !== 'undefined' && window.localStorage) {
        Object.values(this.storageKeys).forEach(key => {
          localStorage.removeItem(key);
        });
      }
      
      return true;
    } catch (error) {
      console.error('Failed to clear storage:', error);
      return false;
    }
  }

  // Check storage availability and quota
  getStorageInfo(): { available: boolean; usedSpace: number; totalSpace: number } {
    try {
      const testKey = '__storage_test__';
      
      // Test in-memory storage first
      if (typeof window !== 'undefined' && (window as any).__memoryStorage) {
        return {
          available: true,
          usedSpace: (window as any).__memoryStorage.size * 1000, // Rough estimate
          totalSpace: 50 * 1024 * 1024 // 50MB for memory
        };
      }

      // Test localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);

        let usedSpace = 0;
        for (let key in localStorage) {
          if (localStorage.hasOwnProperty(key)) {
            usedSpace += localStorage[key].length + key.length;
          }
        }

        return {
          available: true,
          usedSpace,
          totalSpace: 5 * 1024 * 1024 // 5MB typical limit
        };
      }

      return { available: false, usedSpace: 0, totalSpace: 0 };
    } catch {
      return { available: false, usedSpace: 0, totalSpace: 0 };
    }
  }

  private generateChecksum<T>(data: T): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  // Export functionality
  exportData(): string {
    const exportData = {
      nubanHistory: this.getItem('nuban_history', []),
      validationHistory: this.getItem('validation_history', []),
      userPreferences: this.getItem('user_preferences', {}),
      exportTimestamp: new Date().toISOString(),
      version: '1.0.0'
    };

    return JSON.stringify(exportData, null, 2);
  }

  importData(jsonData: string): { success: boolean; message: string } {
    try {
      const importData = JSON.parse(jsonData);
      
      // Validate import data structure
      if (!this.validateImportData(importData)) {
        return { success: false, message: 'Invalid data format' };
      }

      // Store imported data
      if (importData.nubanHistory) {
        this.setItem('nuban_history', importData.nubanHistory);
      }
      if (importData.validationHistory) {
        this.setItem('validation_history', importData.validationHistory);
      }
      if (importData.userPreferences) {
        this.setItem('user_preferences', importData.userPreferences);
      }

      return { success: true, message: 'Data imported successfully' };
    } catch (error) {
      return { success: false, message: `Import failed: ${(error as Error).message}` };
    }
  }

  private validateImportData(data: any): boolean {
    return data && 
           typeof data === 'object' && 
           data.version && 
           data.exportTimestamp;
  }
}
