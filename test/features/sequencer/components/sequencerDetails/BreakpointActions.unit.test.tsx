import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  GenericResponse,
  Prefix,
  RemoveBreakpointResponse,
  Setup,
  Step
} from '@tmtsoftware/esw-ts'
import React from 'react'
import { verify, when } from 'ts-mockito'
import { BreakpointAction } from '../../../../../src/features/sequencer/components/sequencerDetails/BreakpointActions'
import {
  getMockServices,
  renderWithAuth,
  sequencerServiceMock
} from '../../../../utils/test-utils'

describe('Breakpoint actions', () => {
  const mockServices = getMockServices()

  const sequencerPrefix = Prefix.fromString('ESW.iris_darknight')

  const insertBreakpointTests: [string, GenericResponse, string][] = [
    [
      'success',
      {
        _type: 'Ok'
      },
      'Successfully inserted breakpoint'
    ],
    [
      'CannotOperateOnAnInFlightOrFinishedStep',
      {
        _type: 'CannotOperateOnAnInFlightOrFinishedStep'
      },
      'Failed to insert breakpoint, reason: Cannot operate on in progress or finished step'
    ],
    [
      'Unhandled',
      {
        _type: 'Unhandled',
        msg: 'Cannot add breakpoint in idle state',
        state: 'Idle',
        messageType: 'Unhandled'
      },
      'Failed to insert breakpoint, reason: Cannot add breakpoint in idle state'
    ],
    [
      'IdDoesNotExist',
      {
        _type: 'IdDoesNotExist',
        id: 'step1'
      },
      'Failed to insert breakpoint, reason: step1 does not exist'
    ]
  ]

  insertBreakpointTests.forEach(([testName, res, message]) => {
    it(`should return ${testName} when Insert breakpoint is clicked | ESW-459`, async () => {
      const step: Step = {
        hasBreakpoint: false,
        status: { _type: 'Success' },
        command: new Setup(Prefix.fromString('ESW.test'), 'Command-1'),
        id: 'step1'
      }

      when(sequencerServiceMock.addBreakpoint(step.id)).thenResolve(res)

      renderWithAuth({
        ui: <BreakpointAction sequencerPrefix={sequencerPrefix} step={step} />,
        mockClients: mockServices
      })

      const insertBreakpoint = await screen.findByText('Insert breakpoint')
      userEvent.click(insertBreakpoint, { button: 0 })

      await screen.findByText(message)

      verify(sequencerServiceMock.addBreakpoint(step.id)).called()
    })
  })

  const removeBreakpointTests: [string, RemoveBreakpointResponse, string][] = [
    [
      'success',
      {
        _type: 'Ok'
      },
      'Successfully removed breakpoint'
    ],
    [
      'Unhandled',
      {
        _type: 'Unhandled',
        msg: 'Cannot remove breakpoint in idle state',
        state: 'Idle',
        messageType: 'Unhandled'
      },
      'Failed to remove breakpoint, reason: Cannot remove breakpoint in idle state'
    ],
    [
      'IdDoesNotExist',
      {
        _type: 'IdDoesNotExist',
        id: 'step1'
      },
      'Failed to remove breakpoint, reason: step1 does not exist'
    ]
  ]

  removeBreakpointTests.forEach(([testName, res, message]) => {
    it(`should return ${testName} when Remove breakpoint is clicked | ESW-459`, async () => {
      const step: Step = {
        hasBreakpoint: true,
        status: { _type: 'Success' },
        command: new Setup(Prefix.fromString('ESW.test'), 'Command-1'),
        id: 'step1'
      }

      when(sequencerServiceMock.removeBreakpoint(step.id)).thenResolve(res)

      renderWithAuth({
        ui: <BreakpointAction sequencerPrefix={sequencerPrefix} step={step} />,
        mockClients: mockServices
      })

      const removeBreakpoint = await screen.findByText('Remove breakpoint')
      userEvent.click(removeBreakpoint, { button: 0 })

      await screen.findByText(message)

      verify(sequencerServiceMock.removeBreakpoint(step.id)).called()
    })
  })
})
