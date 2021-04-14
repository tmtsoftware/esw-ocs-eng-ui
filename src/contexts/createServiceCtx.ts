import type {
  Location,
  Connection,
  TokenFactory,
  TrackingEvent
} from '@tmtsoftware/esw-ts'
import { useCallback } from 'react'
import { useStream } from '../hooks/useStream'
import { createCtx, CtxType } from './createCtx'
import { locationService } from './ServiceFactoryContext'
import { useAuth } from './useAuthContext'

export const createServiceCtx = <T>(
  connection: Connection,
  factory: (location: Location, tokenFactory: TokenFactory) => T
): CtxType<[T | undefined, boolean]> => {
  const useService = () => {
    const { auth } = useAuth()

    const onEventCallback = useCallback(
      (event: TrackingEvent) => {
        const tokenFactory = auth !== null ? auth.token : () => undefined
        if (event._type === 'LocationRemoved') return undefined

        return factory(event.location, tokenFactory)
      },
      [auth]
    )

    return useStream({
      mapper: onEventCallback,
      run: locationService.track(connection)
    })
  }

  return createCtx(useService)
}
