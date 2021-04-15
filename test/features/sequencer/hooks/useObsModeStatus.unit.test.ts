import { renderHook } from '@testing-library/react-hooks/dom'
import { ObsMode, SequencerStateResponse, StepList } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import { when } from 'ts-mockito'

import {
  RunningObsModeStatus,
  useObsModeStatus
} from '../../../../src/features/sequencer/hooks/useObsModeStatus'
import { step } from '../../../utils/sequence-utils'
import {
  getContextWithQueryClientProvider,
  getMockServices
} from '../../../utils/test-utils'

describe('useObsModeState', () => {
  const tests: [
    string,
    StepList | undefined,
    SequencerStateResponse['_type'],
    RunningObsModeStatus
  ][] = [
    [
      "should return Failed if ESW sequencer's Sequence is failed",
      new StepList([step('Failure')]),
      'Running',
      'Failed'
    ],
    [
      "should return Paused if ESW sequencer's Sequence is pause",
      new StepList([step('Pending', true)]),
      'Running',
      'Paused'
    ],
    ['should return Idle if ESW sequencer is Idle', undefined, 'Idle', 'Idle'],
    [
      'should return Loaded if ESW sequencer is Loaded',
      undefined,
      'Loaded',
      'Loaded'
    ],
    [
      'should return Offline if ESW sequencer is Offline',
      undefined,
      'Offline',
      'Offline'
    ],
    [
      'should return Processing if ESW sequencer is Processing',
      undefined,
      'Processing',
      'Processing'
    ]
  ]
  tests.forEach(([testName, step, sequencerStateResponse, response]) => {
    it(` ${testName} | ESW-454`, async () => {
      const mockServices = getMockServices()
      const sequencerService = mockServices.mock.sequencerService

      when(sequencerService.getSequence()).thenResolve(step)

      const sequencerState: SequencerStateResponse = {
        _type: sequencerStateResponse
      }
      when(sequencerService.getSequencerState()).thenResolve(sequencerState)

      const ContextAndQueryClientProvider = getContextWithQueryClientProvider(
        true,
        mockServices.serviceFactoryContext
      )

      const { result, waitFor } = renderHook(
        () => useObsModeStatus(new ObsMode('IRIS_Darknight')),
        {
          wrapper: ContextAndQueryClientProvider
        }
      )

      await waitFor(() => {
        expect(result.current.data).to.equal(response)
      })
    })
  })
})
