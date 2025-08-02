import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { generateNubanAsync } from '../store/nubanSlice';
import { useAppDispatch } from '../../../shared/hooks/redux'; 
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { NubanValidator } from './NubanValidator';
import { NubanAccount } from '../types/nuban.types';
import { 
  RefreshCw, 
  Copy, 
  CheckCircle, 
  Search,
  Plus,
  Eye
} from 'lucide-react';
import { NIGERIAN_BANKS as BANKS_OBJECT } from '../../../shared/utils/constants';

const NIGERIAN_BANKS = Object.values(BANKS_OBJECT);

export const NubanGenerator: React.FC = () => {
  const dispatch = useAppDispatch(); 
  const { lastGenerated, isGenerating, error, generationHistory } = useSelector((state: RootState) => state.nuban);
  
  const [selectedBank, setSelectedBank] = useState(() => {
    if (NIGERIAN_BANKS && Array.isArray(NIGERIAN_BANKS) && NIGERIAN_BANKS.length > 0) {
      return NIGERIAN_BANKS[0];
    }
    return { code: '', name: 'No banks available' };
  });
  
  const [activeTab, setActiveTab] = useState<'generate' | 'validate'>('generate');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (selectedBank && selectedBank.code) {
      console.log('Starting generation with bank:', selectedBank);
      
      try {
        const generateRequest = {
          bankCode: selectedBank.code,
          accountName: 'Generated Account', 
          accountType: 'savings' as const 
        };
        
        const resultAction = await dispatch(generateNubanAsync(generateRequest));
        console.log('Generation result:', resultAction);
        
        if (generateNubanAsync.fulfilled.match(resultAction)) {
          console.log('Generation successful, payload:', resultAction.payload);
        } else if (generateNubanAsync.rejected.match(resultAction)) {
          console.log('Generation failed:', resultAction.error);
        }
      } catch (error) {
        console.error('Error during generation:', error);
      }
    } else {
      console.error('No bank selected or invalid bank code');
    }
  };

  const copyToClipboard = async (text: string, id?: string | React.Key | null) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id?.toString() || null);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const tabs = [
    { id: 'generate' as const, label: 'Generate NUBAN', icon: Plus },
    { id: 'validate' as const, label: 'Validate NUBAN', icon: Search }
  ];

  if (!NIGERIAN_BANKS || !Array.isArray(NIGERIAN_BANKS) || NIGERIAN_BANKS.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="text-center py-8">
            <p className="text-red-600 text-lg">No Nigerian banks data available. Please check your constants file.</p>
            <p className="text-gray-600 text-sm mt-2">
              Expected: Array of bank objects, Got: {typeof NIGERIAN_BANKS}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-1">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </Card>

      {activeTab === 'generate' ? (
        <>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Plus className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Generate NUBAN</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Bank
                </label>
                <select
                  value={selectedBank?.code || ''}
                  onChange={(e) => {
                    const bank = Array.isArray(NIGERIAN_BANKS) ? 
                      NIGERIAN_BANKS.find(b => b.code === e.target.value) : null;
                    if (bank) {
                      console.log('Bank selected:', bank);
                      setSelectedBank(bank);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isGenerating}
                >
                  {Array.isArray(NIGERIAN_BANKS) && NIGERIAN_BANKS.map(bank => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name} ({bank.code})
                    </option>
                  ))}
                </select>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !selectedBank?.code}
                size="lg"
                className="w-full flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? 'Generating...' : 'Generate NUBAN'}
              </Button>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {lastGenerated && lastGenerated.accountNumber && (
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated NUBAN</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Account Number:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-mono font-bold text-gray-900">
                          {lastGenerated.accountNumber?.toString() || 'N/A'}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(lastGenerated.accountNumber?.toString() || '', 'account')}
                          className="p-1"
                        >
                          {copiedId === 'account' ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bank:</span>
                        <span className="font-medium">{lastGenerated.bankName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bank Code:</span>
                        <span className="font-mono">{lastGenerated.bankCode}</span>
                      </div>
                      {lastGenerated.sortCode && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sort Code:</span>
                          <span className="font-mono">{lastGenerated.sortCode}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-medium ${lastGenerated.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {lastGenerated.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    {lastGenerated.createdAt && (
                      <div className="text-xs text-gray-500 border-t pt-3">
                        Generated at: {new Date(lastGenerated.createdAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {generationHistory && generationHistory.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold">Recent Generated NUBANs</h3>
                </div>
                <span className="text-sm text-gray-500">{generationHistory.length} total</span>
              </div>
              
              <div className="space-y-2">
                {generationHistory.slice(0, 5).map((nuban: NubanAccount) => (
                  <div key={nuban.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-mono font-semibold text-gray-900">
                        {nuban.accountNumber?.toString() || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">{nuban.bankName}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(nuban.createdAt || nuban.updatedAt).toLocaleDateString()}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(nuban.accountNumber?.toString() || '', nuban.id)}
                      className="p-1 ml-2"
                    >
                      {copiedId === nuban.id?.toString() ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      ) : (
        <NubanValidator />
      )}
    </div>
  );
};