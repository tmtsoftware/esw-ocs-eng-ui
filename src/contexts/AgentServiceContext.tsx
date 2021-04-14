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
import { useCallback } from 'react'
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

const trackAgent = locationService.track(AGENT_SERVICE_CONNECTION)

const useAgentService0 = (): [AgentService | undefined, boolean] => {
  const { auth } = useAuth()

  const memoisedAgentCb = useCallback(
    (event: TrackingEvent) => {
      const tokenFactory = auth !== null ? auth.token : () => undefined
      return event._type === 'LocationUpdated'
        ? mkAgentService(tokenFactory, event.location)
        : undefined
    },
    [auth]
  )

  return useStream({
    mapper: memoisedAgentCb,
    run: trackAgent
  })
}

export const [useAgentService, AgentServiceProvider] = createCtx(
  useAgentService0
)
