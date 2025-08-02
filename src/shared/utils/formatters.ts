 
// src/shared/utils/formatters.ts
export const formatters = {
  // Format NUBAN with spaces for better readability
  formatNuban: (nuban: string): string => {
    return nuban.replace(/(\d{3})/g, '$1 ').trim()
  },

  // Format currency (Nigerian Naira)
  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount)
  },

  // Format date for Nigerian locale
  formatDate: (date: string | Date): string => {
    return new Intl.DateTimeFormat('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  },

  // Format bank code display
  formatBankCode: (code: string, name: string): string => {
    return `${name} (${code})`
  },

  // Truncate long text
  truncate: (text: string, length: number = 50): string => {
    if (text.length <= length) return text
    return text.slice(0, length) + '...'
  },
}