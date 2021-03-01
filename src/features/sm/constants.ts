import { AkkaConnection, ComponentId, Prefix } from '@tmtsoftware/esw-ts'

export const OBS_MODE_CONFIG = 'smObsModeConfig.conf'

const SM_PREFIX = new Prefix('ESW', 'sequence_manager')
const SM_CONN_TYPE = 'Service'
export const PROVISION_CONF_PATH = '/tmt/esw/smProvisionConfig.json'
export const SM_COMPONENT_ID = new ComponentId(SM_PREFIX, SM_CONN_TYPE)

export const SM_CONNECTION = AkkaConnection(SM_PREFIX, SM_CONN_TYPE)
