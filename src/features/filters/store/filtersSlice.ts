import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface FiltersState {
  activeFilters: {
    bankCode?: string
    accountType?: 'savings' | 'current' | 'fixed'
    minBalance?: number
    maxBalance?: number
    searchTerm?: string
    dateRange?: {
      from: string
      to: string
    }
  }
  savedFilters: Array<{
    id: string
    name: string
    filters: FiltersState['activeFilters']
    createdAt: string
  }>
  quickFilters: {
    showActiveOnly: boolean
    showRecentOnly: boolean
    showHighBalanceOnly: boolean
  }
}

const initialState: FiltersState = {
  activeFilters: {},
  savedFilters: [],
  quickFilters: {
    showActiveOnly: true,
    showRecentOnly: false,
    showHighBalanceOnly: false
  }
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setActiveFilters: (state, action: PayloadAction<Partial<FiltersState['activeFilters']>>) => {
      state.activeFilters = { ...state.activeFilters, ...action.payload }
    },
    
    clearActiveFilters: (state) => {
      state.activeFilters = {}
    },
    
    setQuickFilter: (state, action: PayloadAction<{
      key: keyof FiltersState['quickFilters']
      value: boolean
    }>) => {
      state.quickFilters[action.payload.key] = action.payload.value
    },
    
    saveCurrentFilters: (state, action: PayloadAction<string>) => {
      const filterSet = {
        id: Date.now().toString(),
        name: action.payload,
        filters: state.activeFilters,
        createdAt: new Date().toISOString()
      }
      state.savedFilters.push(filterSet)
    },
    
    applySavedFilters: (state, action: PayloadAction<string>) => {
      const saved = state.savedFilters.find(f => f.id === action.payload)
      if (saved) {
        state.activeFilters = saved.filters
      }
    },
    
    deleteSavedFilters: (state, action: PayloadAction<string>) => {
      state.savedFilters = state.savedFilters.filter(f => f.id !== action.payload)
    }
  }
})

export const {
  setActiveFilters,
  clearActiveFilters,
  setQuickFilter,
  saveCurrentFilters,
  applySavedFilters,
  deleteSavedFilters
} = filtersSlice.actions

export default filtersSlice.reducer
