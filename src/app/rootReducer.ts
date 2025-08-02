// src/app/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit'

// Feature reducers
import nubanReducer from '@/features/nuban/store/nubanSlice'
import validationReducer from '@/features/validation/store/validationSlice'
import filtersReducer from '@/features/filters/store/filtersSlice'
import uiReducer from '@/features/ui/store/uiSlice'

const rootReducer = combineReducers({
  nuban: nubanReducer,
  validation: validationReducer,
  filters: filtersReducer,
  ui: uiReducer,
})

export default rootReducer

// Remove this line - RootState should only be defined in store.ts
// export type RootState = ReturnType<typeof rootReducer>