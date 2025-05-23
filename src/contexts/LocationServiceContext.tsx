import type { LocationService } from '@tmtsoftware/esw-ts'
import React, { createContext, PropsWithChildren, useContext } from 'react'

const LocationServiceContext = createContext<LocationService | undefined>(undefined)

export const LocationServiceProvider = ({
  children,
  locationService
}: PropsWithChildren<{ locationService: LocationService }>): React.JSX.Element => (
  <LocationServiceContext.Provider value={locationService}>{children}</LocationServiceContext.Provider>
)

export const useLocationService = (): LocationService => {
  const c = useContext(LocationServiceContext)
  if (!c) {
    console.log('XXX =====> useLocationService must be inside a LocationServiceProvider with a value')
    throw new Error('useLocationService must be inside a LocationServiceProvider with a value')
  }
  return c
}
