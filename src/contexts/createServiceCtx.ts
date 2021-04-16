import type {
  Location,
  Connection,
  TokenFactory,
  TrackingEvent
} from '@tmtsoftware/esw-ts'
import { useCallback } from 'react'
import { useStream } from '../hooks/useStream'
import { createCtx, CtxType } from './createCtx'
import { useLocationService } from './LocationServiceContext'
import { useAuth } from './useAuthContext'

export const createServiceCtx = <T>(
  connection: Connection,
  factory: (location: Location, tokenFactory: TokenFactory) => T
): CtxType<[T | undefined, boolean]> => {
  const useHook = () => useService(connection, factory)

  return createCtx(useHook)
}

export const useService = <T>(
  connection: Connection,
  factory: (location: Location, tokenFactory: TokenFactory) => T
): [T | undefined, boolean] => {
  const { auth } = useAuth()
  const locationService = useLocationService()
  const onEventCallback = useCallback(
    (event: TrackingEvent) => {
      const tokenFactory = auth !== null ? auth.token : () => undefined
      if (event._type === 'LocationRemoved') return undefined

      return factory(event.location, tokenFactory)
    },
    [auth, factory]
  )

  const track = useCallback(
    (onEvent) => locationService.track(connection)(onEvent),
    [connection, locationService]
  )

  return useStream({
    mapper: onEventCallback,
    run: track
  })
}
