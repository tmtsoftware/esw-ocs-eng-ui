import type {
  AgentService,
  Location,
  TokenFactory,
  TrackingEvent
} from '@tmtsoftware/esw-ts'
import { AgentServiceImpl } from '@tmtsoftware/esw-ts/lib/dist/src/clients/agent-service/AgentServiceImpl'
import { HttpTransport } from '@tmtsoftware/esw-ts/lib/dist/src/utils/HttpTransport'
import {
  extractHostPort,
  getPostEndPoint
} from '@tmtsoftware/esw-ts/lib/dist/src/utils/Utils'
import { AGENT_SERVICE_CONNECTION } from '../features/sm/constants'
import { useStream } from '../hooks/useStream'
import { createCtx } from './createCtx'
import { locationService } from './ServiceFactoryContext'
import { useAuth } from './useAuthContext'

const mkAgentService = (
  tokenFactory: TokenFactory,
  location: Location
): AgentService => {
  const { host, port } = extractHostPort(location.uri)
  const postEndpoint = getPostEndPoint({ host, port })
  console.log('in agent service')
  return new AgentServiceImpl(new HttpTransport(postEndpoint, tokenFactory))
}

const _useAgentService = (): [AgentService | undefined, boolean] => {
  const { auth } = useAuth()
  const tokenFactory = auth !== null ? auth.token : () => undefined

  return useStream({
    mapper: trackAgentCb(tokenFactory),
    run: trackAgent()
  })
}

export const [useAgentService, AgentServiceProvider] = createCtx(
  _useAgentService
)

const trackAgentCb = (tokenFactory: TokenFactory) => (event: TrackingEvent) =>
  event._type === 'LocationUpdated'
    ? mkAgentService(tokenFactory, event.location)
    : undefined

const trackAgent = () => {
  console.log('inside trackagent')
  return locationService.track(AGENT_SERVICE_CONNECTION)
}
