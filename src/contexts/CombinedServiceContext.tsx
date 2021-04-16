import React from 'react'
import { AgentServiceProvider } from './AgentServiceContext'
import { ConfigServiceProvider } from './ConfigServiceContext'
import { LocationServiceProvider } from './LocationServiceContext'
import { SMServiceProvider } from './SMContext'

export const CombinedServiceContext = ({
  children
}: {
  children: React.ReactNode
}): JSX.Element => (
  <LocationServiceProvider>
    <AgentServiceProvider>
      <SMServiceProvider>
        <ConfigServiceProvider>{children}</ConfigServiceProvider>
      </SMServiceProvider>
    </AgentServiceProvider>
  </LocationServiceProvider>
)
