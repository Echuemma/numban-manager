import { faker } from '@faker-js/faker'
import { NubanValidator } from '@/features/nuban/services/nubanValidator'
import { NIGERIAN_BANKS } from '@/shared/utils/constants'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message: string
  timestamp?: string
}

export interface NubanAccount {
  id: string
  accountNumber: string
  nuban: string
  bankName: string
  bankCode: string
  checkDigit: number
  createdAt: string
  metadata: {
    generationMethod: string
    requestId: string
    processingTime: number
  }
}

export interface ValidationResult {
  nuban: string
  bankName: string
  bankCode: string
  isValid: boolean
  reason: string
  errors: string[]
  validatedAt: string
  details?: {
    accountNumber: string
    checkDigit: number
    calculatedCheckDigit?: number
    algorithm: string
  }
}

export interface BankInfo {
  code: string
  name: string
  shortName: string
  established?: string
  headquarters?: string
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const shouldSimulateError = () => Math.random() < 0.05 

export const mockApiService = {
  
  generateNuban: async (bankCode: string): Promise<ApiResponse<NubanAccount>> => {
    await delay(800 + Math.random() * 400) 

    if (shouldSimulateError()) {
      return {
        success: false,
        error: 'NETWORK_ERROR',
        message: 'Failed to connect to NUBAN generation service',
        timestamp: new Date().toISOString()
      }
    }

    try {
      const bankInfo = NIGERIAN_BANKS[bankCode as keyof typeof NIGERIAN_BANKS]
      if (!bankInfo) {
        return {
          success: false,
          error: 'INVALID_BANK_CODE',
          message: `Invalid bank code: ${bankCode}`,
          timestamp: new Date().toISOString()
        }
      }

      const generatedData = NubanValidator.generateValidNuban(bankCode)
      
      const account: NubanAccount = {
        id: faker.string.uuid(),
        accountNumber: generatedData.accountNumber,
        nuban: generatedData.nuban,
        bankName: generatedData.bankName,
        bankCode: generatedData.bankCode,
        checkDigit: generatedData.checkDigit,
        createdAt: new Date().toISOString(),
        metadata: {
          generationMethod: 'CBN NUBAN Algorithm v2.1',
          requestId: faker.string.uuid(),
          processingTime: Math.floor(Math.random() * 1000) + 500
        }
      }

      console.log('🔢 Generated NUBAN:', {
        bank: bankInfo.name,
        nuban: generatedData.nuban,
        components: {
          accountNumber: generatedData.accountNumber,
          checkDigit: generatedData.checkDigit,
          bankCode: generatedData.bankCode
        }
      })

      return {
        success: true,
        data: account,
        message: `NUBAN generated successfully for ${bankInfo.name}`,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: 'GENERATION_ERROR',
        message: error instanceof Error ? error.message : 'Failed to generate NUBAN',
        timestamp: new Date().toISOString()
      }
    }
  },

  
  validateNuban: async (nuban: string, bankCode?: string): Promise<ApiResponse<ValidationResult>> => {
    await delay(600 + Math.random() * 300) 

    if (shouldSimulateError()) {
      return {
        success: false,
        error: 'NETWORK_ERROR',
        message: 'Failed to connect to NUBAN validation service',
        timestamp: new Date().toISOString()
      }
    }

    try {
      const validation = NubanValidator.validateNuban(nuban, bankCode)
      
      const result: ValidationResult = {
        nuban: nuban.replace(/\D/g, ''), 
        bankName: validation.bankName || 'Unknown Bank',
        bankCode: validation.bankCode || 'Unknown',
        isValid: validation.isValid,
        reason: validation.reason,
        errors: validation.isValid ? [] : [validation.reason],
        validatedAt: new Date().toISOString(),
        details: {
          accountNumber: validation.accountNumber || nuban.substring(0, 9),
          checkDigit: validation.checkDigit || parseInt(nuban.substring(9, 10)),
          algorithm: 'CBN NUBAN Algorithm v2.1'
        }
      }

      console.log('✅ NUBAN Validation:', {
        input: nuban,
        bankCode,
        result: validation.isValid ? 'VALID ✓' : 'INVALID ✗',
        reason: validation.reason,
        detectedBank: validation.bankName
      })

      return {
        success: true,
        data: result,
        message: validation.isValid ? 'NUBAN is valid' : 'NUBAN validation failed',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: 'VALIDATION_ERROR',
        message: error instanceof Error ? error.message : 'Failed to validate NUBAN',
        timestamp: new Date().toISOString()
      }
    }
  },

 
  getBanks: async (): Promise<ApiResponse<BankInfo[]>> => {
    await delay(300 + Math.random() * 200)

    try {
      const banks: BankInfo[] = Object.entries(NIGERIAN_BANKS).map(([code, info]) => ({
        code,
        name: info.name,
        shortName: info.shortName || info.name,
        established: faker.date.past({ years: 50 }).getFullYear().toString(),
        headquarters: 'Lagos, Nigeria' 
      }))

      return {
        success: true,
        data: banks,
        message: `Retrieved ${banks.length} banks`,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: 'FETCH_ERROR',
        message: 'Failed to fetch bank list',
        timestamp: new Date().toISOString()
      }
    }
  },

  /**
   * Batch validate multiple NUBANs
   */
  batchValidateNubans: async (nubans: Array<{nuban: string, bankCode?: string}>): Promise<ApiResponse<ValidationResult[]>> => {
    await delay(1000 + Math.random() * 500) // Longer delay for batch operations

    try {
      const results: ValidationResult[] = []
      
      for (const { nuban, bankCode } of nubans) {
        const validation = NubanValidator.validateNuban(nuban, bankCode)
        
        results.push({
          nuban: nuban.replace(/\D/g, ''),
          bankName: validation.bankName || 'Unknown Bank',
          bankCode: validation.bankCode || 'Unknown',
          isValid: validation.isValid,
          reason: validation.reason,
          errors: validation.isValid ? [] : [validation.reason],
          validatedAt: new Date().toISOString(),
          details: {
            accountNumber: validation.accountNumber || nuban.substring(0, 9),
            checkDigit: validation.checkDigit || parseInt(nuban.substring(9, 10)),
            algorithm: 'CBN NUBAN Algorithm v2.1'
          }
        })
      }

      const validCount = results.filter(r => r.isValid).length
      
      return {
        success: true,
        data: results,
        message: `Validated ${results.length} NUBANs. ${validCount} valid, ${results.length - validCount} invalid`,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: 'BATCH_VALIDATION_ERROR',
        message: error instanceof Error ? error.message : 'Batch validation failed',
        timestamp: new Date().toISOString()
      }
    }
  },

  /**
   * Get validation statistics (mock data)
   */
  getValidationStats: async (): Promise<ApiResponse<{
    totalValidations: number
    validNubans: number
    invalidNubans: number
    topBanks: Array<{bankCode: string, bankName: string, count: number}>
    recentActivity: Array<{date: string, validations: number}>
  }>> => {
    await delay(400 + Math.random() * 200)

    try {
      const bankCodes = Object.keys(NIGERIAN_BANKS)
      const topBanks = bankCodes.slice(0, 5).map(code => {
        const bankInfo = NIGERIAN_BANKS[code as keyof typeof NIGERIAN_BANKS]
        return {
          bankCode: code,
          bankName: bankInfo?.name || 'Unknown Bank',
          count: faker.number.int({ min: 100, max: 1000 })
        }
      })

      const recentActivity = Array.from({ length: 7 }, (_, i) => ({
        date: faker.date.recent({ days: 7 - i }).toISOString().split('T')[0],
        validations: faker.number.int({ min: 50, max: 200 })
      }))

      const totalValidations = faker.number.int({ min: 5000, max: 10000 })
      const validNubans = Math.floor(totalValidations * 0.85) // 85% valid rate
      
      return {
        success: true,
        data: {
          totalValidations,
          validNubans,
          invalidNubans: totalValidations - validNubans,
          topBanks,
          recentActivity
        },
        message: 'Statistics retrieved successfully',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: 'STATS_ERROR',
        message: 'Failed to fetch statistics',
        timestamp: new Date().toISOString()
      }
    }
  },

  /**
   * Debug endpoint for testing
   */
  debugNuban: async (bankCode: string): Promise<ApiResponse<{
    generated: any
    validation: any
    timestamp: string
  }>> => {
    await delay(200)
    
    try {
      const generated = NubanValidator.generateValidNuban(bankCode)
      const validation = NubanValidator.validateNuban(generated.nuban, bankCode)
      
      console.group(`🔍 NUBAN Debug for ${generated.bankName}`)
      console.log('Generated:', generated)
      console.log('Validation:', validation)
      console.groupEnd()
      
      return {
        success: true,
        data: {
          generated,
          validation,
          timestamp: new Date().toISOString()
        },
        message: 'Debug completed successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: 'DEBUG_ERROR',
        message: error instanceof Error ? error.message : 'Debug failed'
      }
    }
  }
}

export default mockApiService