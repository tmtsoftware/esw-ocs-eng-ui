import { screen } from '@testing-library/react'
import { Location, Prefix } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { when } from 'ts-mockito'
import SequencerDetails from '../../../../src/features/sequencer/components/SequencerDetails'
import { getMockServices, renderWithAuth } from '../../../utils/test-utils'

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

  it('Should render the sequencerDetails | ESW-455, ESW-456', async () => {
    const mockServices = getMockServices()

    renderWithAuth({
      ui: (
        <SequencerDetails
          stepListStatus={'Failed'}
          sequencer={sequencerLoc}
          obsMode={''}
        />
      ),
      mockClients: mockServices.serviceFactoryContext
    })

    const sequenerTitle = await screen.findByTestId('status-error')
    expect(sequenerTitle.innerText).to.equal(darkNightSequencer)

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
    const mockServices = getMockServices()

    renderWithAuth({
      ui: (
        <SequencerDetails
          stepListStatus={'In Progress'}
          sequencer={sequencerLoc}
          obsMode={''}
        />
      ),
      mockClients: mockServices.serviceFactoryContext
    })

    const loadButton = screen.getByRole('button', { name: 'Load Sequence' })
    const abortButton = screen.getByRole('button', { name: 'Abort sequence' })
    const goOffline = screen.getByRole('button', { name: 'Go offline' })

    expect(loadButton).to.exist
    expect(goOffline).to.exist
    expect(abortButton).to.exist

    expect(screen.getByRole('PlaySequencer')).to.exist
    expect(screen.getByRole('StopSequencer')).to.exist
    expect(screen.getByRole('ResetSequencer')).to.exist

    //check for sequence execution table
    screen.getByRole('columnheader', {
      name: /sequence steps status: in progress/i
    })
  })

  it('should render badge status as success if sequencer is online | ESW-455, ESW-456', async () => {
    const mockServices = getMockServices()
    const sequencerService = mockServices.mock.sequencerService

    renderWithAuth({
      ui: (
        <SequencerDetails
          stepListStatus={'Paused'}
          sequencer={sequencerLoc}
          obsMode={''}
        />
      ),
      mockClients: mockServices.serviceFactoryContext
    })

    when(sequencerService.isOnline()).thenResolve(true)
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
})
