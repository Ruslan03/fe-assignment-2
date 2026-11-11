import {
  combineReducers,
  type Reducer,
  type ReducersMapObject,
  type UnknownAction,
} from "@reduxjs/toolkit"

export interface ReducerManager<TState = Record<string, unknown>> {
  getReducerMap: () => ReducersMapObject
  reduce: (state: TState | undefined, action: UnknownAction) => TState
  add: (key: string, reducer: Reducer) => void
  remove: (key: string) => void
}

function buildCombinedReducer(reducers: ReducersMapObject): Reducer {
  if (Object.keys(reducers).length === 0) {
    return (state = {}) => state
  }
  return combineReducers(reducers)
}

/** Creates a dynamic Redux reducer manager for runtime slice injection and removal. */
export function createReducerManager<
  TInitialState extends object,
  TState extends object = TInitialState & Record<string, unknown>,
>(
  initialReducers: ReducersMapObject<TInitialState>
): ReducerManager<TState> {
  const reducers: ReducersMapObject = { ...initialReducers }
  let combinedReducer = buildCombinedReducer(reducers)
  let keysToRemove: string[] = []

  return {
    getReducerMap: () => reducers,

    reduce: (state, action) => {
      let nextState = state

      if (keysToRemove.length > 0) {
        if (nextState) {
          const cleanedState: Record<string, unknown> = {
            ...(nextState as Record<string, unknown>),
          }
          for (const key of keysToRemove) {
            delete cleanedState[key]
          }
          nextState = cleanedState as TState
        }
        keysToRemove = []
      }

      return combinedReducer(nextState, action) as TState
    },

    add: (key, reducer) => {
      if (!key || reducers[key]) return

      reducers[key] = reducer
      combinedReducer = buildCombinedReducer(reducers)
    },

    remove: (key) => {
      if (!key || !reducers[key]) return

      delete reducers[key]
      keysToRemove.push(key)
      combinedReducer = buildCombinedReducer(reducers)
    },
  }
}
