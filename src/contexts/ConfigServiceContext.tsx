import { createConfigService } from '@tmtsoftware/esw-ts'
import { CONFIG_SERVICE_CONNECTION } from '../features/sm/constants'
import { createServiceCtx } from './utils/createServiceCtx'

export const [useConfigService, ConfigServiceProvider] = createServiceCtx(
  CONFIG_SERVICE_CONNECTION,
  createConfigService
)
