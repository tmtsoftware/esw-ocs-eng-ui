import React from 'react'
import { AgentServiceProvider } from './AgentServiceContext'
import { ConfigServiceProvider } from './ConfigServiceContext'
import { SMServiceProvider } from './SMContext'

export const CombinedServiceContext = ({
  children
}: {
  children: React.ReactNode
}) => (
  <AgentServiceProvider>
    <SMServiceProvider>
      <ConfigServiceProvider>
      {children}
      </ConfigServiceProvider>
    </SMServiceProvider>
  </AgentServiceProvider>
)
