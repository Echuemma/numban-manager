// src/shared/utils/constants.ts
export const NIGERIAN_BANKS = {
  '044': {
    name: 'Access Bank',
    shortName: 'Access Bank',
    code: '044'
  },
  '014': {
    name: 'Afribank Nigeria Plc',
    shortName: 'Afribank',
    code: '014'
  },
  '023': {
    name: 'Citibank Nigeria Limited',
    shortName: 'Citibank',
    code: '023'
  },
  '063': {
    name: 'Diamond Bank Plc',
    shortName: 'Diamond Bank',
    code: '063'
  },
  '050': {
    name: 'Ecobank Nigeria Plc',
    shortName: 'Ecobank',
    code: '050'
  },
  '084': {
    name: 'Enterprise Bank Limited',
    shortName: 'Enterprise Bank',
    code: '084'
  },
  '070': {
    name: 'Fidelity Bank Plc',
    shortName: 'Fidelity Bank',
    code: '070'
  },
  '011': {
    name: 'First Bank of Nigeria Limited',
    shortName: 'First Bank',
    code: '011'
  },
  '214': {
    name: 'First City Monument Bank Plc',
    shortName: 'FCMB',
    code: '214'
  },
  '058': {
    name: 'Guaranty Trust Bank Plc',
    shortName: 'GTBank',
    code: '058'
  },
  '030': {
    name: 'Heritage Banking Company Ltd',
    shortName: 'Heritage Bank',
    code: '030'
  },
  '082': {
    name: 'Keystone Bank Limited',
    shortName: 'Keystone Bank',
    code: '082'
  },
  '076': {
    name: 'Skye Bank Plc',
    shortName: 'Skye Bank',
    code: '076'
  },
  '221': {
    name: 'Stanbic IBTC Bank Plc',
    shortName: 'Stanbic IBTC',
    code: '221'
  },
  '068': {
    name: 'Standard Chartered Bank Nigeria Ltd',
    shortName: 'Standard Chartered',
    code: '068'
  },
  '232': {
    name: 'Sterling Bank Plc',
    shortName: 'Sterling Bank',
    code: '232'
  },
  '033': {
    name: 'United Bank for Africa Plc',
    shortName: 'UBA',
    code: '033'
  },
  '032': {
    name: 'Union Bank of Nigeria Plc',
    shortName: 'Union Bank',
    code: '032'
  },
  '215': {
    name: 'Unity Bank Plc',
    shortName: 'Unity Bank',
    code: '215'
  },
  '035': {
    name: 'Wema Bank Plc',
    shortName: 'Wema Bank',
    code: '035'
  },
  '057': {
    name: 'Zenith Bank Plc',
    shortName: 'Zenith Bank',
    code: '057'
  },
  '101': {
    name: 'Providus Bank',
    shortName: 'Providus Bank',
    code: '101'
  },
  '102': {
    name: 'Titan Trust Bank',
    shortName: 'Titan Trust Bank',
    code: '102'
  }
} as const

// Export bank codes as an array for easy iteration
export const BANK_CODES = Object.keys(NIGERIAN_BANKS)

// Export bank names as an array
export const BANK_NAMES = Object.values(NIGERIAN_BANKS).map(bank => bank.name)

// Utility function to get bank by code
export const getBankByCode = (code: string) => {
  return NIGERIAN_BANKS[code as keyof typeof NIGERIAN_BANKS] || null
}

// Utility function to get bank code by name
export const getBankCodeByName = (name: string) => {
  const entry = Object.entries(NIGERIAN_BANKS).find(([_, bank]) => 
    bank.name.toLowerCase() === name.toLowerCase() || 
    bank.shortName.toLowerCase() === name.toLowerCase()
  )
  return entry ? entry[0] : null
}

// Other constants
export const API_ENDPOINTS = {
  GENERATE_NUBAN: '/api/nuban/generate',
  VALIDATE_NUBAN: '/api/nuban/validate',
  GET_BANKS: '/api/banks',
  BATCH_VALIDATE: '/api/nuban/batch-validate'
} as const

export const VALIDATION_MESSAGES = {
  VALID: 'NUBAN is valid',
  INVALID_FORMAT: 'Invalid NUBAN format',
  INVALID_CHECK_DIGIT: 'Invalid check digit',
  INVALID_BANK_CODE: 'Invalid bank code',
  NETWORK_ERROR: 'Network error occurred',
  UNKNOWN_ERROR: 'An unknown error occurred'
} as const

export const APP_CONFIG = {
  MAX_VALIDATION_HISTORY: 100,
  DEFAULT_PAGINATION_SIZE: 10,
  DEBOUNCE_DELAY: 300,
  API_TIMEOUT: 10000
} as const