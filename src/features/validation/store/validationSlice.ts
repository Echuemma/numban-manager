 import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationState, ValidationRecord } from '../types/validation.types';

const initialState: ValidationState = {
  history: [],
  isValidating: false,
  error: null,
  stats: {
    totalValidations: 0,
    validCount: 0,
    invalidCount: 0,
    lastValidatedAt: null
  }
};

const validationSlice = createSlice({
  name: 'validation',
  initialState,
  reducers: {
    validateStart: (state) => {
      state.isValidating = true;
      state.error = null;
    },
    
    validateSuccess: (state, action: PayloadAction<ValidationRecord>) => {
      state.isValidating = false;
      state.history.unshift(action.payload);
      
      // Update stats
      state.stats.totalValidations += 1;
      if (action.payload.isValid) {
        state.stats.validCount += 1;
      } else {
        state.stats.invalidCount += 1;
      }
      state.stats.lastValidatedAt = action.payload.validatedAt;
      
      // Keep only last 1000 validations for performance
      if (state.history.length > 1000) {
        state.history = state.history.slice(0, 1000);
      }
    },
    
    validateFailure: (state, action: PayloadAction<string>) => {
      state.isValidating = false;
      state.error = action.payload;
    },
    
    removeValidation: (state, action: PayloadAction<string>) => {
      const index = state.history.findIndex(v => v.id === action.payload);
      if (index !== -1) {
        const validation = state.history[index];
        state.history.splice(index, 1);
        
        // Update stats
        state.stats.totalValidations -= 1;
        if (validation.isValid) {
          state.stats.validCount -= 1;
        } else {
          state.stats.invalidCount -= 1;
        }
      }
    },
    
    clearHistory: (state) => {
      state.history = [];
      state.stats = {
        totalValidations: 0,
        validCount: 0,
        invalidCount: 0,
        lastValidatedAt: null
      };
    },
    
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  validateStart,
  validateSuccess,
  validateFailure,
  removeValidation,
  clearHistory,
  clearError
} = validationSlice.actions;

export default validationSlice.reducer;

