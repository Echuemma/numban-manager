import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { validateStart, validateSuccess, validateFailure } from '../../validation/store/validationSlice';
import { CheckCircle, XCircle, Search, AlertCircle, Info } from 'lucide-react';
import { NubanValidator as NubanValidatorService } from '../services/nubanValidator';
import { NIGERIAN_BANKS as BANKS_OBJECT } from '../../../shared/utils/constants';

const NIGERIAN_BANKS = Object.values(BANKS_OBJECT);

export const NubanValidator: React.FC = () => {
  const dispatch = useDispatch();
  const [nubanInput, setNubanInput] = useState('');
  const [bankCodeInput, setBankCodeInput] = useState('');
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    reason?: string;
    bankName?: string;
    bankCode?: string;
    checkDigit?: string;
    serialNumber?: string;
  } | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleValidate = async () => {
    if (!nubanInput.trim()) {
      alert('Please enter a NUBAN to validate');
      return;
    }

    const nuban = nubanInput.replace(/\s+/g, '');
    const bankCode = bankCodeInput.trim();

    if (nuban.length !== 10) {
      setValidationResult({
        isValid: false,
        reason: 'NUBAN must be exactly 10 digits'
      });
      return;
    }

    if (!/^\d+$/.test(nuban)) {
      setValidationResult({
        isValid: false,
        reason: 'NUBAN must contain only digits'
      });
      return;
    }

    if (!Array.isArray(NIGERIAN_BANKS) || NIGERIAN_BANKS.length === 0) {
      setValidationResult({
        isValid: false,
        reason: 'Bank data not available. Please check your configuration.'
      });
      return;
    }

    setIsValidating(true);
    dispatch(validateStart());

    try {
      const bank = NIGERIAN_BANKS.find(b => 
        b && b.code && (
          b.code === bankCode || 
          (b.name && b.name.toLowerCase().includes(bankCode.toLowerCase()))
        )
      );

      const bankInfo = bank || { 
        code: bankCode || 'Unknown', 
        name: bankCode ? `Bank (${bankCode})` : 'Unknown Bank' 
      };

      // Debug logging
      console.log('Validating NUBAN:', nuban);
      console.log('Bank Code Input:', bankCode);
      console.log('Found Bank:', bank);
      console.log('Using Bank Info:', bankInfo);

      const result = NubanValidatorService.validateNuban(nuban, bankInfo.code);
      
      console.log('Validation Result:', result);

      const validationRecord = {
        id: `val_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        nuban,
        bankCode: bankInfo.code,
        bankName: bankInfo.name,
        isValid: result.isValid,
        reason: result.reason,
        validatedAt: new Date().toISOString(),
        validationType: 'manual' as const
      };

      setValidationResult({
        isValid: result.isValid,
        reason: result.reason,
        bankName: bankInfo.name,
        bankCode: bankInfo.code,
        checkDigit: nuban.slice(-1),
        serialNumber: nuban.slice(0, 9)
      });

      dispatch(validateSuccess(validationRecord));

    } catch (error) {
      console.error('Validation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Validation failed';
      dispatch(validateFailure(errorMessage));
      setValidationResult({
        isValid: false,
        reason: errorMessage
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleClear = () => {
    setNubanInput('');
    setBankCodeInput('');
    setValidationResult(null);
  };

  const formatNubanInput = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    return digits;
  };

  if (!Array.isArray(NIGERIAN_BANKS) || NIGERIAN_BANKS.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <h2 className="text-xl font-semibold text-red-800">Configuration Error</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600 text-lg">No Nigerian banks data available.</p>
          <p className="text-gray-600 text-sm mt-2">
            Please check your constants file configuration.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Expected: Array of bank objects, Got: {typeof NIGERIAN_BANKS}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Search className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold">NUBAN Validator</h2>
      </div>

      <div className="space-y-4">
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs">
          <strong>Debug:</strong> Banks available: {NIGERIAN_BANKS.length}, 
          Type: {Array.isArray(NIGERIAN_BANKS) ? 'Array' : typeof NIGERIAN_BANKS}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            NUBAN Account Number *
          </label>
          <Input
            type="text"
            placeholder="Enter 10-digit NUBAN"
            value={nubanInput}
            onChange={(e) => setNubanInput(formatNubanInput(e.target.value))}
            className="font-mono text-lg tracking-wider"
            maxLength={10}
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the 10-digit Nigerian Uniform Bank Account Number
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bank Code or Name (Optional)
          </label>
          <Input
            type="text"
            placeholder="e.g., 044 or Access Bank"
            value={bankCodeInput}
            onChange={(e) => setBankCodeInput(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional: Helps identify the specific bank for validation
          </p>
        </div>

        {bankCodeInput && bankCodeInput.length > 0 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Matching Banks:</h4>
            <div className="space-y-1">
              {NIGERIAN_BANKS
                .filter(b => 
                  b && (
                    (b.code && b.code.includes(bankCodeInput)) ||
                    (b.name && b.name.toLowerCase().includes(bankCodeInput.toLowerCase()))
                  )
                )
                .slice(0, 3)
                .map(bank => (
                  <button
                    key={bank.code}
                    onClick={() => setBankCodeInput(bank.code)}
                    className="block w-full text-left text-xs text-blue-700 hover:text-blue-900 hover:bg-blue-100 p-1 rounded"
                  >
                    {bank.name} ({bank.code})
                  </button>
                ))
              }
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleValidate}
            disabled={!nubanInput.trim() || nubanInput.length !== 10 || isValidating}
            className="flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            {isValidating ? 'Validating...' : 'Validate NUBAN'}
          </Button>
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={isValidating}
          >
            Clear
          </Button>
        </div>

        {validationResult && (
          <div className={`border rounded-lg p-4 mt-6 ${
            validationResult.isValid 
              ? 'border-green-200 bg-green-50' 
              : 'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {validationResult.isValid ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <h3 className={`font-medium ${
                  validationResult.isValid ? 'text-green-800' : 'text-red-800'
                }`}>
                  {validationResult.isValid ? 'Valid NUBAN' : 'Invalid NUBAN'}
                </h3>
                
                {validationResult.reason && (
                  <p className={`text-sm mt-1 ${
                    validationResult.isValid ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {validationResult.reason}
                  </p>
                )}

                <div className="mt-3 space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">NUBAN:</span>
                      <span className="ml-2 font-mono">{nubanInput}</span>
                    </div>
                    {validationResult.bankName && (
                      <div>
                        <span className="font-medium">Bank:</span>
                        <span className="ml-2">{validationResult.bankName}</span>
                      </div>
                    )}
                    {validationResult.bankCode && (
                      <div>
                        <span className="font-medium">Bank Code:</span>
                        <span className="ml-2 font-mono">{validationResult.bankCode}</span>
                      </div>
                    )}
                    {validationResult.serialNumber && (
                      <div>
                        <span className="font-medium">Serial Number:</span>
                        <span className="ml-2 font-mono">{validationResult.serialNumber}</span>
                      </div>
                    )}
                    {validationResult.checkDigit && (
                      <div>
                        <span className="font-medium">Check Digit:</span>
                        <span className="ml-2 font-mono">{validationResult.checkDigit}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <h4 className="font-medium mb-1">How NUBAN Validation Works</h4>
              <ul className="space-y-1 text-xs">
                <li>• NUBAN uses a check digit algorithm to verify account numbers</li>
                <li>• The last digit is calculated from the first 9 digits and bank code</li>
                <li>• Valid NUBANs have the correct check digit for the given bank</li>
                <li>• Enter a bank code for more accurate validation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};