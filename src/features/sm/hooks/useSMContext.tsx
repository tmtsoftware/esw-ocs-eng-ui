import type { TrackingEvent, Location } from '@tmtsoftware/esw-ts'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useServiceFactory } from '../../../contexts/ServiceFactoryContext'
import { SM_CONNECTION } from '../constants'

const useSMContext = () => {
  const context = useContext(SMContext)
  if (context === undefined) {
    throw new Error('useSMTrack must be used within a SMContext')
  }
  return context
}

const SMContext = createContext<[Location | undefined, boolean]>([
  undefined,
  false
])

const SMContextProvider = ({
  children
}: {
  children: React.ReactNode
}): JSX.Element => {
  const { locationServiceFactory } = useServiceFactory()
  const [location, setLocation] = useState<Location | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const callback = async (trackingEvent: TrackingEvent) => {
      console.log('location updated', trackingEvent)
      if (trackingEvent._type === 'LocationRemoved') {
        setLocation(undefined)
      } else {
        setLocation(trackingEvent.location)
      }
      setLoading(false)
    }
    setLoading(true)
    const sub = locationServiceFactory().track(SM_CONNECTION)(callback)

    return sub.cancel
  }, [locationServiceFactory])
  const value: [Location | undefined, boolean] = [location, loading]
  return <SMContext.Provider value={value}>{children}</SMContext.Provider>
}

export { SMContextProvider, useSMContext }
