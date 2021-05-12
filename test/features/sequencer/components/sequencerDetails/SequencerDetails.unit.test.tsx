import { screen, within } from '@testing-library/react'
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
  Setup,
  StepList,
  stringKey,
  StringKey
} from '@tmtsoftware/esw-ts'
import type { Step } from '@tmtsoftware/esw-ts/lib/src'
import { setViewport } from '@web/test-runner-commands'
import { expect } from 'chai'
import React from 'react'
import { anything, when } from 'ts-mockito'
import { SequencerDetails } from '../../../../../src/features/sequencer/components/sequencerDetails/SequencerDetails'
import {
  mockServices,
  renderWithAuth,
  sequencerServiceMock
} from '../../../../utils/test-utils'

const getStepList = (status: Step['status']['_type'], hasBreakpoint = false) =>
  new StepList([
    {
      hasBreakpoint: hasBreakpoint,
      status: { _type: status, message: '' },
      command: new Setup(Prefix.fromString('ESW.test'), 'Command-1'),
      id: 'step1'
    }
  ])

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

  it('Should render the sequencerDetails | ESW-455, ESW-456', async () => {
    when(sequencerServiceMock.getSequence()).thenResolve(getStepList('Failure'))
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

  it('should render the sequence and sequencer actions | ESW-455, ESW-456', async () => {
    when(sequencerServiceMock.getSequence()).thenResolve(
      getStepList('InFlight')
    )

    when(sequencerServiceMock.getSequencerState()).thenResolve({
      _type: 'Running'
    })

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
    expect(await screen.findByRole('ResetSequence')).to.exist

    //check for sequence execution table
    const stepListTitle = await screen.findByRole('stepListTitle')
    expect(stepListTitle.innerText).to.equals(
      `Sequence Steps\nStatus:\nIn Progress`
    )
  })

  it('should render the sequence and show all steps completed | ESW-455, ESW-456', async () => {
    when(sequencerServiceMock.getSequence()).thenResolve(getStepList('Success'))
    renderWithAuth({
      ui: <SequencerDetails prefix={sequencerLoc.connection.prefix} />
    })

    //check for sequence execution table
    const stepListTitle = await screen.findByRole('stepListTitle')
    expect(stepListTitle.innerText).to.equals(
      `Sequence Steps\nStatus:\nAll Steps Completed`
    )
  })

  it('should render badge status as success if sequencer is online | ESW-455, ESW-456', async () => {
    when(sequencerServiceMock.isOnline()).thenResolve(true)
    when(sequencerServiceMock.getSequence()).thenResolve(
      getStepList('Pending', true)
    )
    renderWithAuth({
      ui: <SequencerDetails prefix={sequencerLoc.connection.prefix} />
    })

    await screen.findByTestId('status-error')
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

  it('should render parameter table when a Step is clicked from the StepList | ESW-457', async () => {
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

    when(sequencerServiceMock.getSequence()).thenResolve(stepList)

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

  it('should render Step details when a Step is clicked from the StepLists | ESW-457', async () => {
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

    when(sequencerServiceMock.getSequence()).thenResolve(stepList)

    //Set bigger viewport so that values wont be elipsis
    await setViewport({ width: 1440, height: 900 })

    renderWithAuth({
      ui: <SequencerDetails prefix={sequencerLoc.connection.prefix} />
    })

    await screen.findAllByRole('table')

    const typeKey = screen.getByLabelText('Type-Key')
    const typeValue = screen.getByLabelText('Type-Value')
    const commandNameKey = screen.getByLabelText('Command-Key')
    const commandNameValue = screen.getByLabelText('Command-Value')
    const sourceKey = screen.getByLabelText('Source-Key')
    const sourceValue = screen.getByLabelText('Source-Value')
    const obsIdKey = screen.getByLabelText('Obs-Id-Key')
    const obsIdValue = screen.getByLabelText('Obs-Id-Value')

    expect(typeKey.innerText).to.equals('Type')
    expect(typeValue.innerText).to.equals('Setup')
    expect(commandNameKey.innerText).to.equals('Command')
    expect(commandNameValue.innerText).to.equals('Command-1')
    expect(sourceKey.innerText).to.equals('Source')
    expect(sourceValue.innerText).to.equals('ESW.ESW1')
    expect(obsIdKey.innerText).to.equals('Obs-Id')
    expect(obsIdValue.innerText).to.equals('NA')

    const step = screen.getByRole('button', { name: /Command-2/i })
    userEvent.click(step)

    expect(typeKey.innerText).to.equals('Type')
    expect(typeValue.innerText).to.equals('Setup')
    expect(commandNameKey.innerText).to.equals('Command')
    expect(commandNameValue.innerText).to.equals('Command-2')
    expect(sourceKey.innerText).to.equals('Source')
    expect(sourceValue.innerText).to.equals('ESW.ESW2')
    expect(obsIdKey.innerText).to.equals('Obs-Id')
    expect(obsIdValue.innerText).to.equals('2020A-001-123')
  })

  it('should render step details with text data having elipsis when viewport size is small | ESW-457', async () => {
    const stepList: StepList = new StepList([
      {
        hasBreakpoint: false,
        status: { _type: 'Success' },
        command: new Setup(
          Prefix.fromString('ESW.ESW123456789123456'),
          'Command-1',
          [],
          '2020A-001-123'
        ),
        id: '1'
      }
    ])

    when(sequencerServiceMock.getSequence()).thenResolve(stepList)

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
    expect(sourceValue.innerText).to.match(/...$/)
  })

  it('should show display Pause action when stepList is in Progress state', () => {
    renderWithAuth({
      ui: <SequencerDetails prefix={sequencerLoc.connection.prefix} />
    })
  })
})
