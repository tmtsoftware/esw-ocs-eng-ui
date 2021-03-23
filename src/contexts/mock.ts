import type {
  AgentStatusResponse,
  HttpLocation,
  Step
} from '@tmtsoftware/esw-ts'
import {
  AgentStatus,
  ComponentId,
  ConfigData,
  ObsMode,
  Prefix,
  Setup
} from '@tmtsoftware/esw-ts'
import { AgentServiceImpl } from '@tmtsoftware/esw-ts/lib/dist/src/clients/agent-service/AgentServiceImpl'
import { ConfigServiceImpl } from '@tmtsoftware/esw-ts/lib/dist/src/clients/config-service/ConfigServiceImpl'
import { LocationServiceImpl } from '@tmtsoftware/esw-ts/lib/dist/src/clients/location/LocationServiceImpl'
import { SequenceManagerImpl } from '@tmtsoftware/esw-ts/lib/dist/src/clients/sequence-manager/SequenceManagerImpl'
import { SequencerServiceImpl } from '@tmtsoftware/esw-ts/lib/dist/src/clients/sequencer/SequencerServiceImpl'
import { sequenceManagerConnection } from '@tmtsoftware/esw-ts/lib/dist/src/config/Connections'
import type {
  ObsModeDetails,
  ObsModesDetailsResponseSuccess
} from '@tmtsoftware/esw-ts/lib/src/clients/sequence-manager/models/SequenceManagerRes'
import { instance, mock, when } from 'ts-mockito'
import { PROVISION_CONF_PATH } from '../features/sm/constants'
import type { ServiceFactoryContextType } from './ServiceFactoryContext'

const sequenceManagerMock = mock(SequenceManagerImpl)
const locationServiceMock = mock(LocationServiceImpl)
const sequencerServiceMock = mock(SequencerServiceImpl)
const agentServiceMock = mock(AgentServiceImpl)
const configServiceMock = mock(ConfigServiceImpl)

export const serviceFactoryMocks: ServiceFactoryContextType = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  sequencerServiceFactory: (componentId) =>
    Promise.resolve(instance(sequencerServiceMock)),
  locationServiceFactory: () => instance(locationServiceMock),
  agentServiceFactory: () => Promise.resolve(instance(agentServiceMock)),
  smServiceFactory: () => Promise.resolve(instance(sequenceManagerMock)),
  configServiceFactory: () => Promise.resolve(instance(configServiceMock))
}

const location = mock<HttpLocation>()
when(
  locationServiceMock.resolve(sequenceManagerConnection, 10, 'seconds')
).thenResolve(instance(location))

const obsModes: ObsModeDetails[] = [
  {
    obsMode: new ObsMode('IRIS_Darknight'),
    resources: ['ESW', 'AOESW'],
    sequencers: ['ESW', 'IRIS', 'TCS', 'AOESW'],
    status: {
      _type: 'Configured'
    }
  },
  {
    obsMode: new ObsMode('IRIS_Moonnight'),
    resources: ['ESW', 'AOESW'],
    sequencers: ['ESW', 'IRIS', 'TCS', 'AOESW'],
    status: {
      _type: 'Configured'
    }
  }
]

const obsModesDetails: ObsModesDetailsResponseSuccess = {
  _type: 'Success',
  obsModes: obsModes
}

const sequencerLoc = (prefix: string): HttpLocation => ({
  _type: 'HttpLocation',
  connection: {
    connectionType: 'http',
    prefix: Prefix.fromString(prefix),
    componentType: 'Sequencer'
  },
  uri: '',
  metadata: {}
})

when(sequenceManagerMock.getObsModesDetails()).thenResolve(obsModesDetails)
when(locationServiceMock.listByComponentType('Sequencer')).thenResolve([
  sequencerLoc('ESW.IRIS_Darknight'),
  sequencerLoc('IRIS.IRIS_Darknight'),
  sequencerLoc('TCS.IRIS_Darknight'),
  sequencerLoc('AOESW.IRIS_Darknight'),
  sequencerLoc('ESW.IRIS_Moonnight'),
  sequencerLoc('IRIS.IRIS_Moonnight'),
  sequencerLoc('TCS.IRIS_Moonnight'),
  sequencerLoc('AOESW.IRIS_Moonnight')
])

const stepList: Step[] = [
  {
    hasBreakpoint: true,
    status: { _type: 'Pending' },
    command: mock(Setup),
    id: ''
  },
  {
    hasBreakpoint: false,
    status: { _type: 'Pending' },
    command: mock(Setup),
    id: ''
  },
  {
    hasBreakpoint: false,
    status: { _type: 'Pending' },
    command: mock(Setup),
    id: ''
  },
  {
    hasBreakpoint: false,
    status: { _type: 'Pending' },
    command: mock(Setup),
    id: ''
  }
]

const provisionConf = {
  'ESW.machine1': 1,
  'TCS.machine1': 1
}

when(sequencerServiceMock.getSequence()).thenResolve(stepList)

when(configServiceMock.getActive(PROVISION_CONF_PATH)).thenResolve(
  ConfigData.fromString(JSON.stringify(provisionConf))
)

const agentStatus = (prefix: string): AgentStatus => ({
  agentId: new ComponentId(Prefix.fromString(prefix), 'Machine'),
  seqCompsStatus: [
    {
      seqCompId: new ComponentId(
        Prefix.fromString('ESW.ESW1'),
        'SequenceComponent'
      ),
      sequencerLocation: [
        {
          _type: 'AkkaLocation',
          connection: {
            componentType: 'Sequencer',
            connectionType: 'akka',
            prefix: Prefix.fromString('ESW.darkNight')
          },
          metadata: {},
          uri: ''
        }
      ]
    },
    {
      seqCompId: new ComponentId(
        Prefix.fromString('ESW.ESW2'),
        'SequenceComponent'
      ),
      sequencerLocation: []
    }
  ]
})

const agentStatusRes: AgentStatusResponse = {
  _type: 'Success',
  agentStatus: [
    agentStatus('ESW.machine1'),
    agentStatus('TCS.machine1'),
    agentStatus('TCS.machine2')
  ],
  seqCompsWithoutAgent: []
}

const agentStatusFailedRes: AgentStatusResponse = {
  _type: 'LocationServiceError',
  reason: ''
}

when(agentServiceMock.getAgentStatus()).thenResolve(agentStatusRes)
