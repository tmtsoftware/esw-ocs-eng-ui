import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AgentServiceProvider } from './AgentServiceContext'
import { GatewayLocationProvider } from './GatewayServiceContext'
import { LocationServiceProvider } from './LocationServiceContext'
import { SMServiceProvider } from './SMContext'

const queryClient = new QueryClient()

export const CombinedServiceContext = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <QueryClientProvider client={queryClient}>
    <LocationServiceProvider>
      <GatewayLocationProvider>
        <AgentServiceProvider>
          <SMServiceProvider>{children}</SMServiceProvider>
        </AgentServiceProvider>
      </GatewayLocationProvider>
    </LocationServiceProvider>
  </QueryClientProvider>
)
