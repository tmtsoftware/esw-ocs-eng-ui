import { renderHook } from '@testing-library/react-hooks/dom'
import { Prefix, Setup, Step, StepList } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import { anything, mock, verify, when } from 'ts-mockito'
import { useSequencersData } from '../../../../src/features/sequencer/hooks/useSequencersData'
import {
  getContextWithQueryClientProvider,
  mockServices,
  sequencerServiceMock
} from '../../../../test/utils/test-utils'
describe('useSequencersData', () => {
  const locServiceMock = mockServices.mock.locationService
  when(locServiceMock.track(anything())).thenReturn(() => {
    return {
      cancel: () => ({})
    }
  })
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

  const stepList1: StepList = new StepList([
    step('Pending', true),
    step('Pending')
  ])
  const stepList2: StepList = new StepList([
    step('Success'),
    step('Failure'),
    step('Pending')
  ])
  const stepList3: StepList = new StepList([step('InFlight'), step('Pending')])
  const stepList4: StepList = new StepList([step('Success'), step('Success')])

  it('should return sequencers data with their steps and status | ESW-451', async () => {
    when(locServiceMock.listByComponentType('Sequencer')).thenResolve([])
    when(sequencerServiceMock.getSequence())
      .thenResolve(stepList1)
      .thenResolve(stepList2)
      .thenResolve(stepList3)
      .thenResolve(stepList4)

    const ContextAndQueryClientProvider = getContextWithQueryClientProvider(
      true,
      mockServices
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

    verify(sequencerServiceMock.getSequence()).called()

    expect(result.current.data).to.deep.equal([
      {
        key: 'ESW.',
        prefix: 'ESW.',
        stepListStatus: {
          status: 'Paused',
          stepNumber: 1
        },
        totalSteps: 2
      },
      {
        key: 'WFOS.Calib',
        prefix: 'WFOS.Calib',
        stepListStatus: {
          status: 'Failed',
          stepNumber: 2
        },
        totalSteps: 3
      },
      {
        key: 'IRIS.FilterWheel',
        prefix: 'IRIS.FilterWheel',
        stepListStatus: {
          status: 'In Progress',
          stepNumber: 1
        },
        totalSteps: 2
      },
      {
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
    when(locServiceMock.listByComponentType('Sequencer')).thenResolve([])

    when(sequencerServiceMock.getSequence()).thenReject(Error())

    const ContextAndQueryClientProvider = getContextWithQueryClientProvider(
      true,
      mockServices
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

    verify(sequencerServiceMock.getSequence()).called()

    expect(result.current.data).to.deep.equal([
      {
        key: 'IRIS.Darknight',
        prefix: 'IRIS.Darknight',
        stepListStatus: {
          status: 'Failed to Fetch Status',
          stepNumber: 0
        },
        totalSteps: 'NA'
      }
    ])
  })
})
