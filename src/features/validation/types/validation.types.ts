 export interface ValidationRecord {
  id: string;
  nuban: string;
  bankCode?: string;
  bankName?: string;
  isValid: boolean;
  reason?: string;
  validatedAt: string;
  validationType: 'manual' | 'batch' | 'api';
}

export interface ValidationStats {
  totalValidations: number;
  validCount: number;
  invalidCount: number;
  lastValidatedAt: string | null;
}

export interface ValidationState {
  history: ValidationRecord[];
  isValidating: boolean;
  error: string | null;
  stats: ValidationStats;
}