import type { Location, Connection, TokenFactory, TrackingEvent, ServiceError } from '@tmtsoftware/esw-ts'
import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useStream } from '../../hooks/useStream'
import { createTokenFactory } from '../../utils/createTokenFactory'
import { errorMessage } from '../../utils/message'
import { useLocationService } from '../LocationServiceContext'
import { createCtx, CtxType } from './createCtx'

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
  const [loading, setLoading] = useState(true)
  const locationService = useLocationService()
  const onEventCallback = useCallback(
    (event: TrackingEvent) => {
      if (event._type === 'LocationRemoved') return undefined

      return factory(event.location, createTokenFactory(auth))
    },
    [auth, factory]
  )
  const track = useCallback(
    (onEvent) =>
      locationService.track(connection)(onEvent, (error: ServiceError) => {
        errorMessage(error.message)
        setLoading(false)
      }),
    [connection, locationService]
  )

  const [value] = useStream({
    mapper: onEventCallback,
    run: track
  })

  useEffect(() => {
    locationService.find(connection).finally(() => setLoading(false))
  }, [connection, locationService])

  return [value, loading]
}
