import { LocationService } from '@tmtsoftware/esw-ts'
import React, { useContext, createContext } from 'react'
import { useQuery } from 'react-query'
import { Spinner } from '../components/spinners/Spinner'
import { LOCATION_SERVICE } from '../features/queryKeys'

const LocationServiceContext = createContext<LocationService | undefined>(undefined)

const useLocationServiceQuery = () => useQuery(LOCATION_SERVICE.key, () => LocationService())

//initialValue is used for testing purpose
export const LocationServiceProvider = ({
  children,
  initialValue
}: {
  children: React.ReactNode
  initialValue?: LocationService
}): JSX.Element => {
  const { data, isLoading } = useLocationServiceQuery()
  if (isLoading) return <Spinner />

  return data ? (
    <LocationServiceContext.Provider value={initialValue ? initialValue : data}>
      {children}
    </LocationServiceContext.Provider>
  ) : (
    <>Location server instance notfound</>
  )
}

export const useLocationService = (): LocationService => {
  const c = useContext(LocationServiceContext)
  if (!c) throw new Error('useCtx must be inside a Provider with a value')
  return c
}
