import { NIGERIAN_BANKS } from '@/shared/utils/constants'

export class NubanValidator {
  private static readonly WEIGHTS = [3, 7, 3, 3, 7, 3, 3, 7, 3, 3, 7, 3]


  static validateNuban(nuban: string, bankCode?: string): {
    isValid: boolean
    reason: string
    bankCode?: string
    bankName?: string
    checkDigit?: number
    accountNumber?: string
  } {
    if (!nuban || typeof nuban !== 'string') {
      return {
        isValid: false,
        reason: 'NUBAN must be a valid string'
      }
    }

    const cleanNuban = nuban.replace(/\D/g, '')

    if (cleanNuban.length !== 10) {
      return {
        isValid: false,
        reason: `NUBAN must be exactly 10 digits. Provided: ${cleanNuban.length} digits`
      }
    }

    const nubanBankCode = cleanNuban.substring(0, 3)
    const accountNumber = cleanNuban.substring(3, 9) // 6 digits
    const providedCheckDigit = parseInt(cleanNuban.substring(9, 10))

    let detectedBankCode = bankCode || nubanBankCode
    let detectedBankName = 'Unknown Bank'

    if (!NIGERIAN_BANKS[detectedBankCode as keyof typeof NIGERIAN_BANKS]) {
      return {
        isValid: false,
        reason: `Invalid bank code: ${detectedBankCode}`,
        bankCode: detectedBankCode,
        checkDigit: providedCheckDigit,
        accountNumber
      }
    }

    detectedBankName = NIGERIAN_BANKS[detectedBankCode as keyof typeof NIGERIAN_BANKS].name

    // Verify bank code matches NUBAN
    if (nubanBankCode !== detectedBankCode) {
      return {
        isValid: false,
        reason: `Bank code mismatch. NUBAN bank code: ${nubanBankCode}, Expected: ${detectedBankCode}`,
        bankCode: detectedBankCode,
        checkDigit: providedCheckDigit,
        accountNumber
      }
    }

    const calculatedCheckDigit = this.generateCheckDigit(detectedBankCode, accountNumber)

    const isValid = calculatedCheckDigit === providedCheckDigit

    return {
      isValid,
      reason: isValid 
        ? `Valid NUBAN for ${detectedBankName}` 
        : `Invalid check digit. Expected: ${calculatedCheckDigit}, Got: ${providedCheckDigit}`,
      bankCode: detectedBankCode,
      bankName: detectedBankName,
      checkDigit: providedCheckDigit,
      accountNumber
    }
  }


  static generateCheckDigit(bankCode: string, accountNumber: string): number {
    if (!bankCode || bankCode.length !== 3) {
      throw new Error('Bank code must be exactly 3 digits')
    }

    if (!accountNumber || accountNumber.length !== 6) {
      throw new Error('Account number must be exactly 6 digits for NUBAN generation')
    }

    const combined = bankCode + accountNumber

    console.log('🔢 Check Digit Calculation:', {
      bankCode,
      accountNumber,
      combined,
      weights: this.WEIGHTS.slice(0, combined.length)
    })

    let sum = 0
    for (let i = 0; i < combined.length; i++) {
      const digit = parseInt(combined[i])
      const weight = this.WEIGHTS[i]
      sum += digit * weight
      console.log(`Position ${i}: ${digit} × ${weight} = ${digit * weight}`)
    }

    console.log('Total sum:', sum)

    const remainder = sum % 10
    const checkDigit = remainder === 0 ? 0 : 10 - remainder

    console.log('Remainder:', remainder, 'Check Digit:', checkDigit)

    return checkDigit
  }


  static generateValidNuban(bankCode: string): {
    nuban: string
    accountNumber: string
    checkDigit: number
    bankCode: string
    bankName: string
  } {
    if (!NIGERIAN_BANKS[bankCode as keyof typeof NIGERIAN_BANKS]) {
      throw new Error(`Invalid bank code: ${bankCode}`)
    }

    const accountNumber = Math.floor(Math.random() * 900000 + 100000).toString().padStart(6, '0')
    
    console.log('🎲 Generating NUBAN:', {
      bankCode,
      accountNumber,
      accountNumberLength: accountNumber.length
    })
    
    const checkDigit = this.generateCheckDigit(bankCode, accountNumber)
    
    const nuban = bankCode + accountNumber + checkDigit.toString()

    console.log('✅ Generated Complete NUBAN:', {
      nuban,
      parts: {
        bankCode: nuban.substring(0, 3),
        accountNumber: nuban.substring(3, 9),
        checkDigit: nuban.substring(9, 10)
      }
    })

    return {
      nuban,
      accountNumber,
      checkDigit,
      bankCode,
      bankName: NIGERIAN_BANKS[bankCode as keyof typeof NIGERIAN_BANKS].name
    }
  }


  static isValidFormat(nuban: string): boolean {
    const cleanNuban = nuban.replace(/\D/g, '')
    return cleanNuban.length === 10 && /^\d+$/.test(cleanNuban)
  }

 
  static debugNuban(bankCode: string) {
    console.group(`🔍 NUBAN Debug for Bank Code: ${bankCode}`)
    
    try {
      const generated = this.generateValidNuban(bankCode)
      console.log('Generated Data:', generated)
      
      const validation = this.validateNuban(generated.nuban, bankCode)
      console.log('Validation Result:', validation)
      
      console.log('Should be valid:', validation.isValid)
      
      return { generated, validation }
    } catch (error) {
      console.error('Debug error:', error)
      return { error }
    } finally {
      console.groupEnd()
    }
  }
}

export default NubanValidator