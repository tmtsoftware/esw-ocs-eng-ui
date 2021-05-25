import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  booleanKey,
  BooleanKey,
  IntArrayKey,
  intArrayKey,
  intKey,
  IntKey,
  Location,
  Parameter,
  Prefix,
  SequencerStateResponse,
  Setup,
  StepList,
  stringKey,
  StringKey
} from '@tmtsoftware/esw-ts'
import { setViewport } from '@web/test-runner-commands'
import { expect } from 'chai'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { anything, deepEqual, reset, verify, when } from 'ts-mockito'
import { SequencerDetails } from '../../../../../src/features/sequencer/components/sequencerDetails/SequencerDetails'
import { getStepList, stepUsingId } from '../../../../utils/sequence-utils'
import {
  mockServices,
  renderWithAuth,
  sequencerServiceMock
} from '../../../../utils/test-utils'
import type { SequencerState } from '@tmtsoftware/esw-ts'

describe('sequencer details', () => {
  let windowWidth: number
  let windowHeight: number
  beforeEach(() => {
    windowHeight = window.innerHeight
    windowWidth = window.innerWidth
  })
  afterEach(async () => {
    //Reset the viewport
    await setViewport({
      width: windowWidth,
      height: windowHeight
    })
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

  it('Should render the sequencerDetails | ESW-455, ESW-456, ESW-489', async () => {
    when(sequencerServiceMock.subscribeSequencerState()).thenReturn(
      getEvent('Offline', getStepList('Failure'))
    )
    renderWithAuth({
      ui: <SequencerDetails prefix={sequencerLoc.connection.prefix} />
    })

    const sequencerTitle = await screen.findByTestId('status-error')
    expect(sequencerTitle.innerText).to.equal(darkNightSequencer)

    expect(screen.getByLabelText('SeqCompLabel').innerText).to.equal(
      'Sequence Component:'
    )
    expect(screen.getByLabelText(`SeqCompValue`).innerText).to.equal(
      sequenceComponentPrefix
    )

    //check for sequence execution table
    const stepListTitle = await screen.findByRole('stepListTitle')
    expect(stepListTitle.innerText).to.equals(`Sequence Steps\nStatus:\nFailed`)
  })

  it('should render the sequence and sequencer actions | ESW-455, ESW-456, ESW-489, ESW-500', async () => {
    when(sequencerServiceMock.subscribeSequencerState()).thenReturn(
      getEvent('Running', getStepList('InFlight'))
    )

    renderWithAuth({
      ui: <SequencerDetails prefix={sequencerLoc.connection.prefix} />
    })

    const loadButton = await screen.findByRole('LoadSequence')
    const abortButton = await screen.findByRole('button', {
      name: 'Abort sequence'
    })
    const goOffline = await screen.findByRole('button', { name: 'Go offline' })

    expect(loadButton).to.exist
    expect(goOffline).to.exist
    expect(abortButton).to.exist

    expect(await screen.findByRole('PauseSequence')).to.exist
    expect(await screen.findByRole('StopSequence')).to.exist

    //check for sequence execution table
    const stepListTitle = await screen.findByRole('stepListTitle')
    expect(stepListTitle.innerText).to.equals(
      `Sequence Steps\nStatus:\nIn Progress`
    )
  })

  it('should render the sequence and show all steps completed | ESW-455, ESW-456, ESW-489', async () => {
    when(sequencerServiceMock.subscribeSequencerState()).thenReturn(
      getEvent('Running', getStepList('Success'))
    )
    renderWithAuth({
      ui: <SequencerDetails prefix={sequencerLoc.connection.prefix} />
    })

    //check for sequence execution table
    const stepListTitle = await screen.findByRole('stepListTitle')
    expect(stepListTitle.innerText).to.equals(
      `Sequence Steps\nStatus:\nAll Steps Completed`
    )
  })

  it('should render badge status as success if sequencer is online | ESW-455, ESW-456, ESW-489', async () => {
    when(sequencerServiceMock.subscribeSequencerState()).thenReturn(
      getEvent('Running', getStepList('Pending', true))
    )

    renderWithAuth({
      ui: <SequencerDetails prefix={sequencerLoc.connection.prefix} />
    })

    const sequencerTitle = await screen.findByTestId('status-success')
    expect(sequencerTitle.innerText).to.equal(darkNightSequencer)
    expect(screen.getByLabelText('SeqCompLabel').innerText).to.equal(
      'Sequence Component:'
    )
    expect(screen.getByLabelText(`SeqCompValue`).innerText).to.equal(
      sequenceComponentPrefix
    )

    //check for sequence execution table
    const stepListTitle = await screen.findByRole('stepListTitle')
    expect(stepListTitle.innerText).to.equals(`Sequence Steps\nStatus:\nPaused`)
  })

  it('should render parameter table when a Step is clicked from the StepList | ESW-457, ESW-489', async () => {
    const booleanParam: Parameter<BooleanKey> = booleanKey('flagKey').set([
      false
    ])
    const intParam: Parameter<IntKey> = intKey('randomKey').set([123, 12432])
    const filterKey = intArrayKey('filter')
    const filterParam: Parameter<IntArrayKey> = filterKey.set([
      [1, 2, 3],
      [4, 5, 6]
    ])
    const stringParam: Parameter<StringKey> = stringKey('ra').set([
      '12:13:14.1'
    ])

    const paramSet1 = [booleanParam, intParam]
    const paramSet2 = [filterParam, stringParam]
    const stepList: StepList = new StepList([
      {
        hasBreakpoint: false,
        status: { _type: 'Success' },
        command: new Setup(
          Prefix.fromString('ESW.ESW1'),
          'Command-1',
          paramSet1
        ),
        id: '1'
      },
      {
        hasBreakpoint: false,
        status: { _type: 'InFlight' },
        command: new Setup(
          Prefix.fromString('ESW.ESW1'),
          'Command-2',
          paramSet2
        ),
        id: '2'
      }
    ])

    when(sequencerServiceMock.subscribeSequencerState()).thenReturn(
      getEvent('Running', stepList)
    )

    renderWithAuth({
      ui: <SequencerDetails prefix={sequencerLoc.connection.prefix} />
    })

    await screen.findAllByRole('table')

    const [, , , parameterBodyTable] = screen.queryAllByRole('table')

    const step = screen.getByRole('button', { name: /Command-2/i })
    userEvent.click(step)

    expect(within(parameterBodyTable).queryAllByRole('row')).to.have.length(2)
    expect(
      within(parameterBodyTable).getByRole('row', {
        name: 'filter [1,2,3], [4,5,6] copy NoUnits'
      })
    ).to.exist
    expect(
      within(parameterBodyTable).getByRole('row', {
        name: 'ra "12:13:14.1" copy NoUnits'
      })
    ).to.exist
  })

  it('should render step2 parameter table when a sequence progress from step1 to step2 | ESW-501, ESW-489', async () => {
    const stepList: StepList = new StepList([
      stepUsingId('InFlight', '1'),
      stepUsingId('Pending', '2')
    ])

    const updatedStepList: StepList = new StepList([
      stepUsingId('Success', '1'),
      stepUsingId('InFlight', '2')
    ])

    when(sequencerServiceMock.subscribeSequencerState()).thenReturn(
      (onevent) => {
        sendEvent(onevent, 'Running', stepList)
        sendEvent(onevent, 'Running', updatedStepList, 1000)
        return {
          cancel: () => undefined
        }
      }
    )

    renderWithAuth({
      ui: <SequencerDetails prefix={sequencerLoc.connection.prefix} />
    })
    // assert data of event 1
    await screen.findByText('ESW.test1')

    //After 1 milli second , a new event is received
    await screen.findByText('ESW.test2', undefined, { timeout: 1200 })
  })

  it('should keep rendering step3 parameter table when step3 is clicked and sequence progress from step1 to step2 | ESW-501, ESW-489', async () => {
    const stepList: StepList = new StepList([
      stepUsingId('InFlight', '1'),
      stepUsingId('Pending', '2'),
      stepUsingId('Pending', '3')
    ])

    const updatedStepListWithStep2InProgress: StepList = new StepList([
      stepUsingId('Success', '1'),
      stepUsingId('InFlight', '2'),
      stepUsingId('Pending', '3')
    ])

    when(sequencerServiceMock.subscribeSequencerState()).thenReturn(
      (callback) => {
        sendEvent(callback, 'Running', stepList)
        sendEvent(callback, 'Running', updatedStepListWithStep2InProgress, 200)
        return {
          cancel: () => undefined
        }
      }
    )

    renderWithAuth({
      ui: <SequencerDetails prefix={sequencerLoc.connection.prefix} />
    })

    const step = await screen.findByRole('button', { name: /command3/i })
    userEvent.click(step)

    await screen.findByText('ESW.test3')

    //TODO: add css style assertions here

    //even when step2 starts executing, ui should continue to show step3
    await screen.findByText('ESW.test3')
  })

  it('should keep rendering step1(completed step) parameter table when step1 is clicked and steplist polling continues | ESW-501, ESW-489', async () => {
    const stepList: StepList = new StepList([
      stepUsingId('Success', '1'),
      stepUsingId('InFlight', '2'),
      stepUsingId('Pending', '3')
    ])

    const stepListUpdated: StepList = new StepList([
      stepUsingId('Success', '1'),
      stepUsingId('InFlight', '2'),
      stepUsingId('Pending', '3')
    ])

    when(sequencerServiceMock.subscribeSequencerState()).thenReturn(
      (callback) => {
        sendEvent(callback, 'Running', stepList)
        sendEvent(callback, 'Running', stepListUpdated, 200)
        return {
          cancel: () => undefined
        }
      }
    )
    renderWithAuth({
      ui: <SequencerDetails prefix={sequencerLoc.connection.prefix} />
    })

    const step = await screen.findByRole('button', { name: /command1/i })

    userEvent.click(step)

    await screen.findByText('ESW.test1')
    //TODO: add css style assertions here
    //when due to polling new call returns new steplist object with same data, UI should continue to show step1
    await screen.findByText('ESW.test1')
  })

  it('should render step2 followed by step3 parameter table when step2 is clicked and sequence progress from step1, step2 and step3 | ESW-501', async () => {
    const stepList: StepList = new StepList([
      stepUsingId('InFlight', '1'),
      stepUsingId('Pending', '2'),
      stepUsingId('Pending', '3')
    ])

    const updatedStepListWithStep2InProgress: StepList = new StepList([
      stepUsingId('Success', '1'),
      stepUsingId('InFlight', '2'),
      stepUsingId('Pending', '3')
    ])

    const updatedStepListWithStep3InProgress: StepList = new StepList([
      stepUsingId('Success', '1'),
      stepUsingId('Success', '2'),
      stepUsingId('InFlight', '3')
    ])

    when(sequencerServiceMock.subscribeSequencerState()).thenReturn(
      (onevent: (sequencerStateRes: SequencerStateResponse) => void) => {
        sendEvent(onevent, 'Idle', stepList)
        sendEvent(onevent, 'Idle', updatedStepListWithStep2InProgress, 100)
        sendEvent(onevent, 'Idle', updatedStepListWithStep3InProgress, 200)
        return {
          cancel: () => undefined
        }
      }
    )

    renderWithAuth({
      ui: <SequencerDetails prefix={sequencerLoc.connection.prefix} />
    })

    const step2 = await screen.findByRole('button', { name: /command2/i })
    userEvent.click(step2)

    await screen.findByText('ESW.test2')

    await screen.findByText('ESW.test3')
  })

  it('should render Step details when a Step is clicked from the StepLists | ESW-457, ESW-489', async () => {
    const stepList: StepList = new StepList([
      {
        hasBreakpoint: false,
        status: { _type: 'Success' },
        command: new Setup(Prefix.fromString('ESW.ESW1'), 'Command-1', []),
        id: '1'
      },
      {
        hasBreakpoint: false,
        status: { _type: 'InFlight' },
        command: new Setup(
          Prefix.fromString('ESW.ESW2'),
          'Command-2',
          [],
          '2020A-001-123'
        ),
        id: '2'
      }
    ])

    when(sequencerServiceMock.subscribeSequencerState()).thenReturn(
      getEvent('Running', stepList)
    )

    //Set bigger viewport so that values wont be elipsis
    await setViewport({ width: 1440, height: 900 })

    renderWithAuth({
      ui: <SequencerDetails prefix={sequencerLoc.connection.prefix} />
    })

    await screen.findAllByRole('table')

    const typeKey = screen.getByLabelText('Command Type-Key')
    const typeValue = screen.getByLabelText('Command Type-Value')
    const commandNameKey = screen.getByLabelText('Command-Key')
    const commandNameValue = screen.getByLabelText('Command-Value')
    const sourceKey = screen.getByLabelText('Source-Key')
    const sourceValue = screen.getByLabelText('Source-Value')
    const obsIdKey = screen.getByLabelText('Obs-Id-Key')
    const obsIdValue = screen.getByLabelText('Obs-Id-Value')

    expect(typeKey.innerText).to.equals('Command Type')
    expect(typeValue.innerText).to.equals('Setup')
    expect(commandNameKey.innerText).to.equals('Command')
    expect(commandNameValue.innerText).to.equals('Command-1')
    expect(sourceKey.innerText).to.equals('Source')
    expect(sourceValue.innerText).to.equals('ESW.ESW1')
    expect(obsIdKey.innerText).to.equals('Obs-Id')
    expect(obsIdValue.innerText).to.equals('NA')

    const step = screen.getByRole('button', { name: /Command-2/i })
    userEvent.click(step)

    expect(typeKey.innerText).to.equals('Command Type')
    expect(typeValue.innerText).to.equals('Setup')
    expect(commandNameKey.innerText).to.equals('Command')
    expect(commandNameValue.innerText).to.equals('Command-2')
    expect(sourceKey.innerText).to.equals('Source')
    expect(sourceValue.innerText).to.equals('ESW.ESW2')
    expect(obsIdKey.innerText).to.equals('Obs-Id')
    expect(obsIdValue.innerText).to.equals('2020A-001-123')
  })

  it('should render step details with text data having elipsis when viewport size is small | ESW-457, ESW-489', async () => {
    const stepList: StepList = new StepList([
      {
        hasBreakpoint: false,
        status: { _type: 'Success' },
        command: new Setup(
          Prefix.fromString(
            'ESW.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz'
          ),
          'Command-1',
          [],
          '2020A-001-123'
        ),
        id: '1'
      }
    ])

    when(sequencerServiceMock.subscribeSequencerState()).thenReturn(
      getEvent('Running', stepList)
    )
    //Set small viewport so that values will have elipsis
    await setViewport({ width: 1280, height: 800 })

    renderWithAuth({
      ui: <SequencerDetails prefix={sequencerLoc.connection.prefix} />
    })

    await screen.findAllByRole('table')

    const commandNameValue = screen.getByLabelText('Command-Value')
    const sourceValue = screen.getByLabelText('Source-Value')

    expect(commandNameValue.innerText).to.equals('Command-1')
    // assert text to have ellipses at the end
    expect(sourceValue.innerText).to.match(/^ESW.*\.\.\.$/)
  })

  it('should show display Pause action when sequencer is in Running state and sequence is in Progress state | ESW-497, ESW-489', async () => {
    const stepList = getStepList('InFlight')
    when(sequencerServiceMock.subscribeSequencerState()).thenReturn(
      getEvent('Running', stepList)
    )
    renderWithAuth({
      ui: <SequencerDetails prefix={sequencerLoc.connection.prefix} />
    })

    await screen.findByRole('PauseSequence')
    screen.getByRole('img', { name: 'pause-circle' })

    expect(screen.queryByRole('StartSequence')).to.null
    expect(screen.queryByRole('ResumeSequence')).to.null
  })

  it('should show display Resume action when sequencer is in Running state and sequence is paused | ESW-497, ESW-489', async () => {
    const stepList = getStepList('Pending', true)
    when(sequencerServiceMock.subscribeSequencerState()).thenReturn(
      getEvent('Running', stepList)
    )

    renderWithAuth({
      ui: <SequencerDetails prefix={sequencerLoc.connection.prefix} />
    })

    await screen.findByRole('ResumeSequence')
    screen.getByRole('img', { name: 'play-circle' })

    expect(screen.queryByRole('StartSequence')).to.null
    expect(screen.queryByRole('PauseSequence')).to.null
  })

  it('should show display Start action when sequencer is in Loaded state | ESW-497, ESW-489', async () => {
    const stepList = getStepList('Pending')

    when(sequencerServiceMock.subscribeSequencerState()).thenReturn(
      getEvent('Loaded', stepList)
    )

    renderWithAuth({
      ui: <SequencerDetails prefix={sequencerLoc.connection.prefix} />
    })

    await screen.findByRole('StartSequence')
    screen.getByRole('img', { name: 'play-circle' })

    expect(screen.queryByRole('ResumeSequence')).to.null
    expect(screen.queryByRole('PauseSequence')).to.null
  })

  it('add steps should add uploaded steps after the selected step | ESW-461, ESW-489', async () => {
    const sequencerPrefix = Prefix.fromString('ESW.iris_darknight')
    const commandToInsert: Setup = new Setup(sequencerPrefix, 'command-2')

    const file = new File(
      [JSON.stringify({ commands: [commandToInsert] })],
      'commands.json',
      { type: 'application/json' }
    )

    const stepList = getStepList('Pending', false)

    const stepListAfterInsertion = new StepList([
      {
        hasBreakpoint: false,
        status: { _type: 'Pending' },
        command: new Setup(sequencerPrefix, 'Command-1'),
        id: 'step1'
      },
      {
        hasBreakpoint: false,
        status: { _type: 'Pending' },
        command: commandToInsert,
        id: 'step2'
      }
    ])
    let commandInserted = false

    when(sequencerServiceMock.subscribeSequencerState()).thenReturn(
      (onevent: (sequencerStateRes: SequencerStateResponse) => void) => {
        sendEvent(onevent, 'Idle', stepList)
        setInterval(
          () =>
            commandInserted &&
            sendEvent(onevent, 'Idle', stepListAfterInsertion),
          1
        )
        return {
          cancel: () => undefined
        }
      }
    )

    when(sequencerServiceMock.insertAfter('step1', anything())).thenResolve({
      _type: 'Ok'
    })

    renderWithAuth({
      ui: (
        <BrowserRouter>
          <SequencerDetails prefix={sequencerPrefix} />
        </BrowserRouter>
      )
    })
    const actions = await screen.findAllByRole('stepActions')
    await waitFor(() => userEvent.click(actions[0]))

    const menuItems = await screen.findAllByRole('menuitem')
    expect(menuItems.length).to.equal(4)

    //asert step is not present before adding it
    expect(screen.queryByRole('row', { name: /2 command-2/i })).to.null

    const addSteps = await screen.findByRole('button', { name: /add steps/i })
    await waitFor(() => userEvent.click(addSteps)) // click to open uplaod dialogue

    // eslint-disable-next-line testing-library/no-node-access
    const inputBox = addSteps.firstChild as HTMLInputElement
    await waitFor(() => userEvent.upload(inputBox, file)) // upload the file with command

    await screen.findByText('Successfully added steps')
    commandInserted = true
    verify(
      sequencerServiceMock.insertAfter('step1', deepEqual([commandToInsert]))
    ).called()

    // assert step is added
    await screen.findByRole('row', { name: /1 command-1/i })
    await screen.findByRole('row', { name: /2 command-2/i })
  })

  const disabledStatesForStopAndAbort: SequencerState['_type'][] = [
    'Loaded',
    'Processing',
    'Offline',
    'Idle'
  ]

  disabledStatesForStopAndAbort.forEach((state) => {
    it(`should show stop, abort disabled when sequencer is in ${state} state | ESW-500, ESW-494`, async () => {
      const sequencerPrefix = Prefix.fromString('ESW.iris_darknight')

      const stepList = getStepList('Pending', false)

      when(sequencerServiceMock.subscribeSequencerState()).thenReturn(
        (onevent: (sequencerStateRes: SequencerStateResponse) => void) => {
          sendEvent(onevent, state, stepList)
          return {
            cancel: () => undefined
          }
        }
      )

      renderWithAuth({
        ui: (
          <BrowserRouter>
            <SequencerDetails prefix={sequencerPrefix} />
          </BrowserRouter>
        )
      })
      const abortSeqButton = (await screen.findByRole('button', {
        name: 'Abort sequence'
      })) as HTMLButtonElement

      expect(abortSeqButton.disabled).true

      const stopSeqButton = (await screen.findByRole(
        'StopSequence'
      )) as HTMLButtonElement

      expect(stopSeqButton.disabled).true
    })
  })
  const disabledStatesForResume: SequencerState['_type'][] = [
    'Processing',
    'Offline',
    'Idle'
  ]
  disabledStatesForResume.forEach((state) => {
    it(`should show resume disabled when sequencer is in ${state} state | ESW-500, ESW-494`, async () => {
      const sequencerPrefix = Prefix.fromString('ESW.iris_darknight')

      const stepList = new StepList([
        {
          hasBreakpoint: false,
          status: { _type: 'Pending' },
          command: new Setup(Prefix.fromString('ESW.test'), 'Command-1'),
          id: 'step1'
        }
      ])

      when(sequencerServiceMock.subscribeSequencerState()).thenReturn(
        (onevent: (sequencerStateRes: SequencerStateResponse) => void) => {
          sendEvent(onevent, state, stepList)
          return {
            cancel: () => undefined
          }
        }
      )

      renderWithAuth({
        ui: (
          <BrowserRouter>
            <SequencerDetails prefix={sequencerPrefix} />
          </BrowserRouter>
        )
      })

      const resumeSeqButton = (await screen.findByRole(
        'ResumeSequence'
      )) as HTMLButtonElement

      expect(resumeSeqButton.disabled).true
    })
  })

  it('should not call cancel subscription on unmount | ESW-489', async (done) => {
    when(sequencerServiceMock.subscribeSequencerState()).thenReturn(() => {
      // done() is to assert that cancel is getting called on unmount, whenever it happens
      return {
        cancel: () => done()
      }
    })

    const { unmount } = renderWithAuth({
      ui: <SequencerDetails prefix={sequencerLoc.connection.prefix} />
    })

    unmount()
  })
})

const getEvent =
  (seqState: SequencerState['_type'], stepList: StepList) =>
  (onevent: (sequencerStateResponse: SequencerStateResponse) => void) => {
    onevent(makeSeqStateResponse(seqState, stepList))
    return {
      cancel: () => undefined
    }
  }

const makeSeqStateResponse = (
  seqState: SequencerState['_type'],
  stepList: StepList
): SequencerStateResponse => ({
  _type: 'SequencerStateResponse',
  sequencerState: { _type: seqState },
  stepList
})

const sendEvent = (
  onevent: (sequencerStateResponse: SequencerStateResponse) => void,
  state: SequencerState['_type'],
  stepList: StepList,
  timeout?: number | undefined
) => {
  timeout
    ? setTimeout(() => onevent(makeSeqStateResponse(state, stepList)), timeout)
    : onevent(makeSeqStateResponse(state, stepList))
}
