// src/app/middleware/persistenceMiddleware.ts

import { Middleware, UnknownAction } from '@reduxjs/toolkit';
import { StorageService } from '../../shared/services/storageService';

const storage = StorageService.getInstance();

// Define which slices to persist
const PERSISTABLE_SLICES = ['nuban', 'validation', 'filters', 'ui'] as const;

export const persistenceMiddleware: Middleware = 
  (store) => (next) => (action: UnknownAction) => {
    const result = next(action);
    
    // Don't persist during hydration
    if (action.type.includes('@@redux/INIT') || action.type.includes('persist/REHYDRATE')) {
      return result;
    }

    // Only persist actions from specific slices
    const shouldPersist = PERSISTABLE_SLICES.some(slice => 
      action.type.startsWith(`${slice}/`)
    );

    if (shouldPersist) {
      const state = store.getState();
      
      // Persist only serializable state - using correct property names from your slice
      const persistableState = {
        nuban: {
          accounts: state.nuban?.accounts || [],
          generationHistory: state.nuban?.generationHistory || [],
          currentAccount: state.nuban?.currentAccount || null,
          banks: state.nuban?.banks || []
        },
        validation: {
          history: state.validation?.history || [],
          stats: state.validation?.stats || {}
        },
        filters: state.filters || {},
        ui: {
          theme: state.ui?.theme || 'light',
          preferences: state.ui?.preferences || {}
        },
        lastUpdated: new Date().toISOString()
      };

      // Debounce storage writes
      if (typeof window !== 'undefined') {
        clearTimeout((window as any).__persistTimeout);
        (window as any).__persistTimeout = setTimeout(() => {
          // Fix: Provide complete StorageConfig with required 'key' property
          storage.setItem('app_state', persistableState, { 
            key: 'app_state',
            version: 1 
          });
        }, 500);
      }
    }

    return result;
  };