import React, { createContext, useContext } from 'react'

export type CreateContextProps<Value> = {
  useHook: () => Value
}

export type Hook<T> = () => T
export type Provider<Value> = ({
  children,
  initialValue
}: {
  children: React.ReactNode
  initialValue?: Value
}) => JSX.Element
export type CtxType<T> = readonly [Hook<T>, Provider<T>]

export function createCtx<Value>(useHook: () => Value): CtxType<Value> {
  const ctx = createContext<Value | undefined>(undefined)

  const useCtx = () => {
    const c = useContext(ctx)
    if (!c) throw new Error('useCtx must be inside a Provider with a value')
    return c
  }

  const Provider: Provider<Value> = ({
    initialValue,
    children
  }: {
    children: React.ReactNode
    initialValue?: Value | undefined
  }) => {
    const value = useHook()

    return <ctx.Provider value={initialValue ?? value}>{children}</ctx.Provider>
  }
  return [useCtx, Provider] as const
}
