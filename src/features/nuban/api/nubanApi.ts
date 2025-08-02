import { faker } from '@faker-js/faker'
import { 
  NubanAccount, 
  Bank, 
  GenerateNubanRequest, 
  ValidateNubanRequest, 
  NubanValidationResult,
  NubanFilters 
} from '../types/nuban.types'
const NIGERIAN_BANKS: Bank[] = [
  { id: '1', name: 'Access Bank', code: '044', sortCode: '044150149', isActive: true },
  { id: '2', name: 'Guaranty Trust Bank', code: '058', sortCode: '058152052', isActive: true },
  { id: '3', name: 'Zenith Bank', code: '057', sortCode: '057150013', isActive: true },
  { id: '4', name: 'First Bank of Nigeria', code: '011', sortCode: '011151003', isActive: true },
  { id: '5', name: 'United Bank for Africa', code: '033', sortCode: '033153513', isActive: true },
  { id: '6', name: 'Fidelity Bank', code: '070', sortCode: '070150003', isActive: true },
  { id: '7', name: 'Sterling Bank', code: '232', sortCode: '232150016', isActive: true },
  { id: '8', name: 'Union Bank of Nigeria', code: '032', sortCode: '032080474', isActive: true },
  { id: '9', name: 'Ecobank Nigeria', code: '050', sortCode: '050150010', isActive: true },
  { id: '10', name: 'Stanbic IBTC Bank', code: '221', sortCode: '221159522', isActive: true },
]

const generateNubanCheckDigits = (bankCode: string, serialNumber: string): string => {
  const weights = [3, 7, 3, 3, 7, 3, 3, 7, 3]
  const codeSerial = bankCode + serialNumber
  
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(codeSerial[i]) * weights[i]
  }
  
  const remainder = sum % 10
  const checkDigit = remainder === 0 ? 0 : 10 - remainder
  
  return checkDigit.toString()
}

const generateAccountNumber = (bankCode: string): string => {
  const serialNumber = faker.string.numeric(6)
  const checkDigit = generateNubanCheckDigits(bankCode, serialNumber)
  return bankCode + serialNumber + checkDigit
}

const validateNubanChecksum = (accountNumber: string, bankCode: string): boolean => {
  if (accountNumber.length !== 10) return false
  
  const serialNumber = accountNumber.substring(3, 9)
  const providedCheckDigit = accountNumber.substring(9, 10)
  const calculatedCheckDigit = generateNubanCheckDigits(bankCode, serialNumber)
  
  return providedCheckDigit === calculatedCheckDigit
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

class NubanApi {
  private accounts: NubanAccount[] = []
  
  constructor() {
    this.seedInitialData()
  }
  
  private seedInitialData() {
    for (let i = 0; i < 50; i++) {
      const bank = faker.helpers.arrayElement(NIGERIAN_BANKS)
      const account: NubanAccount = {
        id: faker.string.uuid(),
        accountNumber: generateAccountNumber(bank.code),
        accountName: faker.person.fullName(),
        bankCode: bank.code,
        bankName: bank.name,
        sortCode: bank.sortCode,
        bvn: faker.string.numeric(11),
        phoneNumber: faker.phone.number(),
        email: faker.internet.email(),
        accountType: faker.helpers.arrayElement(['savings', 'current', 'fixed']),
        balance: faker.number.float({ min: 0, max: 1000000, fractionDigits: 2 }),
        isActive: faker.datatype.boolean(0.9),
        createdAt: faker.date.past({ years: 2 }).toISOString(),
        updatedAt: faker.date.recent().toISOString(),
      }
      this.accounts.push(account)
    }
  }
  
  async getBanks(): Promise<Bank[]> {
    await delay(300)
    return NIGERIAN_BANKS.filter(bank => bank.isActive)
  }
  
async generateAccount(request: GenerateNubanRequest): Promise<NubanAccount> {
  await delay(800) 
  
  const bank = NIGERIAN_BANKS.find(b => b.code === request.bankCode)
  if (!bank) {
    throw new Error('Invalid bank code')
  }
  
  const account: NubanAccount = {
    id: faker.string.uuid(),
    accountNumber: generateAccountNumber(request.bankCode),
    accountName: request.accountName,
    bankCode: request.bankCode,
    bankName: bank.name,
    sortCode: bank.sortCode,
    // Fix: Provide default values for optional fields that might be undefined
    bvn: request.bvn || faker.string.numeric(11),
    phoneNumber: request.phoneNumber || faker.phone.number(),
    email: request.email || faker.internet.email(),
    accountType: request.accountType,
    balance: request.initialBalance || 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  this.accounts.unshift(account)
  return account
}
  
  async validateAccount(request: ValidateNubanRequest): Promise<NubanValidationResult> {
    await delay(500)
    
    const bank = NIGERIAN_BANKS.find(b => b.code === request.bankCode)
    if (!bank) {
      return {
        isValid: false,
        errors: ['Invalid bank code']
      }
    }
    
    const isValidChecksum = validateNubanChecksum(request.accountNumber, request.bankCode)
    if (!isValidChecksum) {
      return {
        isValid: false,
        errors: ['Invalid account number checksum']
      }
    }
    
    const existingAccount = this.accounts.find(
      acc => acc.accountNumber === request.accountNumber && acc.bankCode === request.bankCode
    )
    
    if (existingAccount) {
      return {
        isValid: true,
        accountName: existingAccount.accountName,
        bankName: existingAccount.bankName
      }
    }
    
    const exists = faker.datatype.boolean(0.7)
    if (exists) {
      return {
        isValid: true,
        accountName: faker.person.fullName(),
        bankName: bank.name
      }
    }
    
    return {
      isValid: false,
      errors: ['Account not found']
    }
  }
  
  async getAccounts(params: { 
    page?: number
    pageSize?: number
    filters?: NubanFilters 
  }): Promise<{
    data: NubanAccount[]
    currentPage: number
    pageSize: number
    totalCount: number
    totalPages: number
  }> {
    await delay(400)
    
    const { page = 1, pageSize = 10, filters = {} } = params
    let filteredAccounts = [...this.accounts]
    
    if (filters.bankCode) {
      filteredAccounts = filteredAccounts.filter(acc => acc.bankCode === filters.bankCode)
    }
    
    if (filters.accountType) {
      filteredAccounts = filteredAccounts.filter(acc => acc.accountType === filters.accountType)
    }
    
    if (filters.minBalance !== undefined) {
      filteredAccounts = filteredAccounts.filter(acc => acc.balance >= filters.minBalance!)
    }
    
    if (filters.maxBalance !== undefined) {
      filteredAccounts = filteredAccounts.filter(acc => acc.balance <= filters.maxBalance!)
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase()
      filteredAccounts = filteredAccounts.filter(acc => 
        acc.accountName.toLowerCase().includes(term) ||
        acc.accountNumber.includes(term) ||
        acc.bankName.toLowerCase().includes(term) ||
        acc.email?.toLowerCase().includes(term)
      )
    }
    
    if (filters.dateRange) {
      const { from, to } = filters.dateRange
      filteredAccounts = filteredAccounts.filter(acc => {
        const createdAt = new Date(acc.createdAt)
        return createdAt >= new Date(from) && createdAt <= new Date(to)
      })
    }
    
    const totalCount = filteredAccounts.length
    const totalPages = Math.ceil(totalCount / pageSize)
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    
    const data = filteredAccounts.slice(startIndex, endIndex)
    
    return {
      data,
      currentPage: page,
      pageSize,
      totalCount,
      totalPages
    }
  }
  
  async deleteAccount(id: string): Promise<void> {
    await delay(300)
    const index = this.accounts.findIndex(acc => acc.id === id)
    if (index > -1) {
      this.accounts.splice(index, 1)
    }
  }
  
  async updateAccount(id: string, updates: Partial<NubanAccount>): Promise<NubanAccount> {
    await delay(400)
    const index = this.accounts.findIndex(acc => acc.id === id)
    if (index === -1) {
      throw new Error('Account not found')
    }
    
    this.accounts[index] = {
      ...this.accounts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    return this.accounts[index]
  }
}

export const nubanApi = new NubanApi()
