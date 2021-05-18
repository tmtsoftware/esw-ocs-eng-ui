import { render, RenderOptions, RenderResult } from '@testing-library/react'
import {
  AgentService,
  Auth,
  AuthContext,
  ConfigService,
  HttpLocation,
  LocationService,
  SequenceManagerService,
  SequencerService,
  GATEWAY_CONNECTION,
  SEQUENCE_MANAGER_CONNECTION
} from '@tmtsoftware/esw-ts'
import { AgentServiceImpl } from '@tmtsoftware/esw-ts/lib/dist/src/clients/agent-service/AgentServiceImpl'
import { ConfigServiceImpl } from '@tmtsoftware/esw-ts/lib/dist/src/clients/config-service/ConfigServiceImpl'
import { SequenceManagerImpl } from '@tmtsoftware/esw-ts/lib/dist/src/clients/sequence-manager/SequenceManagerImpl'
import { SequencerServiceImpl } from '@tmtsoftware/esw-ts/lib/dist/src/clients/sequencer/SequencerServiceImpl'
import 'antd/dist/antd.css'
import type {
  KeycloakProfile,
  KeycloakPromise,
  KeycloakResourceAccess,
  KeycloakRoles,
  KeycloakTokenParsed
} from 'keycloak-js'
import React, { ReactElement } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { anything, instance, mock, when } from 'ts-mockito'
import { AgentServiceProvider } from '../../src/contexts/AgentServiceContext'
import { GatewayLocationProvider } from '../../src/contexts/GatewayServiceContext'
import { LocationServiceProvider } from '../../src/contexts/LocationServiceContext'
import { SMServiceProvider } from '../../src/contexts/SMContext'

export const getMockAuth = (loggedIn: boolean): Auth => {
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
      ({
        preferred_username: loggedIn ? 'esw-user' : undefined
      } as KeycloakTokenParsed),
    realmAccess: () => [''] as unknown as KeycloakRoles,
    resourceAccess: () => [''] as unknown as KeycloakResourceAccess,
    loadUserProfile: () =>
      Promise.resolve({}) as KeycloakPromise<KeycloakProfile, void>
  }
}

type Services = {
  agentService: AgentService
  locationService: LocationService
  configService: ConfigService
  smService: SequenceManagerService
}

type MockServices = {
  instance: Services
  mock: Services
}

export const sequencerServiceMock = mock<SequencerService>(SequencerServiceImpl)
export const sequencerServiceInstance =
  instance<SequencerService>(sequencerServiceMock)

const getMockServices: () => MockServices = () => {
  const agentServiceMock = mock<AgentService>(AgentServiceImpl)
  const agentServiceInstance = instance<AgentService>(agentServiceMock)
  const locationServiceMock = mock<LocationService>()
  const locationServiceInstance = instance(locationServiceMock)

  when(locationServiceMock.track(anything())).thenReturn(() => {
    return {
      cancel: () => ({})
    }
  })
  when(locationServiceMock.find(anything())).thenResolve(undefined)

  const smServiceMock = mock<SequenceManagerService>(SequenceManagerImpl)
  const smServiceInstance = instance<SequenceManagerService>(smServiceMock)

  const configServiceMock = mock<ConfigService>(ConfigServiceImpl)
  const configServiceInstance = instance<ConfigService>(configServiceMock)
  return {
    mock: {
      agentService: agentServiceMock,
      locationService: locationServiceMock,
      configService: configServiceMock,
      smService: smServiceMock
    },
    instance: {
      agentService: agentServiceInstance,
      locationService: locationServiceInstance,
      configService: configServiceInstance,
      smService: smServiceInstance
    }
  }
}

export const mockServices = getMockServices()

const getContextProvider = (
  loggedIn: boolean,
  loginFunc: () => void,
  logoutFunc: () => void
) => {
  const auth = getMockAuth(loggedIn)
  const smLocation: HttpLocation = {
    _type: 'HttpLocation',
    connection: SEQUENCE_MANAGER_CONNECTION,
    uri: 'http://localhost:5000/',
    metadata: {
      agentPrefix: 'ESW.primary'
    }
  }
  const gatewayLocation: HttpLocation = {
    _type: 'HttpLocation',
    connection: GATEWAY_CONNECTION,
    uri: 'http://localhost:5000/',
    metadata: { agentPrefix: 'ESW.primary' }
  }
  const contextProvider = ({ children }: { children: React.ReactNode }) => (
    <AuthContext.Provider
      value={{
        auth: auth,
        login: loginFunc,
        logout: logoutFunc
      }}>
      <LocationServiceProvider
        initialValue={mockServices.instance.locationService}>
        <GatewayLocationProvider initialValue={[gatewayLocation, false]}>
          <AgentServiceProvider
            initialValue={[mockServices.instance.agentService, false]}>
            <SMServiceProvider
              initialValue={[
                { smService: mockServices.instance.smService, smLocation },
                false
              ]}>
              {children}
            </SMServiceProvider>
          </AgentServiceProvider>
        </GatewayLocationProvider>
      </LocationServiceProvider>
    </AuthContext.Provider>
  )

  return contextProvider
}

const getContextWithQueryClientProvider = (
  loggedIn: boolean,
  loginFunc: () => void = () => ({}),
  logoutFunc: () => void = () => ({})
): React.FC<{ children: React.ReactNode }> => {
  const queryClient = new QueryClient()
  const ContextProvider = getContextProvider(loggedIn, loginFunc, logoutFunc)

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
  loginFunc?: () => void
  logoutFunc?: () => void
}

const renderWithAuth = (
  { ui, loggedIn = true, loginFunc, logoutFunc }: MockProps,
  options?: Omit<RenderOptions, 'queries'>
): RenderResult => {
  return render(ui, {
    wrapper: getContextWithQueryClientProvider(
      loggedIn,
      loginFunc,
      logoutFunc
    ) as React.FunctionComponent<Record<string, unknown>>,
    ...options
  })
}

// eslint-disable-next-line import/export
export { renderWithAuth, getContextWithQueryClientProvider }
export type { MockServices }
