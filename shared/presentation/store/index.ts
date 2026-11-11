import { configureStore, type Reducer } from "@reduxjs/toolkit"

import { baseReducer, type BaseState } from "./base.slice"
import { createReducerManager } from "./reducer-manager"

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LazyLoadedSlices {}

export type RootState = {
  base: BaseState
} & Partial<LazyLoadedSlices>

export const reducerManager = createReducerManager<
  { base: BaseState },
  RootState
>({
  base: baseReducer,
})

export const store = Object.assign(
  configureStore({
    reducer: reducerManager.reduce,
  }),
  { reducerManager }
)

export function injectReducer(key: string, reducer: Reducer): void {
  if (reducerManager.getReducerMap()[key]) return
  reducerManager.add(key, reducer)
  store.replaceReducer(reducerManager.reduce)
}

export type AppDispatch = typeof store.dispatch
export { createReducerManager, type ReducerManager } from "./reducer-manager"
