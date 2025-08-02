 // src/shared/utils/validators.ts
export const validators = {
  // Validate NUBAN format (10 digits)
  isValidNubanFormat: (nuban: string): boolean => {
    return /^\d{10}$/.test(nuban)
  },

  // Validate Nigerian bank code format (3 digits)
  isValidBankCode: (code: string): boolean => {
    return /^\d{3}$/.test(code)
  },

  // Validate email format
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Validate phone number (Nigerian format)
  isValidNigerianPhone: (phone: string): boolean => {
    const phoneRegex = /^(\+234|234|0)?[789]\d{9}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  },

  // Check if string is not empty
  isRequired: (value: string | null | undefined): boolean => {
    return value != null && value.trim().length > 0
  },

  // Validate minimum length
  minLength: (value: string, min: number): boolean => {
    return value.length >= min
  },

  // Validate maximum length
  maxLength: (value: string, max: number): boolean => {
    return value.length <= max
  },
}