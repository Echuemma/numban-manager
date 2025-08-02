import React, { useEffect } from 'react'
import { Alert } from './Alert'

interface ToastProps {
  type: 'success' | 'warning' | 'error' | 'info'
  title?: string
  message: string
  duration?: number
  onClose: () => void
}

export const Toast: React.FC<ToastProps> = ({
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
    // Return undefined for the case when duration <= 0
    return undefined
  }, [duration, onClose])

  return (
    <div className="fixed top-4 right-4 z-50 w-96 max-w-sm">
      <Alert
        type={type}
        title={title || ''}
        message={message}
        onClose={onClose}
        className="shadow-lg"
      />
    </div>
  )
}