import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { NubanState, NubanAccount, GenerateNubanRequest, ValidateNubanRequest, NubanFilters } from '../types/nuban.types'
import { nubanApi } from '../api/nubanApi'

const initialState: NubanState = {
  loading: false,
  error: null,
  lastFetch: null,
  
  accounts: [],
  banks: [],
  currentAccount: null,
  
  generationHistory: [],
  lastGenerated: null,
  isGenerating: false,
  
  validationResults: {},
  isValidating: false,
  
  filters: {},
  searchResults: [],
  
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  },
  
  selectedAccounts: [],
  sortBy: 'createdAt',
  sortOrder: 'desc',
  isLoading: false,
}

export const generateNubanAsync = createAsyncThunk(
  'nuban/generate',
  async (request: GenerateNubanRequest, { rejectWithValue }) => {
    try {
      return await nubanApi.generateAccount(request)
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Generation failed')
    }
  }
)

export const validateNubanAsync = createAsyncThunk(
  'nuban/validate',
  async (request: ValidateNubanRequest, { rejectWithValue }) => {
    try {
      return await nubanApi.validateAccount(request)
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Validation failed')
    }
  }
)

export const fetchAccountsAsync = createAsyncThunk(
  'nuban/fetchAccounts',
  async (params: { page?: number; pageSize?: number; filters?: NubanFilters }, { rejectWithValue }) => {
    try {
      return await nubanApi.getAccounts(params)
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Fetch failed')
    }
  }
)

export const fetchBanksAsync = createAsyncThunk(
  'nuban/fetchBanks',
  async (_, { rejectWithValue }) => {
    try {
      return await nubanApi.getBanks()
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch banks')
    }
  }
)

const nubanSlice = createSlice({
  name: 'nuban',
  initialState,
  reducers: {
    setCurrentAccount: (state, action: PayloadAction<NubanAccount | null>) => {
      state.currentAccount = action.payload
    },
    
    setFilters: (state, action: PayloadAction<Partial<NubanFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    
    clearFilters: (state) => {
      state.filters = {}
      state.searchResults = []
    },
    
    setSorting: (state, action: PayloadAction<{ sortBy: NubanState['sortBy']; sortOrder: NubanState['sortOrder'] }>) => {
      state.sortBy = action.payload.sortBy
      state.sortOrder = action.payload.sortOrder
    },
    
    setSelectedAccounts: (state, action: PayloadAction<string[]>) => {
      state.selectedAccounts = action.payload
    },
    
    toggleAccountSelection: (state, action: PayloadAction<string>) => {
      const accountId = action.payload
      const index = state.selectedAccounts.indexOf(accountId)
      if (index > -1) {
        state.selectedAccounts.splice(index, 1)
      } else {
        state.selectedAccounts.push(accountId)
      }
    },
    
    clearSelectedAccounts: (state) => {
      state.selectedAccounts = []
    },
    
    setPagination: (state, action: PayloadAction<Partial<NubanState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    
    addAccount: (state, action: PayloadAction<NubanAccount>) => {
      if (!state.accounts) state.accounts = []
      if (!state.generationHistory) state.generationHistory = []
      
      state.accounts.unshift(action.payload)
      state.generationHistory.unshift(action.payload)
      state.lastGenerated = action.payload
    },
    
    updateAccount: (state, action: PayloadAction<{ id: string; updates: Partial<NubanAccount> }>) => {
      const { id, updates } = action.payload
      if (!state.accounts) state.accounts = []
      
      const index = state.accounts.findIndex(account => account.id === id)
      if (index > -1) {
        state.accounts[index] = { ...state.accounts[index], ...updates }
      }
    },
    
    removeAccount: (state, action: PayloadAction<string>) => {
      if (!state.accounts) state.accounts = []
      if (!state.selectedAccounts) state.selectedAccounts = []
      
      state.accounts = state.accounts.filter(account => account.id !== action.payload)
      state.selectedAccounts = state.selectedAccounts.filter(id => id !== action.payload)
    },
    
    clearError: (state) => {
      state.error = null
    },
    
    resetState: () => initialState,
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(generateNubanAsync.pending, (state) => {
        state.loading = true
        state.isGenerating = true
        state.error = null
      })
      .addCase(generateNubanAsync.fulfilled, (state, action) => {
        state.loading = false
        state.isGenerating = false
        
        if (!state.accounts) state.accounts = []
        if (!state.generationHistory) state.generationHistory = []
        
        state.accounts.unshift(action.payload)
        state.generationHistory.unshift(action.payload)
        state.lastGenerated = action.payload
        state.lastFetch = new Date().toISOString()
      })
      .addCase(generateNubanAsync.rejected, (state, action) => {
        state.loading = false
        state.isGenerating = false
        state.error = action.payload as string
      })
    
    builder
      .addCase(validateNubanAsync.pending, (state) => {
        state.loading = true
        state.isValidating = true
        state.error = null
      })
      .addCase(validateNubanAsync.fulfilled, (state, action) => {
        state.loading = false
        state.isValidating = false
        const { accountNumber, bankCode } = action.meta.arg
        const key = `${accountNumber}-${bankCode}`
        
        if (!state.validationResults) state.validationResults = {}
        
        state.validationResults[key] = action.payload
        state.lastFetch = new Date().toISOString()
      })
      .addCase(validateNubanAsync.rejected, (state, action) => {
        state.loading = false
        state.isValidating = false
        state.error = action.payload as string
      })
    
    builder
      .addCase(fetchAccountsAsync.pending, (state) => {
        state.loading = true
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAccountsAsync.fulfilled, (state, action) => {
        state.loading = false
        state.isLoading = false
        state.accounts = action.payload.data || []
        state.pagination = {
          currentPage: action.payload.currentPage,
          pageSize: action.payload.pageSize,
          totalCount: action.payload.totalCount,
          totalPages: action.payload.totalPages,
        }
        state.lastFetch = new Date().toISOString()
      })
      .addCase(fetchAccountsAsync.rejected, (state, action) => {
        state.loading = false
        state.isLoading = false
        state.error = action.payload as string
      })
    
    builder
      .addCase(fetchBanksAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBanksAsync.fulfilled, (state, action) => {
        state.loading = false
        state.banks = action.payload || []
        state.lastFetch = new Date().toISOString()
      })
      .addCase(fetchBanksAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const {
  setCurrentAccount,
  setFilters,
  clearFilters,
  setSorting,
  setSelectedAccounts,
  toggleAccountSelection,
  clearSelectedAccounts,
  setPagination,
  addAccount,
  updateAccount,
  removeAccount,
  clearError,
  resetState,
} = nubanSlice.actions

export default nubanSlice.reducer

export const selectNubanState = (state: { nuban: NubanState }) => state.nuban
export const selectAccounts = (state: { nuban: NubanState }) => state.nuban.accounts || []
export const selectLastGenerated = (state: { nuban: NubanState }) => state.nuban.lastGenerated
export const selectLoading = (state: { nuban: NubanState }) => state.nuban.loading
export const selectIsGenerating = (state: { nuban: NubanState }) => state.nuban.isGenerating
export const selectIsValidating = (state: { nuban: NubanState }) => state.nuban.isValidating
export const selectIsLoading = (state: { nuban: NubanState }) => state.nuban.isLoading
export const selectError = (state: { nuban: NubanState }) => state.nuban.error
export const selectBanks = (state: { nuban: NubanState }) => state.nuban.banks || []
export const selectCurrentAccount = (state: { nuban: NubanState }) => state.nuban.currentAccount
export const selectGenerationHistory = (state: { nuban: NubanState }) => state.nuban.generationHistory || []
export const selectValidationResults = (state: { nuban: NubanState }) => state.nuban.validationResults || {}
export const selectPagination = (state: { nuban: NubanState }) => state.nuban.pagination
export const selectSelectedAccounts = (state: { nuban: NubanState }) => state.nuban.selectedAccounts || []