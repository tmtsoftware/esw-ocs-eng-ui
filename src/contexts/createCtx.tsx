import React, { createContext, useContext } from 'react'

export type CreateContextProps<Value> = {
  useHook: () => Value
}

export type Hook<T> = () => T
export type Provider = ({
  children
}: {
  children: React.ReactNode
}) => JSX.Element
export type CtxType<T> = readonly [Hook<T>, Provider]

export function createCtx<Value>(useHook: () => Value): CtxType<Value> {
  const ctx = createContext<Value | undefined>(undefined)

  const useCtx = () => {
    const c = useContext(ctx)
    if (!c) throw new Error('useCtx must be inside a Provider with a value')
    return c
  }

  const Provider = ({ children }: { children: React.ReactNode }) => {
    const value = useHook()
    return <ctx.Provider value={value}>{children}</ctx.Provider>
  }
  return [useCtx, Provider] as const
}
