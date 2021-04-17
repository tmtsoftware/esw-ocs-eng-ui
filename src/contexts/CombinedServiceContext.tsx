import React from 'react'
import { AgentServiceProvider } from './AgentServiceContext'
import { ConfigServiceProvider } from './ConfigServiceContext'
import { GatewayLocationProvider } from './GatewayServiceContext'
import { LocationServiceProvider } from './LocationServiceContext'
import { SMServiceProvider } from './SMContext'

export const CombinedServiceContext = ({
  children
}: {
  children: React.ReactNode
}): JSX.Element => (
  <LocationServiceProvider>
    <GatewayLocationProvider>
      <AgentServiceProvider>
        <SMServiceProvider>
          <ConfigServiceProvider>{children}</ConfigServiceProvider>
        </SMServiceProvider>
      </AgentServiceProvider>
    </GatewayLocationProvider>
  </LocationServiceProvider>
)
