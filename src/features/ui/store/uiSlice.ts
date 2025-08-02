import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UiState {
  theme: 'light' | 'dark' | 'system'
  sidebarCollapsed: boolean
  activeModal: string | null
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    timestamp: string
    isRead: boolean
  }>
  layout: {
    viewMode: 'table' | 'grid' | 'card'
    pageSize: number
    compactMode: boolean
  }
  loading: {
    global: boolean
    operations: Record<string, boolean>
  }
  errors: {
    global: string | null
    field: Record<string, string>
  }
}

const initialState: UiState = {
  theme: 'system',
  sidebarCollapsed: false,
  activeModal: null,
  notifications: [],
  layout: {
    viewMode: 'table',
    pageSize: 10,
    compactMode: false
  },
  loading: {
    global: false,
    operations: {}
  },
  errors: {
    global: null,
    field: {}
  }
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<UiState['theme']>) => {
      state.theme = action.payload
    },
    
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
    },
    
    setActiveModal: (state, action: PayloadAction<string | null>) => {
      state.activeModal = action.payload
    },
    
    addNotification: (state, action: PayloadAction<Omit<UiState['notifications'][0], 'id' | 'timestamp' | 'isRead'>>) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        isRead: false
      }
      state.notifications.unshift(notification)
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
    
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification) {
        notification.isRead = true
      }
    },
    
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(n => {
        n.isRead = true
      })
    },
    
    clearNotifications: (state) => {
      state.notifications = []
    },
    
    setViewMode: (state, action: PayloadAction<UiState['layout']['viewMode']>) => {
      state.layout.viewMode = action.payload
    },
    
    setPageSize: (state, action: PayloadAction<number>) => {
      state.layout.pageSize = action.payload
    },
    
    toggleCompactMode: (state) => {
      state.layout.compactMode = !state.layout.compactMode
    },
    
    setCompactMode: (state, action: PayloadAction<boolean>) => {
      state.layout.compactMode = action.payload
    },
    
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload
    },
    
    setOperationLoading: (state, action: PayloadAction<{ operation: string; loading: boolean }>) => {
      state.loading.operations[action.payload.operation] = action.payload.loading
    },
    
    clearOperationLoading: (state, action: PayloadAction<string>) => {
      delete state.loading.operations[action.payload]
    },
    
    clearAllOperationLoading: (state) => {
      state.loading.operations = {}
    },
    
    setGlobalError: (state, action: PayloadAction<string | null>) => {
      state.errors.global = action.payload
    },
    
    setFieldError: (state, action: PayloadAction<{ field: string; error: string }>) => {
      state.errors.field[action.payload.field] = action.payload.error
    },
    
    clearFieldError: (state, action: PayloadAction<string>) => {
      delete state.errors.field[action.payload]
    },
    
    clearAllFieldErrors: (state) => {
      state.errors.field = {}
    },
    
    clearAllErrors: (state) => {
      state.errors.global = null
      state.errors.field = {}
    },
    
    resetUiState: () => initialState
  }
})

export const {
  setTheme,
  toggleSidebar,
  setSidebarCollapsed,
  setActiveModal,
  addNotification,
  removeNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,
  setViewMode,
  setPageSize,
  toggleCompactMode,
  setCompactMode,
  setGlobalLoading,
  setOperationLoading,
  clearOperationLoading,
  clearAllOperationLoading,
  setGlobalError,
  setFieldError,
  clearFieldError,
  clearAllFieldErrors,
  clearAllErrors,
  resetUiState
} = uiSlice.actions

export default uiSlice.reducer

  export const selectUiState = (state: { ui: UiState }) => state.ui
export const selectTheme = (state: { ui: UiState }) => state.ui.theme
export const selectSidebarCollapsed = (state: { ui: UiState }) => state.ui.sidebarCollapsed
export const selectActiveModal = (state: { ui: UiState }) => state.ui.activeModal
export const selectNotifications = (state: { ui: UiState }) => state.ui.notifications
export const selectUnreadNotifications = (state: { ui: UiState }) => 
  state.ui.notifications.filter(n => !n.isRead)
export const selectLayout = (state: { ui: UiState }) => state.ui.layout
export const selectGlobalLoading = (state: { ui: UiState }) => state.ui.loading.global
export const selectOperationLoading = (operation: string) => (state: { ui: UiState }) => 
  state.ui.loading.operations[operation] || false
export const selectGlobalError = (state: { ui: UiState }) => state.ui.errors.global
export const selectFieldError = (field: string) => (state: { ui: UiState }) => 
  state.ui.errors.field[field]