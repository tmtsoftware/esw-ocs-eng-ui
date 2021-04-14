import { render, RenderOptions, RenderResult } from '@testing-library/react'
import {
  AgentService,
  AuthContext,
  ConfigService,
  LocationService,
  SequenceManagerService,
  SequencerService
} from '@tmtsoftware/esw-ts'
import { AgentServiceImpl } from '@tmtsoftware/esw-ts/lib/dist/src/clients/agent-service/AgentServiceImpl'
import { ConfigServiceImpl } from '@tmtsoftware/esw-ts/lib/dist/src/clients/config-service/ConfigServiceImpl'
import { SequenceManagerImpl } from '@tmtsoftware/esw-ts/lib/dist/src/clients/sequence-manager/SequenceManagerImpl'
import { SequencerServiceImpl } from '@tmtsoftware/esw-ts/lib/dist/src/clients/sequencer/SequencerServiceImpl'
import type {
  KeycloakProfile,
  KeycloakPromise,
  KeycloakResourceAccess,
  KeycloakRoles,
  KeycloakTokenParsed
} from 'keycloak-js'
import React, { ReactElement } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { instance, mock } from 'ts-mockito'
import {
  ServiceFactoryContextType,
  ServiceFactoryProvider
} from '../../src/contexts/ServiceFactoryContext'
import 'antd/dist/antd.css'

const getMockAuth = (loggedIn: boolean) => {
  let loggedInValue = loggedIn
  return {
    hasRealmRole: () => true,
    hasResourceRole: () => false,
    isAuthenticated: () => loggedInValue,
    logout: () => {
      loggedInValue = false
      return Promise.resolve() as KeycloakPromise<void, void>
    },
    token: () => 'token string',
    tokenParsed: () =>
      ({ preferred_username: 'esw-user' } as KeycloakTokenParsed),
    realmAccess: () => ([''] as unknown) as KeycloakRoles,
    resourceAccess: () => ([''] as unknown) as KeycloakResourceAccess,
    loadUserProfile: () =>
      Promise.resolve({}) as KeycloakPromise<KeycloakProfile, void>
  }
}

type Services = {
  agentService: AgentService
  locationService: LocationService
  configService: ConfigService
  smService: SequenceManagerService
  sequencerService: SequencerService
}

type MockServices = {
  serviceFactoryContext: ServiceFactoryContextType
  instance: Services
  mock: Services
}

const getMockServices: () => MockServices = () => {
  const agentServiceMock = mock<AgentService>(AgentServiceImpl)
  const agentServiceInstance = instance<AgentService>(agentServiceMock)
  const locationServiceMock = mock<LocationService>()
  const locationServiceInstance = instance(locationServiceMock)

  const smServiceMock = mock<SequenceManagerService>(SequenceManagerImpl)
  const smServiceInstance = instance<SequenceManagerService>(smServiceMock)

  const configServiceMock = mock<ConfigService>(ConfigServiceImpl)
  const configServiceInstance = instance<ConfigService>(configServiceMock)

  const sequencerServiceMock = mock<SequencerService>(SequencerServiceImpl)
  const sequencerServiceInstance = instance<SequencerService>(
    sequencerServiceMock
  )

  const serviceFactoryContext: ServiceFactoryContextType = {
    sequencerServiceFactory: () => Promise.resolve(sequencerServiceInstance)
  }

  return {
    serviceFactoryContext,
    mock: {
      agentService: agentServiceMock,
      locationService: locationServiceMock,
      configService: configServiceMock,
      smService: smServiceMock,
      sequencerService: sequencerServiceMock
    },
    instance: {
      agentService: agentServiceInstance,
      locationService: locationServiceInstance,
      configService: configServiceInstance,
      smService: smServiceInstance,
      sequencerService: sequencerServiceInstance
    }
  }
}

const getContextProvider = (
  loggedIn: boolean,
  mockClients: ServiceFactoryContextType,
  loginFunc: () => void,
  logoutFunc: () => void
) => {
  const auth = getMockAuth(loggedIn)

  const contextProvider = ({ children }: { children: React.ReactNode }) => (
    <AuthContext.Provider
      value={{
        auth: auth,
        login: loginFunc,
        logout: logoutFunc
      }}>
      <ServiceFactoryProvider value={mockClients}>
        {children}
      </ServiceFactoryProvider>
    </AuthContext.Provider>
  )

  return contextProvider
}

const getContextWithQueryClientProvider = (
  loggedIn: boolean,
  mockClients: ServiceFactoryContextType,
  loginFunc: () => void = () => ({}),
  logoutFunc: () => void = () => ({})
): React.FC<{ children: React.ReactNode }> => {
  const queryClient = new QueryClient()
  const ContextProvider = getContextProvider(
    loggedIn,
    mockClients,
    loginFunc,
    logoutFunc
  )

  const provider = ({ children }: { children: React.ReactNode }) => (
    <ContextProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ContextProvider>
  )
  return provider
}

type MockProps = {
  ui: ReactElement
  loggedIn?: boolean
  mockClients?: ServiceFactoryContextType
  loginFunc?: () => void
  logoutFunc?: () => void
}

const renderWithAuth = (
  {
    ui,
    loggedIn = true,
    mockClients = getMockServices().serviceFactoryContext,
    loginFunc,
    logoutFunc
  }: MockProps,
  options?: Omit<RenderOptions, 'queries'>
): RenderResult => {
  return render(ui, {
    wrapper: getContextWithQueryClientProvider(
      loggedIn,
      mockClients,
      loginFunc,
      logoutFunc
    ) as React.FunctionComponent<Record<string, unknown>>,
    ...options
  })
}

// eslint-disable-next-line import/export
export { renderWithAuth, getMockServices, getContextWithQueryClientProvider }
export type { MockServices }
