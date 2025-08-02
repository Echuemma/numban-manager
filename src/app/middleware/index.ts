import { Middleware } from '@reduxjs/toolkit'
import type { RootState } from '../store'

const loggerMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚀 Action: ${action.type}`)
    console.log('Previous State:', store.getState())
    console.log('Action:', action)
  }
  
  const result = next(action)
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Next State:', store.getState())
    console.groupEnd()
  }
  
  return result
}

const performanceMiddleware: Middleware<{}, RootState> = () => (next) => (action) => {
  const start = performance.now()
  const result = next(action)
  const end = performance.now()
  
  const duration = end - start
  if (duration > 5) { 
    console.warn(`⚠️ Slow action detected: ${action.type} took ${duration.toFixed(2)}ms`)
  }
  
  return result
}

const errorMiddleware: Middleware<{}, RootState> = () => (next) => (action) => {
  try {
    return next(action)
  } catch (error) {
    console.error('🔥 Redux Error:', error)
    console.error('Action that caused error:', action)
    throw error
  }
}

export const customMiddleware = [
  loggerMiddleware,
  performanceMiddleware,
  errorMiddleware,
]
