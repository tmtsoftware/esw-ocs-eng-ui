import type {
  Location,
  LocationService,
  TrackingEvent
} from '@tmtsoftware/esw-ts'
import { useEffect, useState } from 'react'
import type { SMContextType } from '../../../contexts/SMContext'
import { SM_CONNECTION } from '../constants'

export const useSMStatus = (
  locationService: LocationService
): SMContextType => {
  const [location, setLocation] = useState<Location | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const callback = async (trackingEvent: TrackingEvent) => {
      if (trackingEvent._type === 'LocationRemoved') {
        setLocation(undefined)
      } else {
        setLocation(trackingEvent.location)
      }
    }
    const sub = locationService.track(SM_CONNECTION)(callback)
    setLoading(false)
    return sub.cancel
  }, [locationService])

  return [location, loading]
}
