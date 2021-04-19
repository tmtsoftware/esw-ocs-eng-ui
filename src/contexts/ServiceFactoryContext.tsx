import {
  ComponentId,
  SequencerService,
  TokenFactory
} from '@tmtsoftware/esw-ts'
import { createContext, useContext } from 'react'

export type ServiceFactoryContextType = {
  sequencerServiceFactory: (
    componentId: ComponentId
  ) => Promise<SequencerService>
}

export const createServiceFactories = (
  tokenFactory: TokenFactory
): ServiceFactoryContextType => ({
  sequencerServiceFactory: (componentId) =>
    SequencerService(componentId, tokenFactory)
})

const defaultServiceFactories = createServiceFactories(() => undefined)
const ServiceFactoryContext = createContext(defaultServiceFactories)

export const useServiceFactory = (): ServiceFactoryContextType => {
  const context = useContext(ServiceFactoryContext)
  if (context === undefined) {
    throw new Error(
      'useServiceFactory must be used within a ServiceFactoryContext'
    )
  }
  return context
}
export const ServiceFactoryProvider = ServiceFactoryContext.Provider
