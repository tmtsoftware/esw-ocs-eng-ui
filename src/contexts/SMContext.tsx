import type {
  Location,
  SequenceManagerService,
  TokenFactory
} from '@tmtsoftware/esw-ts'
import { SequenceManagerImpl } from '@tmtsoftware/esw-ts/lib/dist/src/clients/sequence-manager/SequenceManagerImpl'
import { HttpTransport } from '@tmtsoftware/esw-ts/lib/dist/src/utils/HttpTransport'
import {
  extractHostPort,
  getPostEndPoint
} from '@tmtsoftware/esw-ts/lib/dist/src/utils/Utils'
import { SM_CONNECTION } from '../features/sm/constants'
import { createServiceCtx } from './createServiceCtx'

export type SMContextType = [Location | undefined, boolean]

type SMContext = { smService: SequenceManagerService; smLocation: Location }

const mkSMService = (
  loc: Location,
  tf: TokenFactory
): SequenceManagerService => {
  const { host, port } = extractHostPort(loc.uri)
  const postEndpoint = getPostEndPoint({ host, port })

  return new SequenceManagerImpl(new HttpTransport(postEndpoint, tf))
}
const mkSMContext = (loc: Location, tf: TokenFactory): SMContext => ({
  smService: mkSMService(loc, tf),
  smLocation: loc
})

export const [useSMService, SMServiceProvider] = createServiceCtx(
  SM_CONNECTION,
  mkSMContext
)
