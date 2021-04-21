import { ComponentId, Prefix } from '@tmtsoftware/esw-ts'

const smPrefix = new Prefix('ESW', 'sequence_manager')
const connectionType = 'Service'

export const OBS_MODE_CONFIG = 'smObsModeConfig.conf'
export const PROVISION_CONF_PATH = '/tmt/esw/smProvisionConfig.json'
export const SM_COMPONENT_ID = new ComponentId(smPrefix, connectionType)
