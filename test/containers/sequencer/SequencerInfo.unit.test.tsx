import { screen } from '@testing-library/react'
import { HttpConnection, Prefix, StepList } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { anything, when } from 'ts-mockito'
import { SequencerInfo } from '../../../src/containers/sequencer/SequencerInfo'
import { getSequencerPath } from '../../../src/routes/RoutesConfig'
import {
  mockServices,
  renderWithAuth,
  sequencerServiceMock
} from '../../utils/test-utils'

describe('SequencerInfo ', () => {
  const renderWithRouter = (ui: React.ReactElement, prefix: string) => {
    window.history.pushState({}, 'Home page', getSequencerPath(prefix))
    return renderWithAuth({
      ui: <BrowserRouter>{ui}</BrowserRouter>
    })
  }
  it('should render sequencer details for sequencer | ESW-492', async () => {
    const prefix = 'ESW.iris_DarkNight'
    when(sequencerServiceMock.getSequencerState()).thenResolve({
      _type: 'Idle'
    })

    when(sequencerServiceMock.getSequence()).thenResolve(new StepList([]))

    when(mockServices.mock.locationService.find(anything())).thenResolve({
      _type: 'HttpLocation',
      connection: HttpConnection(Prefix.fromString(prefix), 'Sequencer'),
      metadata: {},
      uri: ''
    })

    renderWithRouter(<SequencerInfo />, prefix)

    await screen.findByText(prefix)
  })

  const errorCases: [string, string, string][] = [
    ['ESW.iris', 'Sequencer ESW.iris : Not found', '404'],
    [
      'ESW.IRIS-a',
      "Requirement failed - component name IRIS-a has '-'",
      'Invalid sequencer prefix'
    ],
    [
      'PSW.iris_darkNight',
      'Subsystem: PSW is invalid',
      'Invalid sequencer prefix'
    ]
  ]

  errorCases.forEach(([prefix, subtitle, title]) => {
    it(`should render ${subtitle} if ${title} | ESW-492`, async () => {
      when(sequencerServiceMock.getSequencerState()).thenResolve({
        _type: 'Idle'
      })

      when(sequencerServiceMock.getSequence()).thenResolve(new StepList([]))

      when(mockServices.mock.locationService.find(anything())).thenResolve(
        undefined
      )

      renderWithRouter(<SequencerInfo />, prefix)

      await screen.findByText(subtitle)
      expect(screen.getByText(title)).to.exist
    })
  })

  it(`should render Invalid sequencer prefix if prefix is not present | ESW-492`, async () => {
    window.history.pushState({}, 'Home page', '/sequencer?prefix=')
    when(sequencerServiceMock.getSequencerState()).thenResolve({
      _type: 'Idle'
    })

    when(sequencerServiceMock.getSequence()).thenResolve(new StepList([]))

    when(mockServices.mock.locationService.find(anything())).thenResolve(
      undefined
    )

    renderWithAuth({
      ui: (
        <BrowserRouter>
          <SequencerInfo />
        </BrowserRouter>
      )
    })

    await screen.findByText('Sequencer prefix not present')
    expect(screen.getByText('Invalid sequencer prefix')).to.exist
  })
})
