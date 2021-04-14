import type {
  Location,
  LocationService,
  SequenceManagerService,
  TokenFactory,
  TrackingEvent
} from '@tmtsoftware/esw-ts'
import { SequenceManagerImpl } from '@tmtsoftware/esw-ts/lib/dist/src/clients/sequence-manager/SequenceManagerImpl'
import { HttpTransport } from '@tmtsoftware/esw-ts/lib/dist/src/utils/HttpTransport'
import {
  extractHostPort,
  getPostEndPoint
} from '@tmtsoftware/esw-ts/lib/dist/src/utils/Utils'
import { useCallback, useEffect, useState } from 'react'
import { SM_CONNECTION } from '../features/sm/constants'
import { useStream } from '../hooks/useStream'
import { createCtx } from './createCtx'
import { locationService, useServiceFactory } from './ServiceFactoryContext'
import { useAuth } from './useAuthContext'

export type SMContextType = [Location | undefined, boolean]

type SMContext = { smService: SequenceManagerService; smLocation: Location }

const mkSequenceManagerService = (
  tokenFactory: TokenFactory,
  location: Location
): SequenceManagerService => {
  const { host, port } = extractHostPort(location.uri)
  const postEndpoint = getPostEndPoint({ host, port })

  return new SequenceManagerImpl(new HttpTransport(postEndpoint, tokenFactory))
}

const trackSM = locationService.track(SM_CONNECTION)

const useSMService0 = (): [SMContext | undefined, boolean] => {
  const { auth } = useAuth()

  const memoisedSmCallback = useCallback(
    (event: TrackingEvent) => {
      const tokenFactory = auth !== null ? auth.token : () => undefined

      return event._type === 'LocationUpdated'
        ? {
            smService: mkSequenceManagerService(tokenFactory, event.location),
            smLocation: event.location
          }
        : undefined
    },
    [auth]
  )

  return useStream({
    mapper: memoisedSmCallback,
    run: trackSM
  })
}

export const [useSMService, SMServiceProvider] = createCtx(useSMService0)
