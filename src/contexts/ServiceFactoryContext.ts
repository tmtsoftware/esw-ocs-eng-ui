import {
  AgentService,
  ConfigService,
  LocationService,
  SequenceManagerService,
  TokenFactory
} from '@tmtsoftware/esw-ts'
import { createContext, useContext } from 'react'

export type ServiceFactoryContextType = {
  locationServiceFactory: () => LocationService
  agentServiceFactory: () => Promise<AgentService>
  configServiceFactory: () => Promise<ConfigService>
  smServiceFactory: () => Promise<SequenceManagerService>
}

const createServiceFactories = (
  tokenFactory: TokenFactory
): ServiceFactoryContextType => ({
  locationServiceFactory: () => LocationService(),
  agentServiceFactory: () => AgentService(tokenFactory),
  configServiceFactory: () => ConfigService(tokenFactory),
  smServiceFactory: () => SequenceManagerService(tokenFactory)
})

const defaultServiceFactories = createServiceFactories(() => undefined)
const ServiceFactoryContext = createContext(defaultServiceFactories)

const useServiceFactory = (): ServiceFactoryContextType => {
  const context = useContext(ServiceFactoryContext)
  if (context === undefined) {
    throw new Error(
      'useServiceFactory must be used within a ServiceFactoryContext'
    )
  }
  return context
}
const ServiceFactoryProvider = ServiceFactoryContext.Provider

export { ServiceFactoryProvider, useServiceFactory, createServiceFactories }
