import {
  Location,
  SequenceManagerService,
  createSequenceManagerService,
  TokenFactory,
  SEQUENCE_MANAGER_CONNECTION
} from '@tmtsoftware/esw-ts'
import { createServiceCtx } from './utils/createServiceCtx'

export type SMContextType = [Location | undefined, boolean]

type SMContext = { smService: SequenceManagerService; smLocation: Location }

const mkSMContext = (location: Location, tf: TokenFactory): SMContext => ({
  smService: createSequenceManagerService(location, tf),
  smLocation: location
})

export const [useSMService, SMServiceProvider] = createServiceCtx(SEQUENCE_MANAGER_CONNECTION, mkSMContext)
