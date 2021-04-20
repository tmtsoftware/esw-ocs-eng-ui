import { createAgentService } from '@tmtsoftware/esw-ts'
import { AGENT_SERVICE_CONNECTION } from '../features/sm/constants'
import { createServiceCtx } from './utils/createServiceCtx'

export const [useAgentService, AgentServiceProvider] = createServiceCtx(
  AGENT_SERVICE_CONNECTION,
  createAgentService
)
