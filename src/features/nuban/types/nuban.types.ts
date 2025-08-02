 // src/features/nuban/types/nuban.types.ts
import { BaseApiState } from '@/shared/types/api.types'

export interface Bank {
  id: string
  name: string
  code: string
  sortCode: string
  isActive: boolean
}

export interface NubanAccount {
  id: string
  accountNumber: string
  accountName: string
  bankCode: string
  bankName: string
  sortCode: string
  bvn?: string
  phoneNumber?: string
  email?: string
  accountType: 'savings' | 'current' | 'fixed'
  balance: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface GenerateNubanRequest {
  bankCode: string
  accountName: string
  accountType: 'savings' | 'current' | 'fixed'
  initialBalance?: number
  bvn?: string
  phoneNumber?: string
  email?: string
}

export interface ValidateNubanRequest {
  accountNumber: string
  bankCode: string
}

export interface NubanValidationResult {
  isValid: boolean
  accountName?: string
  bankName?: string
  errors?: string[]
}

export interface NubanFilters {
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

export interface NubanState extends BaseApiState {
  isLoading: any
  isGenerating: any
  isValidating: any
  // Data
  accounts: NubanAccount[]
  banks: Bank[]
  currentAccount: NubanAccount | null
  
  // Generation state
  generationHistory: NubanAccount[]
  lastGenerated: NubanAccount | null
  
  // Validation state
  validationResults: Record<string, NubanValidationResult>
  
  // Filters and search
  filters: NubanFilters
  searchResults: NubanAccount[]
  
  // Pagination
  pagination: {
    currentPage: number
    pageSize: number
    totalCount: number
    totalPages: number
  }
  
  // UI state
  selectedAccounts: string[]
  sortBy: 'accountNumber' | 'accountName' | 'bankName' | 'createdAt' | 'balance'
  sortOrder: 'asc' | 'desc'
}
