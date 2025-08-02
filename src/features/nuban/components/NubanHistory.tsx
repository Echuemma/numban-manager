import React from 'react'
import { useAppSelector } from '@/shared/hooks/redux'
import { selectNubanState } from '../store/nubanSlice'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card'
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner'

export const NubanHistory: React.FC = () => {
  const nubanState = useAppSelector(selectNubanState)
  // Fix: Remove the non-existent 'history' property
  const accounts = nubanState?.accounts || []
  const isLoading = nubanState?.isLoading || false

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  const accountsArray = Array.isArray(accounts) ? accounts : []
  const accountCount = accountsArray.length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated NUBANs ({accountCount})</CardTitle>
      </CardHeader>
      <CardContent>
        {accountCount === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No NUBANs generated yet. Generate your first one above!
          </p>
        ) : (
          <div className="space-y-3">
            {accountsArray.map((account, index) => {
              if (!account || !account.accountNumber) {
                return null
              }

              return (
                <div
                  key={account.id || `account-${index}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-mono text-lg font-semibold">
                      {account.accountNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      {account.bankName || 'Unknown Bank'} ({account.bankCode || 'N/A'})
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {account.createdAt ? (
                      <>
                        <p>{new Date(account.createdAt).toLocaleDateString()}</p>
                        <p>{new Date(account.createdAt).toLocaleTimeString()}</p>
                      </>
                    ) : (
                      <p>No date</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}