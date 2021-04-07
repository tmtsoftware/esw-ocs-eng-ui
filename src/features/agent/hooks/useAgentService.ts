import {
  AgentService,
  Prefix,
  Setup,
  StepList,
  Subscription,
  TrackingEvent
} from '@tmtsoftware/esw-ts'
import { useEffect } from 'react'
import { useQueryClient } from 'react-query'
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

export const useAgentServiceTrack = (): void => {
  const { locationServiceFactory } = useServiceFactory()
  const qc = useQueryClient()

  useEffect(() => {
    const callback = (event: TrackingEvent) => {
      if (event._type === 'LocationRemoved') {
        qc.setQueryData(AGENT_SERVICE.key, { data: undefined })
      } else if (event._type === 'LocationUpdated') {
        qc.invalidateQueries({ queryKey: AGENT_SERVICE.key })
      }
    }
    const subscription = locationServiceFactory().track(
      AGENT_SERVICE_CONNECTION
    )(callback)
    return () => {
      subscription.cancel()
    }
  }, [qc, locationServiceFactory])
}

interface SequencerService {
  getSequenceStream: (callback: (stepList: StepList) => void) => Subscription
}
const service: SequencerService = {
  getSequenceStream: (callback: (stepList: StepList) => void) => {
    let count = 1
    const interval = setInterval(() => {
      const d: StepList = [
        {
          id: `${count++}`,
          command: new Setup(Prefix.fromString('ESW.comp1'), 'command1'),
          status: { _type: 'InFlight' },
          hasBreakpoint: false
        }
      ]
      callback(d)
    }, 2000)
    return { cancel: () => clearInterval(interval) }
  }
}

export const useSequenceStream = () => {
  const qc = useQueryClient()
  useEffect(() => {
    const callback = (stepList: StepList) => {
      console.log('streaming...', stepList[0].id)
      /**
       * qc.invalidateQueries or qc.setQueryData can be done here
       */
    }
    const subscription = service.getSequenceStream(callback)
    return () => {
      subscription.cancel()
    }
  }, [qc])
}
