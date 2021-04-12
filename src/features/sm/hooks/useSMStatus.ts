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
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const callback = async (trackingEvent: TrackingEvent) => {
      setLoading(false)
      if (trackingEvent._type === 'LocationRemoved') {
        setLocation(undefined)
      } else {
        setLocation(trackingEvent.location)
      }
    }
    setLoading(true)
    const sub = locationService.track(SM_CONNECTION)(callback)

    return sub.cancel
  }, [locationService])

  return [location, loading]
}
