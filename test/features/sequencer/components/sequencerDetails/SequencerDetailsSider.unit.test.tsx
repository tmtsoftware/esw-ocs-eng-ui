import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Prefix, Setup, StepList } from '@tmtsoftware/esw-ts'
import type { Step } from '@tmtsoftware/esw-ts/lib/src'
import { expect } from 'chai'
import React from 'react'
import { verify, when } from 'ts-mockito'
import { SequencerDetailsSider } from '../../../../../src/features/sequencer/components/sequencerDetails/SequencerDetailsSider'
import {
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

describe('SequenceDetailsSider', () => {
  it('should render duplicate table ', async () => {
    when(sequencerServiceMock.getSequence()).thenResolve(getStepList('Pending'))
    renderWithAuth({
      ui: (
        <SequencerDetailsSider
          sequencerPrefix={Prefix.fromString('ESW.irisDarkNight')}
          setSelectedStep={() => ({})}
          selectedStep={undefined}
        />
      )
    })

    const actions = await screen.findAllByRole('stepActions')

    userEvent.click(actions[0])

    const duplicate = await screen.findByText('Duplicate')
    userEvent.click(duplicate)

    expect(screen.getByRole('button', { name: /copy duplicate/i })).to.exist
    verify(sequencerServiceMock.getSequence()).called()
  })

  it('should render stepList table after duplicate action ', async () => {
    when(sequencerServiceMock.getSequence()).thenResolve(getStepList('Pending'))
    renderWithAuth({
      ui: (
        <SequencerDetailsSider
          sequencerPrefix={Prefix.fromString('ESW.irisDarkNight')}
          setSelectedStep={() => ({})}
          selectedStep={undefined}
        />
      )
    })

    const actions = await screen.findAllByRole('stepActions')

    userEvent.click(actions[0])

    const duplicate = await screen.findByText('Duplicate')
    userEvent.click(duplicate)

    const cancel = screen.getByRole('button', {
      name: 'Cancel'
    })
    userEvent.click(cancel)

    const stepAction = await screen.findAllByRole('stepActions')
    expect(stepAction.length).to.greaterThan(0)
    verify(sequencerServiceMock.getSequence()).called()
  })
})
