import {
  ComponentId,
  LocationService,
  SequencerService,
  TokenFactory
} from '@tmtsoftware/esw-ts'
import { createContext, useContext } from 'react'

export const locationService = LocationService()

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

//-----------------------//-----------------------//-----------------------//-----------------------//
// kept this commented section for reference
// export type ServiceInstanceContextType = {
//   //used across all three pages
//   agentService: AgentService | undefined
//   //used only in provision button
//   configService: ConfigService | undefined
//   //used in home & infra page
//   smService: SequenceManagerService | undefined
//   //used in home & infra page
//   smLocation: Location | undefined

//   loading: boolean
// }

// Service instances via location track api

// current implementation of having all services in one context
// re renders all consumers of the context even if they are not using the state which got updated
// to solve this rerender issue : useMemo at particular component can be used / use-context-selector package

// other approach to accomplish the same
// create context for each service in esw-ts  & use it something like this
// <AgentServiceProvider>
//    <ConfigServiceProvider>
//       ....
//    </ConfigServiceProvider>
// </AgentServiceProvider>
