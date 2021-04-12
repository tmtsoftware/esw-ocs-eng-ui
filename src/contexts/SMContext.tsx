import type {
  TrackingEvent,
  Location,
  LocationService
} from '@tmtsoftware/esw-ts'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { SM_CONNECTION } from '../features/sm/constants'
import { useSMStatus } from '../features/sm/hooks/useSMStatus'
import { useServiceFactory } from './ServiceFactoryContext'

export type SMContextType = [Location | undefined, boolean]

const SMContext = createContext<SMContextType>([undefined, false])

export const useSMContext = (): SMContextType => {
  const context = useContext(SMContext)
  if (context === undefined) {
    throw new Error('useSMTrack must be used within a SMContext')
  }
  return context
}

export const SMContextProvider = ({
  children,
  defaultValue
}: {
  children: React.ReactNode
  defaultValue?: SMContextType
}): JSX.Element => {
  const { locationServiceFactory } = useServiceFactory()
  const value: [Location | undefined, boolean] = useSMStatus(
    locationServiceFactory()
  )
  return (
    <SMContext.Provider value={defaultValue ?? value}>
      {children}
    </SMContext.Provider>
  )
}
