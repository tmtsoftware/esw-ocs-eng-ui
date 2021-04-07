import {
  AkkaConnection,
  ComponentId,
  HttpConnection,
  Prefix
} from '@tmtsoftware/esw-ts'

const smPrefix = new Prefix('ESW', 'sequence_manager')
const agentServicePrefix = new Prefix('ESW', 'agent_service')
const serviceType = 'Service'

export const OBS_MODE_CONFIG = 'smObsModeConfig.conf'
export const PROVISION_CONF_PATH = '/tmt/esw/smProvisionConfig.json'
export const SM_COMPONENT_ID = new ComponentId(smPrefix, serviceType)
export const SM_CONNECTION = AkkaConnection(smPrefix, serviceType)
export const AGENT_SERVICE_CONNECTION = HttpConnection(
  agentServicePrefix,
  serviceType
)
