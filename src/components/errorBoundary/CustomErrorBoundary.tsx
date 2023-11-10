import { QueryErrorResetBoundary } from '@tanstack/react-query'
import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from './ErrorFallback'

export const CustomErrorBoundary = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
