// import { screen } from '@testing-library/react'
// import userEvent from '@testing-library/user-event'
// import { Prefix, Setup } from '@tmtsoftware/esw-ts'
// import type { GenericResponse, Step } from '@tmtsoftware/esw-ts'
// import { verify, when } from '@johanblumenberg/ts-mockito'
// import React from 'react'
// import { useDeleteActionItem } from '../../../../../src/features/sequencer/components/steplist/DeleteAction'
// import { deleteStepConstants, stepConstants } from '../../../../../src/features/sequencer/sequencerConstants'
// import { MenuWithStepListContext, renderWithAuth, sequencerServiceMock } from '../../../../utils/test-utils'
// import '@ant-design/v5-patch-for-react-19'
//
// describe('Delete action', () => {
//   const user = userEvent.setup()
//   const deleteActionTests: [string, GenericResponse, string][] = [
//     [
//       'success',
//       {
//         _type: 'Ok'
//       },
//       deleteStepConstants.successMessage
//     ],
//     [
//       'CannotOperateOnAnInFlightOrFinishedStep',
//       {
//         _type: 'CannotOperateOnAnInFlightOrFinishedStep'
//       },
//       `${deleteStepConstants.failureMessage}, reason: ${stepConstants.cannotOperateOnAnInFlightOrFinishedStepMsg}`
//     ],
//     [
//       'Unhandled',
//       {
//         _type: 'Unhandled',
//         msg: 'Cannot delete step in idle state',
//         state: 'Idle',
//         messageType: 'Unhandled'
//       },
//       `${deleteStepConstants.failureMessage}, reason: Cannot delete step in idle state`
//     ],
//     [
//       'IdDoesNotExist',
//       {
//         _type: 'IdDoesNotExist',
//         id: 'step1'
//       },
//       `${deleteStepConstants.failureMessage}, reason: ${stepConstants.idDoesNotExistMsg('step1')}`
//     ]
//   ]
//
//   deleteActionTests.forEach(([testName, res, message]) => {
//     it(`should return ${testName} when delete is clicked | ESW-490`, async () => {
//       const step: Step = {
//         hasBreakpoint: false,
//         status: { _type: 'Pending' },
//         command: new Setup(Prefix.fromString('ESW.test'), 'Command-1'),
//         id: 'step1'
//       }
//
//       when(sequencerServiceMock.delete(step.id)).thenResolve(res)
//       const menuItem = useDeleteActionItem(step, false)
//       renderWithAuth({
//         ui: <MenuWithStepListContext menuItem={menuItem} />
//       })
//
//       const deleteButton = await screen.findByText(deleteStepConstants.menuItemText)
//       await user.click(deleteButton)
//
//       await screen.findByText(deleteStepConstants.getModalTitle('Command-1'))
//       const deleteStep = screen.getByRole('button', { name: deleteStepConstants.modalOkText })
//
//       await user.click(deleteStep)
//
//       await screen.findByText(message)
//
//       verify(sequencerServiceMock.delete(step.id)).called()
//     })
//   })
// })
