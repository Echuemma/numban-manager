 // src/shared/types/api.types.ts
export interface BaseApiState {
  loading: boolean
  error: string | null
  lastFetch: string | null
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  currentPage: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export interface ApiError {
  message: string
  code?: string
  field?: string
}

// src/shared/types/global.types.ts
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface TableColumn<T = any> {
  key: keyof T
  label: string
  sortable?: boolean
  width?: string
  render?: (value: any, row: T) => React.ReactNode
}

export interface FilterOption {
  key: string
  label: string
  type: 'text' | 'select' | 'date' | 'number' | 'boolean'
  options?: SelectOption[]
  placeholder?: string
}

export type SortOrder = 'asc' | 'desc'

export interface SortConfig<T = any> {
  key: keyof T
  direction: SortOrder
}

// src/shared/types/nuban.types.ts (Global NUBAN types)
export interface BankInfo {
  code: string
  name: string
  sortCode: string
}

export const NIGERIAN_BANKS: Record<string, BankInfo> = {
  '044': { code: '044', name: 'Access Bank', sortCode: '044150149' },
  '058': { code: '058', name: 'Guaranty Trust Bank', sortCode: '058152052' },
  '057': { code: '057', name: 'Zenith Bank', sortCode: '057150013' },
  '011': { code: '011', name: 'First Bank of Nigeria', sortCode: '011151003' },
  '033': { code: '033', name: 'United Bank for Africa', sortCode: '033153513' },
  '070': { code: '070', name: 'Fidelity Bank', sortCode: '070150003' },
  '232': { code: '232', name: 'Sterling Bank', sortCode: '232150016' },
  '032': { code: '032', name: 'Union Bank of Nigeria', sortCode: '032080474' },
  '050': { code: '050', name: 'Ecobank Nigeria', sortCode: '050150010' },
  '221': { code: '221', name: 'Stanbic IBTC Bank', sortCode: '221159522' },
}

export const ACCOUNT_TYPES = {
  SAVINGS: 'savings',
  CURRENT: 'current', 
  FIXED: 'fixed'
} as const

export type AccountType = typeof ACCOUNT_TYPES[keyof typeof ACCOUNT_TYPES]
