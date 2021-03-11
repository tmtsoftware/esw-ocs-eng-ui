import {
  AgentService,
  ComponentId,
  ConfigService,
  LocationService,
  SequenceManagerService,
  SequencerService,
  TokenFactory
} from '@tmtsoftware/esw-ts'
import { createContext, useContext } from 'react'

export type ServiceFactoryContextType = {
  locationServiceFactory: () => LocationService
  agentServiceFactory: () => Promise<AgentService>
  configServiceFactory: () => Promise<ConfigService>
  smServiceFactory: () => Promise<SequenceManagerService>
  sequencerServiceFactory: (
    componentId: ComponentId
  ) => Promise<SequencerService>
}

const createServiceFactories = (
  tokenFactory: TokenFactory
): ServiceFactoryContextType => ({
  locationServiceFactory: () => LocationService(tokenFactory),
  agentServiceFactory: () => AgentService(tokenFactory),
  configServiceFactory: () => ConfigService(tokenFactory),
  smServiceFactory: () => SequenceManagerService(tokenFactory),
  sequencerServiceFactory: (componentId) =>
    SequencerService(componentId, tokenFactory)
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
