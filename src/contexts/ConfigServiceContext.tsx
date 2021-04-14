import type { ConfigService, Location, TokenFactory } from '@tmtsoftware/esw-ts'
import { ConfigServiceImpl } from '@tmtsoftware/esw-ts/lib/dist/src/clients/config-service/ConfigServiceImpl'
import { extractHostPort } from '@tmtsoftware/esw-ts/lib/dist/src/utils/Utils'
import { CONFIG_SERVICE_CONNECTION } from '../features/sm/constants'
import { createServiceCtx } from './createServiceCtx'

const mkConfigService = (loc: Location, tf: TokenFactory): ConfigService => {
  const { host, port } = extractHostPort(loc.uri)
  return new ConfigServiceImpl(host, port, tf)
}

export const [useConfigService, ConfigServiceProvider] = createServiceCtx(
  CONFIG_SERVICE_CONNECTION,
  mkConfigService
)
