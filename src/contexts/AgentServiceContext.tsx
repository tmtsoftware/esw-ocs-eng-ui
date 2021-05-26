import { createAgentService, AGENT_SERVICE_CONNECTION } from '@tmtsoftware/esw-ts'
import { createServiceCtx } from './utils/createServiceCtx'

export const [useAgentService, AgentServiceProvider] = createServiceCtx(AGENT_SERVICE_CONNECTION, createAgentService)
