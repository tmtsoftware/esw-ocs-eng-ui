import { renderHook } from '@testing-library/react-hooks/dom'
import { Prefix, Setup, Step } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import { mock, verify, when } from 'ts-mockito'
import { useSequencersData } from '../../../../src/features/sequencer/hooks/useSequencersData'
import {
  getContextWithQueryClientProvider,
  getMockServices
} from '../../../utils/test-utils'

describe('useSequencersData', () => {
  const step = (
    stepStatus: 'Pending' | 'Success' | 'Failure' | 'InFlight',
    hasBreakpoint = false
  ): Step => {
    return {
      hasBreakpoint: hasBreakpoint,
      status: { _type: stepStatus, message: '' },
      command: mock(Setup),
      id: ''
    }
  }

  const stepList1: Step[] = [step('Pending', true), step('Pending')]
  const stepList2: Step[] = [step('Success'), step('Failure'), step('Pending')]
  const stepList3: Step[] = [step('InFlight'), step('Pending')]
  const stepList4: Step[] = [step('Success'), step('Success')]

  it('should return sequencers data with their steps and status | ESW-451', async () => {
    const mockServices = getMockServices()
    const sequencerService = mockServices.mock.sequencerService
    const locationService = mockServices.mock.locationService

    when(locationService.listByComponentType('Sequencer')).thenResolve([])
    when(sequencerService.getSequence())
      .thenResolve(stepList1)
      .thenResolve(stepList2)
      .thenResolve(stepList3)
      .thenResolve(stepList4)

    const ContextAndQueryClientProvider = getContextWithQueryClientProvider(
      true,
      mockServices.serviceFactoryContext
    )

    const { result, waitFor } = renderHook(
      () =>
        useSequencersData([
          Prefix.fromString('ESW'),
          Prefix.fromString('WFOS.Calib'),
          Prefix.fromString('IRIS.FilterWheel'),
          Prefix.fromString('IRIS.Darknight')
        ]),
      {
        wrapper: ContextAndQueryClientProvider
      }
    )

    await waitFor(() => {
      return result.current.isSuccess
    })

    verify(sequencerService.getSequence()).called()

    expect(result.current.data).to.deep.equal([
      {
        location: undefined,
        key: 'ESW.',
        prefix: 'ESW.',
        stepListStatus: {
          status: 'Paused',
          stepNumber: 1
        },
        totalSteps: 2
      },
      {
        location: undefined,
        key: 'WFOS.Calib',
        prefix: 'WFOS.Calib',
        stepListStatus: {
          status: 'Failed',
          stepNumber: 2
        },
        totalSteps: 3
      },
      {
        location: undefined,
        key: 'IRIS.FilterWheel',
        prefix: 'IRIS.FilterWheel',
        stepListStatus: {
          status: 'In Progress',
          stepNumber: 1
        },
        totalSteps: 2
      },
      {
        location: undefined,
        key: 'IRIS.Darknight',
        prefix: 'IRIS.Darknight',
        stepListStatus: {
          status: 'All Steps Completed',
          stepNumber: 0
        },
        totalSteps: 2
      }
    ])
  })

  it('should return Failed to fetch data if error occurred | ESW-451', async () => {
    const mockServices = getMockServices()
    const sequencerService = mockServices.mock.sequencerService
    const locationService = mockServices.mock.locationService

    when(locationService.listByComponentType('Sequencer')).thenResolve([])

    when(sequencerService.getSequence()).thenReject(Error())

    const ContextAndQueryClientProvider = getContextWithQueryClientProvider(
      true,
      mockServices.serviceFactoryContext
    )

    const { result, waitFor } = renderHook(
      () => useSequencersData([Prefix.fromString('IRIS.Darknight')]),
      {
        wrapper: ContextAndQueryClientProvider
      }
    )

    await waitFor(() => {
      return result.current.isSuccess
    })

    verify(sequencerService.getSequence()).called()

    expect(result.current.data).to.deep.equal([
      {
        key: 'IRIS.Darknight',
        prefix: 'IRIS.Darknight',
        stepListStatus: {
          status: 'Failed to Fetch Status',
          stepNumber: 0
        },
        totalSteps: 'NA',
        location: undefined
      }
    ])
  })
})
