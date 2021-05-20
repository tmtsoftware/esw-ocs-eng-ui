import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GenericResponse, Prefix, Setup, Step } from '@tmtsoftware/esw-ts'
import React from 'react'
import { verify, when } from 'ts-mockito'
import { DeleteAction } from '../../../../../src/features/sequencer/components/steplist/DeleteAction'
import {
  renderWithAuth,
  sequencerServiceMock
} from '../../../../utils/test-utils'

describe('Delete action', () => {
  const sequencerPrefix = Prefix.fromString('ESW.iris_darknight')

  const deleteActionTests: [string, GenericResponse, string][] = [
    [
      'success',
      {
        _type: 'Ok'
      },
      'Successfully deleted step'
    ],
    [
      'CannotOperateOnAnInFlightOrFinishedStep',
      {
        _type: 'CannotOperateOnAnInFlightOrFinishedStep'
      },
      'Failed to delete step, reason: Cannot operate on in progress or finished step'
    ],
    [
      'Unhandled',
      {
        _type: 'Unhandled',
        msg: 'Cannot delete step in idle state',
        state: 'Idle',
        messageType: 'Unhandled'
      },
      'Failed to delete step, reason: Cannot delete step in idle state'
    ],
    [
      'IdDoesNotExist',
      {
        _type: 'IdDoesNotExist',
        id: 'step1'
      },
      'Failed to delete step, reason: step1 does not exist'
    ]
  ]

  deleteActionTests.forEach(([testName, res, message]) => {
    it(`should return ${testName} when delete is clicked | ESW-490`, async () => {
      const step: Step = {
        hasBreakpoint: false,
        status: { _type: 'Pending' },
        command: new Setup(Prefix.fromString('ESW.test'), 'Command-1'),
        id: 'step1'
      }

      when(sequencerServiceMock.delete(step.id)).thenResolve(res)

      renderWithAuth({
        ui: (
          <DeleteAction
            sequencerPrefix={sequencerPrefix}
            step={step}
            isDisabled={false}
          />
        )
      })

      const deleteButton = await screen.findByText('Delete')
      userEvent.click(deleteButton, { button: 0 })

      await screen.findByText(/do you want to delete a step 'Command-1'\?/i)
      const deleteStep = screen.getByRole('button', { name: /delete/i })

      userEvent.click(deleteStep)

      await screen.findByText(message)

      verify(sequencerServiceMock.delete(step.id)).called()
    })
  })
})
