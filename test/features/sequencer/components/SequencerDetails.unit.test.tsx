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

  it('Should render the sequencerDetails | ESW-455', async () => {
    const mockServices = getMockServices()
    const sequencerService = mockServices.mock.sequencerService

    renderWithAuth({
      ui: <SequencerDetails sequencer={sequencerLoc} obsMode={''} />,
      mockClients: mockServices.serviceFactoryContext
    })

    when(sequencerService.isOnline()).thenResolve(true)

    expect(screen.getByText(darkNightSequencer)).to.exist
    expect(screen.getByText(sequenceComponentPrefix)).to.exist
  })

  it('should render the sequence and sequencer actions | ESW-455', async () => {
    const mockServices = getMockServices()

    renderWithAuth({
      ui: <SequencerDetails sequencer={sequencerLoc} obsMode={''} />,
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
  })
})
