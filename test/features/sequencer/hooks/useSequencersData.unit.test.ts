import { renderHook } from '@testing-library/react-hooks/dom'
import { Prefix, StepList } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import { anything, verify, when } from 'ts-mockito'
import {
  SequencerInfo,
  useSequencersData
} from '../../../../src/features/sequencer/hooks/useSequencersData'
import {
  getContextWithQueryClientProvider,
  mockServices,
  sequencerServiceMock
} from '../../../../test/utils/test-utils'
import { step } from '../../../utils/sequence-utils'
describe('useSequencersData', () => {
  const locServiceMock = mockServices.mock.locationService
  when(locServiceMock.track(anything())).thenReturn(() => {
    return {
      cancel: () => ({})
    }
  })

  const stepList1: StepList = new StepList([
    step('Pending', 'command-11', true),
    step('Pending', 'command-12')
  ])
  const stepList2: StepList = new StepList([
    step('Success', 'command-21'),
    step('Failure', 'command-22'),
    step('Pending', 'command-23')
  ])
  const stepList3: StepList = new StepList([
    step('InFlight', 'command-31'),
    step('Pending', 'command-32')
  ])
  const stepList4: StepList = new StepList([
    step('Success', 'command-41'),
    step('Success', 'command-42')
  ])

  it('should return sequencers data with their steps and status | ESW-451, ESW-496', async () => {
    when(locServiceMock.listByComponentType('Sequencer')).thenResolve([])
    when(sequencerServiceMock.getSequence())
      .thenResolve(stepList1)
      .thenResolve(stepList2)
      .thenResolve(stepList3)
      .thenResolve(stepList4)

    const ContextAndQueryClientProvider =
      getContextWithQueryClientProvider(true)

    const { result, waitFor } = renderHook(
      () =>
        useSequencersData([
          Prefix.fromString('ESW.IRIS_Darknight'),
          Prefix.fromString('WFOS.IRIS_Darknight'),
          Prefix.fromString('IRIS.IRIS_Darknight'),
          Prefix.fromString('TCS.IRIS_Darknight')
        ]),
      {
        wrapper: ContextAndQueryClientProvider
      }
    )

    await waitFor(() => {
      return result.current.isSuccess
    })

    verify(sequencerServiceMock.getSequence()).called()

    const sequencerData: SequencerInfo[] = [
      {
        key: 'ESW.IRIS_Darknight',
        prefix: 'ESW.IRIS_Darknight',
        stepListStatus: {
          status: 'Paused',
          stepNumber: 1
        },
        currentStepCommandName: 'command-11',
        totalSteps: 2
      },
      {
        key: 'WFOS.IRIS_Darknight',
        prefix: 'WFOS.IRIS_Darknight',
        stepListStatus: {
          status: 'Failed',
          stepNumber: 2
        },
        currentStepCommandName: 'command-22',
        totalSteps: 3
      },
      {
        key: 'IRIS.IRIS_Darknight',
        prefix: 'IRIS.IRIS_Darknight',
        stepListStatus: {
          status: 'In Progress',
          stepNumber: 1
        },
        currentStepCommandName: 'command-31',
        totalSteps: 2
      },
      {
        key: 'TCS.IRIS_Darknight',
        prefix: 'TCS.IRIS_Darknight',
        stepListStatus: {
          status: 'All Steps Completed',
          stepNumber: 0
        },
        currentStepCommandName: 'NA',
        totalSteps: 2
      }
    ]
    expect(result.current.data).to.deep.equal(sequencerData)
  })

  it('should return Failed to fetch data if error occurred | ESW-451, ESW-496', async () => {
    when(locServiceMock.listByComponentType('Sequencer')).thenResolve([])

    when(sequencerServiceMock.getSequence()).thenReject(Error())

    const ContextAndQueryClientProvider =
      getContextWithQueryClientProvider(true)

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
        currentStepCommandName: 'NA',
        totalSteps: 'NA'
      }
    ])
  })
})
