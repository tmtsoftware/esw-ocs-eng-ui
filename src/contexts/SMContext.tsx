import {
  Location,
  SequenceManagerService,
  createSequenceManagerService,
  TokenFactory
} from '@tmtsoftware/esw-ts'
import { SM_CONNECTION } from '../features/sm/constants'
import { createServiceCtx } from './utils/createServiceCtx'

export type SMContextType = [Location | undefined, boolean]

type SMContext = { smService: SequenceManagerService; smLocation: Location }

const mkSMContext = (loc: Location, tf: TokenFactory): SMContext => ({
  smService: createSequenceManagerService(loc, tf),
  smLocation: loc
})

export const [useSMService, SMServiceProvider] = createServiceCtx(
  SM_CONNECTION,
  mkSMContext
)
