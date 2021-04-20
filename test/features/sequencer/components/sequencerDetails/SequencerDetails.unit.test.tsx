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
import { expect } from 'chai'
import React from 'react'
import { anything, when } from 'ts-mockito'
import { SequencerDetails } from '../../../../../src/features/sequencer/components/sequencerDetails/SequencerDetails'
import { assertTableHeader } from '../../../../utils/tableTestUtils'
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
      ui: (
        <SequencerDetails
          prefix={sequencerLoc.connection.prefix}
          obsMode={''}
        />
      )
    })

    const sequencerTitle = await screen.findByTestId('status-error')
    expect(sequencerTitle.innerText).to.equal(darkNightSequencer)

    expect(screen.getByLabelText('SeqCompLabel').innerText).to.equal(
      'Sequence Component :'
    )
    expect(screen.getByLabelText(`SeqCompValue`).innerText).to.equal(
      sequenceComponentPrefix
    )

    //check for sequence execution table
    screen.getByRole('columnheader', {
      name: /sequence steps status: failed/i
    })
  })

  it('should render the sequence and sequencer actions | ESW-455, ESW-456', async () => {
    when(sequencerServiceMock.getSequence()).thenResolve(
      getStepList('InFlight')
    )
    renderWithAuth({
      ui: (
        <SequencerDetails
          prefix={sequencerLoc.connection.prefix}
          obsMode={''}
        />
      )
    })

    const loadAndUploadButton = screen.getAllByRole('button', {
      name: 'Load Sequence'
    })
    const abortButton = screen.getByRole('button', { name: 'Abort sequence' })
    const goOffline = screen.getByRole('button', { name: 'Go offline' })

    expect(loadAndUploadButton.length).to.equal(2)
    expect(goOffline).to.exist
    expect(abortButton).to.exist

    expect(screen.getByRole('PlaySequencer')).to.exist
    expect(screen.getByRole('StopSequencer')).to.exist
    expect(screen.getByRole('ResetSequencer')).to.exist

    //check for sequence execution table
    await screen.findByRole('columnheader', {
      name: /sequence steps status: in progress/i
    })
  })

  it('should render badge status as success if sequencer is online | ESW-455, ESW-456', async () => {
    when(sequencerServiceMock.isOnline()).thenResolve(true)
    when(sequencerServiceMock.getSequence()).thenResolve(
      getStepList('Pending', true)
    )
    renderWithAuth({
      ui: (
        <SequencerDetails
          prefix={sequencerLoc.connection.prefix}
          obsMode={''}
        />
      )
    })

    await screen.findByTestId('status-error')
    const sequencerTitle = await screen.findByTestId('status-success')
    expect(sequencerTitle.innerText).to.equal(darkNightSequencer)
    expect(screen.getByLabelText('SeqCompLabel').innerText).to.equal(
      'Sequence Component :'
    )
    expect(screen.getByLabelText(`SeqCompValue`).innerText).to.equal(
      sequenceComponentPrefix
    )

    //check for sequence execution table
    screen.getByRole('columnheader', {
      name: /sequence steps status: paused/i
    })
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
      ui: (
        <SequencerDetails
          prefix={sequencerLoc.connection.prefix}
          obsMode={''}
        />
      )
    })

    await screen.findAllByRole('table')

    const [, , descriptionsTable, , parameterBodyTable] = screen.queryAllByRole(
      'table'
    )

    const step = screen.getByRole('button', { name: /Command-2/i })
    userEvent.click(step)

    expect(within(parameterBodyTable).queryAllByRole('row')).to.have.length(2)
    expect(
      within(parameterBodyTable).getByRole('row', {
        name: 'filter NoUnits [[1,2,3],[4,5,6]] copy'
      })
    ).to.exist
    expect(
      within(parameterBodyTable).getByRole('row', {
        name: 'ra NoUnits ["12:13:14.1"] copy'
      })
    ).to.exist
  })
})
