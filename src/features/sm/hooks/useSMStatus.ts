import type { Location, Option, TrackingEvent } from '@tmtsoftware/esw-ts'
import { useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'
import { useServiceFactory } from '../../../contexts/ServiceFactoryContext'
import { useQuery, UseQueryResult } from '../../../hooks/useQuery'
import { SM_STATUS } from '../../queryKeys'
import { SM_CONNECTION } from '../constants'

export const useSMStatus = (): UseQueryResult<Option<Location>, unknown> => {
  const qc = useQueryClient()
  const cache = qc.getQueryCache().find(SM_STATUS.key)
  return useQuery(SM_STATUS.key, () => cache?.state.data)
}

export const useSMTrack = (): void => {
  const qc = useQueryClient()
  const { locationServiceFactory } = useServiceFactory()

  useEffect(() => {
    const callback = async (trackingEvent: TrackingEvent) => {
      console.log('inside callback', trackingEvent)
      if (trackingEvent._type === 'LocationRemoved') {
        qc.setQueryData(SM_STATUS.key, undefined)
      } else {
        qc.setQueryData(SM_STATUS.key, trackingEvent.location)
      }
    }
    const sub = locationServiceFactory().track(SM_CONNECTION)(callback)

    return sub.cancel
  }, [locationServiceFactory, qc])
}

// ______________________________________________________ //

// export const useSMTrack2 = (): Location | undefined => {
//   const { locationServiceFactory } = useServiceFactory()
//   const [location, setLocation] = useState<Location | undefined>(undefined)

//   useEffect(() => {
//     const callback = async (trackingEvent: TrackingEvent) => {
//       if (trackingEvent._type === 'LocationRemoved') {
//         setLocation(undefined)
//       } else {
//         setLocation(trackingEvent.location)
//       }
//     }
//     const sub = locationServiceFactory().track(SM_CONNECTION)(callback)

//     return sub.cancel
//   }, [locationServiceFactory])

//   return location
// }
