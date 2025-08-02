import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from '@/app/store'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useNubanSelector = (selector: (state: RootState['nuban']) => any) =>
  useAppSelector((state) => selector(state.nuban))

export const useValidationSelector = (selector: (state: RootState['validation']) => any) =>
  useAppSelector((state) => selector(state.validation))

export const useFiltersSelector = (selector: (state: RootState['filters']) => any) =>
  useAppSelector((state) => selector(state.filters))

export const useUiSelector = (selector: (state: RootState['ui']) => any) =>
  useAppSelector((state) => selector(state.ui))