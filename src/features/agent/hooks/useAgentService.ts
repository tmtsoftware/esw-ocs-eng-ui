import type {
  AgentService,
  Subscription,
  TrackingEvent
} from '@tmtsoftware/esw-ts'
import { useEffect } from 'react'
import { useServiceFactory } from '../../../contexts/ServiceFactoryContext'
import { useQuery, UseQueryResult } from '../../../hooks/useQuery'
import { AGENT_SERVICE } from '../../queryKeys'
import { AGENT_SERVICE_CONNECTION } from '../../sm/constants'

export const useAgentService = (
  useErrorBoundary = false
): UseQueryResult<AgentService> => {
  const { agentServiceFactory } = useServiceFactory()
  return useQuery(AGENT_SERVICE.key, agentServiceFactory, {
    useErrorBoundary
  })
}

export const useAgentServiceTrack = (
  callback: (event: TrackingEvent) => void
): void => {
  const { locationServiceFactory } = useServiceFactory()
  useEffect(() => {
    const subscription = locationServiceFactory().track(
      AGENT_SERVICE_CONNECTION
    )(callback)
    return () => {
      subscription.cancel()
    }
  }, [callback, locationServiceFactory])
}
