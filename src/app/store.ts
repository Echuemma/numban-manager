import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import rootReducer from './rootReducer';
import { customMiddleware } from './middleware';
import { persistenceMiddleware } from './middleware/persistenceMiddleware';
import { StorageService } from '../shared/services/storageService';

const storage = StorageService.getInstance();

function loadPersistedState() {
  try {
    const persistedState = storage.getItem('app_state');
    if (persistedState && typeof persistedState === 'object') {
      console.log('Rehydrating state from storage');
      
      const validatedState: any = {};
      
      if (persistedState.nuban) {
        validatedState.nuban = {
          generated: Array.isArray(persistedState.nuban.generated) ? persistedState.nuban.generated : [],
          history: Array.isArray(persistedState.nuban.history) ? persistedState.nuban.history : [],
          currentBank: persistedState.nuban.currentBank || null,
          isLoading: false,
          error: null
        };
      }
      
      if (persistedState.validation) {
        validatedState.validation = {
          history: Array.isArray(persistedState.validation.history) ? persistedState.validation.history : [],
          stats: persistedState.validation.stats || {},
          isValidating: false,
          error: null
        };
      }
      
      if (persistedState.filters) {
        validatedState.filters = persistedState.filters;
      }
      
      if (persistedState.ui) {
        validatedState.ui = {
          theme: persistedState.ui.theme || 'light',
          preferences: persistedState.ui.preferences || {}
        };
      }
      
      return { preloadedState: validatedState };
    }
  } catch (error) {
    console.warn('Failed to load persisted state:', error);
  }
  return {};
}

const { preloadedState } = loadPersistedState();

export const store = configureStore({
  
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['register'],
      },
    })
    .concat(customMiddleware)
    .concat(persistenceMiddleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;