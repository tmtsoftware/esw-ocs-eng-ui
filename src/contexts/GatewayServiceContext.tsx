import type { Location } from '@tmtsoftware/esw-ts'
import { GATEWAY_CONNECTION } from '../features/sm/constants'
import { createServiceCtx } from './createServiceCtx'

export const [useGatewayLocation, GatewayLocationProvider] = createServiceCtx(
  GATEWAY_CONNECTION,
  (loc: Location) => loc
)
