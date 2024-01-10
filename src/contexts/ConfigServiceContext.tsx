import { createConfigService, CONFIG_CONNECTION } from '@tmtsoftware/esw-ts'
import { createServiceCtx } from './utils/createServiceCtx'

console.log('XXX in ConfigServiceContext')

export const [useConfigService, ConfigServiceProvider] = createServiceCtx(CONFIG_CONNECTION, createConfigService)
