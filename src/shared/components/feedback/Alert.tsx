import React from 'react'
import { cn } from '@/shared/utils/cn'
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

interface AlertProps {
  type: 'success' | 'warning' | 'error' | 'info'
  title?: string
  message: string
  onClose?: () => void
  className?: string
}

export const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  onClose,
  className
}) => {
  const styles = {
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: CheckCircleIcon,
      iconColor: 'text-green-400'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-yellow-400'
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: XCircleIcon,
      iconColor: 'text-red-400'
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: InformationCircleIcon,
      iconColor: 'text-blue-400'
    }
  }

  const { container, icon: Icon, iconColor } = styles[type]

  return (
    <div className={cn('rounded-md border p-4', container, className)}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={cn('h-5 w-5', iconColor)} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium">{title}</h3>
          )}
          <div className={cn('text-sm', title && 'mt-1')}>
            {message}
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className="inline-flex rounded-md p-1.5 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              <span className="sr-only">Dismiss</span>
              <XCircleIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}