// src/shared/hooks/useApiStatus.ts
import { useAppSelector } from './redux'
import { selectUiState } from '@/features/ui/store/uiSlice'

export function useApiStatus() {
  const { notifications } = useAppSelector(selectUiState)
  
  return {
    hasErrors: notifications.some(n => n.type === 'error'),
    hasSuccess: notifications.some(n => n.type === 'success'),
    isLoading: notifications.some(n => n.type === 'info' && n.message.includes('loading')),
    notifications,
  }
}