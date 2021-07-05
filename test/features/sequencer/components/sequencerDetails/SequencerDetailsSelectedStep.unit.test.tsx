import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Location, Prefix, SequencerStateResponse, StepList } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { anything, reset, when } from 'ts-mockito'
import { SequencerDetails } from '../../../../../src/features/sequencer/components/sequencerDetails/SequencerDetails'
import { getStep } from '../../../../utils/sequence-utils'
import { mockServices, renderWithAuth, sendEvent, sequencerServiceMock } from '../../../../utils/test-utils'

describe('sequencer details selected step', () => {
  beforeEach(() => {
    reset(sequencerServiceMock)
  })
  afterEach(() => {
    reset(sequencerServiceMock)
  })

  const darkNightSequencer = 'IRIS.IRIS_Darknight'
  const sequenceComponentPrefix = 'ESW.ESW1'

  const sequencerLoc: Location = {
    _type: 'AkkaLocation',
    connection: {
      componentType: 'Sequencer',
      connectionType: 'akka',
      prefix: Prefix.fromString(darkNightSequencer)
    },
    metadata: {
      sequenceComponentPrefix
    },
    uri: ''
  }
  const locServiceMock = mockServices.mock.locationService

  when(locServiceMock.find(anything())).thenResolve(sequencerLoc)
  when(locServiceMock.track(anything())).thenReturn(() => {
    return {
      cancel: () => ({})
    }
  })

  it('should follow step list progress by default when no user action | ESW-501, ESW-489', async () => {
    const stepListWithStep1InProgress: StepList = new StepList([getStep('InFlight', '1'), getStep('Pending', '2')])

    const stepListWithStep2InProgress: StepList = new StepList([getStep('Success', '1'), getStep('InFlight', '2')])

    when(sequencerServiceMock.subscribeSequencerState()).thenReturn((callback) => {
      sendEvent(callback, 'Running', stepListWithStep1InProgress)
      sendEvent(callback, 'Running', stepListWithStep2InProgress, 700)
      return {
        cancel: () => undefined
      }
    })

    renderWithAuth({
      ui: <SequencerDetails prefix={sequencerLoc.connection.prefix} />
    })
    // step1 in executng, ui should show step1 details on right side
    await assertRunningStepIs(/Command-1/i, 500)
    const sourceValue = screen.getByLabelText('Source-Value')
    // eslint-disable-next-line testing-library/no-debug
    screen.debug(sourceValue)
    expect(sourceValue.innerHTML).to.equals('ESW.test1')

    //After some time , a new event is received, step2 in executng, ui should show step2 details on right side
    await assertRunningStepIs(/Command-2/i, 1200)
    await screen.findByText('ESW.test2')
  })

  it('should not follow step list progress when user selects step other than in-flight step | ESW-501, ESW-489', async () => {
    const stepListWithStep1InProgress: StepList = new StepList([
      getStep('InFlight', '1'),
      getStep('Pending', '2'),
      getStep('Pending', '3')
    ])

    const stepListWithStep2InProgress: StepList = new StepList([
      getStep('Success', '1'),
      getStep('InFlight', '2'),
      getStep('Pending', '3')
    ])

    when(sequencerServiceMock.subscribeSequencerState()).thenReturn((callback) => {
      sendEvent(callback, 'Running', stepListWithStep1InProgress)
      sendEvent(callback, 'Running', stepListWithStep2InProgress, 400)
      return {
        cancel: () => undefined
      }
    })

    renderWithAuth({
      ui: <SequencerDetails prefix={sequencerLoc.connection.prefix} />
    })

    //User clicks step3
    const step3 = await screen.findByRole('button', { name: /Command-3/i })
    userEvent.click(step3)

    //step1 is executing, but ui should show step3(which was clicked by user) details on right side
    await assertRunningStepIs(/Command-1/i, 500)
    await screen.findByText('ESW.test3')
    await delay(10)
    //step2 is executing, ui should continue to show step3(which was clicked by user) details on right side
    await assertRunningStepIs(/Command-2/i, 500)
    await screen.findByText('ESW.test3')
  })

  it('should go to last existing step in stepList when user do abort sequence | ESW-501, ESW-489', async () => {
    const stepListWithStep1InProgress: StepList = new StepList([
      getStep('InFlight', '1'),
      getStep('Pending', '2'),
      getStep('Pending', '3')
    ])

    const stepListWithStep2InProgress: StepList = new StepList([
      getStep('Success', '1'),
      getStep('InFlight', '2'),
      getStep('Pending', '3')
    ])

    //this simulates abort sequence action, and removes step3 from stepList which was not executed
    const stepListWithStep3Removed: StepList = new StepList([getStep('Success', '1'), getStep('Success', '2')])

    when(sequencerServiceMock.subscribeSequencerState()).thenReturn((callback) => {
      sendEvent(callback, 'Running', stepListWithStep1InProgress)
      sendEvent(callback, 'Running', stepListWithStep2InProgress, 400)
      sendEvent(callback, 'Running', stepListWithStep3Removed, 800)
      return {
        cancel: () => undefined
      }
    })

    renderWithAuth({
      ui: <SequencerDetails prefix={sequencerLoc.connection.prefix} />
    })

    //user clicks step3
    const step3 = await screen.findByRole('button', { name: /Command-3/i })
    userEvent.click(step3)

    //step1 is executing, ui should show step3(which was clicked by user) details on right side
    await assertRunningStepIs(/Command-1/i, 500)
    await screen.findByText('ESW.test3')

    //step2 is executing
    await assertRunningStepIs(/Command-2/i, 500)

    //ui should show step2 details on right side as step3 got removed
    await screen.findByText('ESW.test2')
  })

  it('should start following step list progress again when user selects in-flight step | ESW-501', async () => {
    const stepList: StepList = new StepList([
      getStep('InFlight', '1'),
      getStep('Pending', '2'),
      getStep('Pending', '3')
    ])

    const updatedStepListWithStep2InProgress: StepList = new StepList([
      getStep('Success', '1'),
      getStep('InFlight', '2'),
      getStep('Pending', '3')
    ])

    const updatedStepListWithStep3InProgress: StepList = new StepList([
      getStep('Success', '1'),
      getStep('Success', '2'),
      getStep('InFlight', '3')
    ])

    when(sequencerServiceMock.subscribeSequencerState()).thenReturn(
      (callback: (sequencerStateRes: SequencerStateResponse) => void) => {
        sendEvent(callback, 'Running', stepList)
        sendEvent(callback, 'Running', updatedStepListWithStep2InProgress, 400)
        sendEvent(callback, 'Running', updatedStepListWithStep3InProgress, 800)
        return {
          cancel: () => undefined
        }
      }
    )

    renderWithAuth({
      ui: (
        <BrowserRouter>
          <SequencerDetails prefix={sequencerLoc.connection.prefix} />
        </BrowserRouter>
      )
    })

    //user clicks step3
    const step3 = await screen.findByRole('button', { name: /Command-3/i })
    userEvent.click(step3)

    //step1 is executing, ui should show step3 (which was clicked by user) details on right side i.e. user goes to non-follow mode
    await assertRunningStepIs(/Command-1/i, 500)
    await screen.findByText('ESW.test3')

    //step2 is executing, ui should show step3 (which was clicked by user) details on right side i.e. user is still in non-follow mode
    await assertRunningStepIs(/Command-2/i, 500)
    await screen.findByText('ESW.test3')

    //user clicks step2, which is in progress to go in follow mode again, and now ui should show step2 details on right side
    const step2 = await screen.findByRole('button', { name: /Command-2/i })
    userEvent.click(step2)
    await screen.findByText('ESW.test2')

    //as user is in follow mode, and after some time ui should show step3 details on right side as steplist progress
    await screen.findByText('ESW.test3')
  })

  it('should show current running step when step list is long in follow mode | ESW-501', async () => {
    const step1To17 = new Array(17).fill('Success').map((s, index) => getStep(s, `${index + 1}`))

    const stepListWithStep18InProgress: StepList = new StepList([
      ...step1To17,
      getStep('InFlight', '18'),
      getStep('Pending', '19'),
      getStep('Pending', '20')
    ])

    const stepListWithStep19InProgress: StepList = new StepList([
      ...step1To17,
      getStep('Success', '18'),
      getStep('InFlight', '19'),
      getStep('Pending', '20')
    ])

    when(sequencerServiceMock.subscribeSequencerState()).thenReturn(
      (callback: (sequencerStateRes: SequencerStateResponse) => void) => {
        sendEvent(callback, 'Running', stepListWithStep18InProgress)
        sendEvent(callback, 'Running', stepListWithStep19InProgress, 400)
        return {
          cancel: () => undefined
        }
      }
    )

    renderWithAuth({
      ui: (
        <BrowserRouter>
          <SequencerDetails prefix={sequencerLoc.connection.prefix} />
        </BrowserRouter>
      )
    })
    //step18 is executing, ui should show step18 details on right side
    await assertRunningStepIs(/Command-18/i, 500)
    //wait and assert for auto scroll to happen
    await waitFor(() => expect(window.scrollY).to.greaterThan(500))

    //step19 is executing, ui should show step19 details on right side
    await assertRunningStepIs(/Command-19/i, 500)
    await screen.findByText('ESW.test19')
  })
})

const assertRunningStepIs = async (step: RegExp, timeout: number) => {
  const htmlElement1 = await screen.findByRole('cell', { name: step })
  const stepButton1 = within(htmlElement1).getByRole('button')
  await waitFor(() => expect(stepButton1.style.borderColor).to.equal('rgb(82, 196, 26)'), { timeout })
}

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
