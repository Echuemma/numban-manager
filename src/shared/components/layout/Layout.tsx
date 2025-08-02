// src/shared/components/layout/Layout.tsx
import React from 'react'
import { useAppSelector } from '@/shared/hooks/redux'
import { selectUiState } from '@/features/ui/store/uiSlice'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useAppSelector(selectUiState)

  return (
    <div className={`min-h-screen bg-gray-50 ${theme === 'dark' ? 'dark' : ''}`}>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                NUBAN Manager
              </h1>
              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                Advanced
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Nigerian Uniform Bank Account Number
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            NUBAN Manager - Advanced React + Redux Toolkit Application
          </p>
        </div>
      </footer>
    </div>
  )
}