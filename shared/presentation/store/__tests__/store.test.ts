import { createSlice } from "@reduxjs/toolkit"
import { describe, expect, it, vi } from "vitest"

import { baseReducer } from "../base.slice"
import { createReducerManager, injectReducer, store } from "../index"

const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1
    },
  },
})

describe("store and reducerManager", () => {
  it("initializes base reducer with app version", () => {
    expect(store.getState().base).toEqual({
      version: "0.0.1",
    })
  })

  it("supports adding, removing, and re-adding reducers via createReducerManager", () => {
    const manager = createReducerManager({ base: baseReducer })

    expect(Object.keys(manager.getReducerMap())).toEqual(["base"])

    let state = manager.reduce(undefined, { type: "@@INIT" })
    expect(state).toEqual({ base: { version: "0.0.1" } })

    manager.add("counter", counterSlice.reducer)
    manager.add("", counterSlice.reducer)
    manager.add("counter", counterSlice.reducer)
    expect(Object.keys(manager.getReducerMap())).toEqual(["base", "counter"])

    state = manager.reduce(state, counterSlice.actions.increment())
    expect(state).toEqual({
      base: { version: "0.0.1" },
      counter: { value: 1 },
    })

    manager.remove("unknown")
    manager.remove("counter")
    expect(Object.keys(manager.getReducerMap())).toEqual(["base"])

    state = manager.reduce(state, { type: "CLEANUP" })
    expect(state).toEqual({ base: { version: "0.0.1" } })

    manager.add("counter", counterSlice.reducer)
    state = manager.reduce(state, counterSlice.actions.increment())
    expect(state).toEqual({
      base: { version: "0.0.1" },
      counter: { value: 1 },
    })

    // Re-adding immediately after remove should reset stale slice state
    manager.remove("counter")
    manager.add("counter", counterSlice.reducer)
    state = manager.reduce(state, { type: "RESET" })
    expect(state).toEqual({
      base: { version: "0.0.1" },
      counter: { value: 0 },
    })

    manager.remove("counter")
    manager.remove("base")
    expect(Object.keys(manager.getReducerMap())).toEqual([])
    expect(manager.reduce(undefined, { type: "EMPTY" })).toEqual({})
  })

  it("integrates injectReducer and reducerManager with the configured store", () => {
    const replaceSpy = vi.spyOn(store, "replaceReducer")

    injectReducer("counter", counterSlice.reducer)
    injectReducer("counter", counterSlice.reducer)
    expect(replaceSpy).toHaveBeenCalledTimes(1)

    store.dispatch(counterSlice.actions.increment())
    expect((store.getState() as Record<string, unknown>).counter).toEqual({
      value: 1,
    })

    store.reducerManager.remove("counter")
    store.dispatch({ type: "CLEANUP" })
    expect((store.getState() as Record<string, unknown>).counter).toBeUndefined()

    replaceSpy.mockRestore()
  })
})
