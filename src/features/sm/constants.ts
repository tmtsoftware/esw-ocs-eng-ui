import {
  AkkaConnection,
  ComponentId,
  HttpConnection,
  Prefix
} from '@tmtsoftware/esw-ts'

const smPrefix = new Prefix('ESW', 'sequence_manager')
const agentPrefix = new Prefix('ESW', 'agent_service')
const configPrefix = new Prefix('CSW', 'ConfigServer')
const connectionType = 'Service'

export const OBS_MODE_CONFIG = 'smObsModeConfig.conf'
export const PROVISION_CONF_PATH = '/tmt/esw/smProvisionConfig.json'
export const SM_COMPONENT_ID = new ComponentId(smPrefix, connectionType)
export const SM_CONNECTION = HttpConnection(smPrefix, connectionType)

export const AGENT_SERVICE_CONNECTION = HttpConnection(
  agentPrefix,
  connectionType
)

export const CONFIG_SERVICE_CONNECTION = HttpConnection(
  configPrefix,
  connectionType
)
