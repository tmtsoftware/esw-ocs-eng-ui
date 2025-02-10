// import { screen } from '@testing-library/react'
// import userEvent from '@testing-library/user-event'
// import { Prefix, Setup } from '@tmtsoftware/esw-ts'
// import type { GenericResponse, RemoveBreakpointResponse, Step } from '@tmtsoftware/esw-ts'
// import { reset, verify, when } from '@johanblumenberg/ts-mockito'
// import React from 'react'
// import {
//   useBreakpointActionItem
// } from '../../../../../src/features/sequencer/components/steplist/BreakpointActions'
// import {
//   insertBreakPointConstants,
//   removeBreakPointConstants,
//   stepConstants
// } from '../../../../../src/features/sequencer/sequencerConstants'
// import { MenuWithStepListContext, renderWithAuth, sequencerServiceMock } from '../../../../utils/test-utils'
//
// describe('Breakpoint actions', () => {
//   beforeEach(() => reset(sequencerServiceMock))
//
//   const insertBreakpointTests: [string, GenericResponse, string][] = [
//     [
//       'success',
//       {
//         _type: 'Ok'
//       },
//       insertBreakPointConstants.successMessage
//     ],
//     [
//       'CannotOperateOnAnInFlightOrFinishedStep',
//       {
//         _type: 'CannotOperateOnAnInFlightOrFinishedStep'
//       },
//       `${insertBreakPointConstants.failureMessage}, reason: ${stepConstants.cannotOperateOnAnInFlightOrFinishedStepMsg}`
//     ],
//     [
//       'Unhandled',
//       {
//         _type: 'Unhandled',
//         msg: 'Cannot add breakpoint in idle state',
//         state: 'Idle',
//         messageType: 'Unhandled'
//       },
//       `${insertBreakPointConstants.failureMessage}, reason: Cannot add breakpoint in idle state`
//     ],
//     [
//       'IdDoesNotExist',
//       {
//         _type: 'IdDoesNotExist',
//         id: 'step1'
//       },
//       `${insertBreakPointConstants.failureMessage}, reason: ${stepConstants.idDoesNotExistMsg('step1')}`
//     ]
//   ]
//
//   insertBreakpointTests.forEach(([testName, res, message]) => {
//     it(`should return ${testName} when Insert breakpoint is clicked | ESW-459`, async () => {
//       const user = userEvent.setup()
//       const step: Step = {
//         hasBreakpoint: false,
//         status: { _type: 'Pending' },
//         command: new Setup(Prefix.fromString('ESW.test'), 'Command-1'),
//         id: 'step1'
//       }
//
//       when(sequencerServiceMock.addBreakpoint(step.id)).thenResolve(res)
//
//       const menuItem = useBreakpointActionItem(step, false)
//       renderWithAuth({
//         ui: <MenuWithStepListContext menuItem={menuItem} />
//       })
//
//       const insertBreakpoint = await screen.findByText(insertBreakPointConstants.menuItemText)
//       await user.click(insertBreakpoint)
//
//       await screen.findByText(message)
//
//       verify(sequencerServiceMock.addBreakpoint(step.id)).called()
//     })
//   })
//
//   const removeBreakpointTests: [string, RemoveBreakpointResponse, string][] = [
//     [
//       'success',
//       {
//         _type: 'Ok'
//       },
//       removeBreakPointConstants.successMessage
//     ],
//     [
//       'Unhandled',
//       {
//         _type: 'Unhandled',
//         msg: 'Cannot remove breakpoint in idle state',
//         state: 'Idle',
//         messageType: 'Unhandled'
//       },
//       `${removeBreakPointConstants.failureMessage}, reason: Cannot remove breakpoint in idle state`
//     ],
//     [
//       'IdDoesNotExist',
//       {
//         _type: 'IdDoesNotExist',
//         id: 'step1'
//       },
//       `${removeBreakPointConstants.failureMessage}, reason: ${stepConstants.idDoesNotExistMsg('step1')}`
//     ]
//   ]
//
//   removeBreakpointTests.forEach(([testName, res, message]) => {
//     it(`should return ${testName} when Remove breakpoint is clicked | ESW-459`, async () => {
//       const user = userEvent.setup()
//       const step: Step = {
//         hasBreakpoint: true,
//         status: { _type: 'Pending' },
//         command: new Setup(Prefix.fromString('ESW.test'), 'Command-1'),
//         id: 'step1'
//       }
//
//       when(sequencerServiceMock.removeBreakpoint(step.id)).thenResolve(res)
//
//       const menuItem = useBreakpointActionItem(step, false)
//       renderWithAuth({
//         ui: <MenuWithStepListContext menuItem={menuItem} />
//       })
//
//       const removeBreakpoint = await screen.findByText(removeBreakPointConstants.menuItemText)
//       await user.click(removeBreakpoint)
//
//       await screen.findByText(message)
//
//       verify(sequencerServiceMock.removeBreakpoint(step.id)).called()
//     })
//   })
// })
