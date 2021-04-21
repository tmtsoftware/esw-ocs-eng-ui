import { Location, GATEWAY_CONNECTION } from '@tmtsoftware/esw-ts'
import { createServiceCtx } from './utils/createServiceCtx'

export const [useGatewayLocation, GatewayLocationProvider] = createServiceCtx(
  GATEWAY_CONNECTION,
  (loc: Location) => loc
)
