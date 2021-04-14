import React, { createContext, useContext } from 'react'

export type CreateContextProps<Value> = {
  useHook: () => Value
}

export function createCtx<ContextType>(useHook: () => ContextType) {
  const ctx = createContext<ContextType | undefined>(undefined)

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
