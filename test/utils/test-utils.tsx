import { render } from '@testing-library/react'
import type { RenderOptions, RenderResult } from '@testing-library/react'
import {
  AuthContext,
  ComponentId,
  GATEWAY_CONNECTION,
  Prefix,
  SEQUENCE_MANAGER_CONNECTION,
  setAppName,
  TestUtils
} from '@tmtsoftware/esw-ts'
import type {
  AgentService,
  AgentStatus,
  Auth,
  ConfigService,
  HttpLocation,
  LocationService,
  SequenceManagerService,
  SequencerService,
  Subsystem
} from '@tmtsoftware/esw-ts'
import { Menu } from 'antd'
import 'antd/dist/antd.css'
import React, { ReactElement } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { anything, instance, mock, when } from 'ts-mockito'
import { AgentServiceProvider } from '../../src/contexts/AgentServiceContext'
import { GatewayLocationProvider } from '../../src/contexts/GatewayServiceContext'
import { LocationServiceProvider } from '../../src/contexts/LocationServiceContext'
import { SMServiceProvider } from '../../src/contexts/SMContext'
import {
  defaultStepListTableContext,
  StepListContextProvider
} from '../../src/features/sequencer/hooks/useStepListContext'
import type { StepListTableContextType } from '../../src/features/sequencer/hooks/useStepListContext'

export const getMockAuth = (loggedIn: boolean): Auth => {
  let loggedInValue = loggedIn
  return {
    hasRealmRole: () => true,
    hasResourceRole: () => false,
    isAuthenticated: () => loggedInValue,
    logout: () => {
      loggedInValue = false
      return Promise.resolve() as TestUtils.KeycloakPromise<void, void>
    },
    token: () => 'token string',
    tokenParsed: () =>
      ({
        preferred_username: loggedIn ? 'esw-user' : undefined
      } as TestUtils.KeycloakTokenParsed),
    realmAccess: () => [''] as unknown as TestUtils.KeycloakRoles,
    resourceAccess: () => [''] as unknown as TestUtils.KeycloakResourceAccess,
    loadUserProfile: () => Promise.resolve({}) as TestUtils.KeycloakPromise<TestUtils.KeycloakProfile, void>
  }
}

setAppName('esw-ocs-eng-ui-test')

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

export const sequencerServiceMock = mock<SequencerService>(TestUtils.SequencerServiceImpl)
export const sequencerServiceMockIris = mock<SequencerService>(TestUtils.SequencerServiceImpl)
export const sequencerServiceMockTcs = mock<SequencerService>(TestUtils.SequencerServiceImpl)

export const sequencerServiceInstance = instance<SequencerService>(sequencerServiceMock)
export const sequencerServiceInstanceIris = instance<SequencerService>(sequencerServiceMockIris)
export const sequencerServiceInstanceTcs = instance<SequencerService>(sequencerServiceMockTcs)

const getMockServices: () => MockServices = () => {
  const agentServiceMock = mock<AgentService>(TestUtils.AgentServiceImpl)
  const agentServiceInstance = instance<AgentService>(agentServiceMock)
  const locationServiceMock = mock<LocationService>()
  const locationServiceInstance = instance(locationServiceMock)

  when(locationServiceMock.track(anything())).thenReturn(() => {
    return {
      cancel: () => ({})
    }
  })
  when(locationServiceMock.find(anything())).thenResolve(undefined)

  const smServiceMock = mock<SequenceManagerService>(TestUtils.SequenceManagerImpl)
  const smServiceInstance = instance<SequenceManagerService>(smServiceMock)

  const configServiceMock = mock<ConfigService>(TestUtils.ConfigServiceImpl)
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

export const getAgentStatusMock = (subsystem: Subsystem = 'ESW'): AgentStatus => {
  return {
    agentId: new ComponentId(Prefix.fromString('ESW.machine1'), 'Machine'),
    seqCompsStatus: [
      {
        seqCompId: new ComponentId(Prefix.fromString('ESW.ESW1'), 'SequenceComponent'),
        sequencerLocation: [
          {
            _type: 'AkkaLocation',
            connection: {
              componentType: 'Sequencer',
              connectionType: 'akka',
              prefix: Prefix.fromString(`${subsystem}.darkNight`)
            },
            metadata: {},
            uri: ''
          }
        ]
      },
      {
        seqCompId: new ComponentId(Prefix.fromString('ESW.ESW2'), 'SequenceComponent'),
        sequencerLocation: []
      }
    ]
  }
}

const getContextProvider = (loggedIn: boolean, loginFunc: () => void, logoutFunc: () => void) => {
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
      <LocationServiceProvider locationService={mockServices.instance.locationService}>
        <GatewayLocationProvider initialValue={[gatewayLocation, false]}>
          <AgentServiceProvider initialValue={[mockServices.instance.agentService, false]}>
            <SMServiceProvider initialValue={[{ smService: mockServices.instance.smService, smLocation }, false]}>
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
    <QueryClientProvider client={queryClient}>
      <ContextProvider>{children}</ContextProvider>
    </QueryClientProvider>
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
    wrapper: getContextWithQueryClientProvider(loggedIn, loginFunc, logoutFunc) as React.FunctionComponent<
      Record<string, unknown>
    >,
    ...options
  })
}

const MenuWithStepListContext = ({
  menuItem,
  value = {
    setFollowProgress: () => undefined,
    handleDuplicate: () => undefined,
    isDuplicateEnabled: false,
    stepListStatus: 'In Progress',
    sequencerService: sequencerServiceInstance
  }
}: {
  menuItem: JSX.Element
  value?: StepListTableContextType
}): JSX.Element => {
  const MenuComponent = () => <Menu>{menuItem}</Menu>
  return (
    <StepListContextProvider value={value}>
      <MenuComponent />
    </StepListContextProvider>
  )
}

export const renderWithStepListContext = (element: React.ReactNode): RenderResult =>
  renderWithAuth({
    ui: (
      <StepListContextProvider value={{ ...defaultStepListTableContext, sequencerService: sequencerServiceInstance }}>
        {element}
      </StepListContextProvider>
    )
  })
// eslint-disable-next-line import/export
export { renderWithAuth, getContextWithQueryClientProvider, MenuWithStepListContext }
export type { MockServices }
