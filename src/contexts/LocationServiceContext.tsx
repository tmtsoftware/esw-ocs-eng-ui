import { LocationService } from '@tmtsoftware/esw-ts'
import { createCtx } from './createCtx'

export const [useLocationService, LocationServiceProvider] = createCtx(() =>
  LocationService()
)
