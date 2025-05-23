import React, { createContext, useContext } from 'react'

export type Hook<Value> = () => Value

export type Provider<Value> = ({
  children,
  initialValue
}: {
  children: React.ReactNode
  initialValue?: Value
}) => React.JSX.Element

export type CtxType<T> = readonly [Hook<T>, Provider<T>]

export function createCtx<T>(useHook: () => T): CtxType<T> {
  const ctx = createContext<T | undefined>(undefined)

  // XXX TODO FIXME: React hook rules?
  const useCtx = () => {
    const c = useContext(ctx)
    if (!c) {
      console.log('XXX =====> useCtx must be inside a Provider with a value')
      throw new Error('useCtx must be inside a Provider with a value')
    }
    return c
  }

  const Provider: Provider<T> = ({
    initialValue,
    children
  }: {
    children: React.ReactNode
    initialValue?: T | undefined
  }) => {
    const value = useHook()

    return <ctx.Provider value={initialValue ?? value}>{children}</ctx.Provider>
  }
  return [useCtx, Provider]
}
