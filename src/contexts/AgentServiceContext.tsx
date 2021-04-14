import type { AgentService, Location, TokenFactory } from '@tmtsoftware/esw-ts'
import { AgentServiceImpl } from '@tmtsoftware/esw-ts/lib/dist/src/clients/agent-service/AgentServiceImpl'
import { HttpTransport } from '@tmtsoftware/esw-ts/lib/dist/src/utils/HttpTransport'
import {
  extractHostPort,
  getPostEndPoint
} from '@tmtsoftware/esw-ts/lib/dist/src/utils/Utils'
import { AGENT_SERVICE_CONNECTION } from '../features/sm/constants'
import { createServiceCtx } from './createServiceCtx'

const mkAgentSerice = (
  location: Location,
  tokenFactory: TokenFactory
): AgentService => {
  const { host, port } = extractHostPort(location.uri)
  const postEndpoint = getPostEndPoint({ host, port })
  return new AgentServiceImpl(new HttpTransport(postEndpoint, tokenFactory))
}

export const [useAgentService, AgentServiceProvider] = createServiceCtx(
  AGENT_SERVICE_CONNECTION,
  mkAgentSerice
)
