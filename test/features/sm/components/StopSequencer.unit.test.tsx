// import { screen, waitFor } from '@testing-library/react'
// import userEvent from '@testing-library/user-event'
// import { ObsMode, Prefix } from '@tmtsoftware/esw-ts'
// import type { SequencerState, ShutdownSequencersResponse, Subsystem } from '@tmtsoftware/esw-ts'
// import { anything, deepEqual, reset, verify, when } from '@johanblumenberg/ts-mockito'
// import { Menu } from 'antd'
// import { expect } from 'chai'
// import React from 'react'
// import { useStopSequencerItem } from '../../../../src/features/sm/components/StopSequencer'
// import { stopSequencerConstants } from '../../../../src/features/sm/smConstants'
// import { _createErrorMsg } from '../../../../src/utils/message'
// import { mockServices, renderWithAuth } from '../../../utils/test-utils'
// import '@ant-design/v5-patch-for-react-19'
//
// describe('Stop Sequencer', () => {
//   const user = userEvent.setup()
//   beforeEach(() => reset(mockServices.mock.smService))
//   const obsMode = new ObsMode('DarkNight')
//   const subsystem: Subsystem = 'ESW'
//   const smService = mockServices.mock.smService
//   const darkNight = new Prefix('ESW', obsMode.name)
//   const failureMessage = stopSequencerConstants.failureMessage(darkNight)
//   const tests: [string, ShutdownSequencersResponse, string][] = [
//     [
//       'success',
//       {
//         _type: 'Success'
//       },
//       stopSequencerConstants.successMessage(darkNight)
//     ],
//     [
//       'locationServiceError',
//       {
//         _type: 'LocationServiceError',
//         reason: 'Sequencer component not found'
//       },
//       _createErrorMsg(failureMessage, 'Sequencer component not found')
//     ],
//     [
//       'Unhandled',
//       {
//         _type: 'Unhandled',
//         msg: 'ShutdownSequencer message type is not supported in Processing state',
//         state: 'Idle',
//         messageType: 'Unhandled'
//       },
//       _createErrorMsg(failureMessage, 'ShutdownSequencer message type is not supported in Processing state')
//     ],
//     [
//       'FailedResponse',
//       {
//         _type: 'FailedResponse',
//         reason: 'Unload message timed out'
//       },
//       _createErrorMsg(failureMessage, 'Unload message timed out')
//     ]
//   ]
//
//   tests.forEach(([testname, response, message]) => {
//     const running: SequencerState = {
//       _type: 'Running'
//     }
//
//     const modalTitleText = stopSequencerConstants.getModalTitleWithState(darkNight.toJSON(), running)
//     it(`should return ${testname} | ESW-447, ESW-507`, async () => {
//       when(smService.shutdownSequencer(deepEqual(subsystem), deepEqual(obsMode), anything())).thenResolve(response)
//
//       renderWithAuth({
//         ui: (<Menu items={[useStopSequencerItem(darkNight, running)]}/>)
//       })
//
//       const stopSequencer = screen.getByText(stopSequencerConstants.menuItemText)
//
//       await user.click(stopSequencer)
//
//       // expect modal to be visible
//       const modalTitle = await screen.findByText(modalTitleText)
//       expect(modalTitle).to.exist
//
//       const confirmButton = screen.getByRole('button', {
//         name: stopSequencerConstants.modalOkText
//       })
//       await user.click(confirmButton)
//
//       await screen.findByText(message)
//
//       verify(smService.shutdownSequencer(deepEqual(subsystem), deepEqual(obsMode), anything())).called()
//       await waitFor(() => expect(screen.queryByText(modalTitleText)).to.null)
//     })
//   })
//
//   it(`should show confirm modal without state if sequencer is not inProgress | ESW-506`, async () => {
//     when(smService.shutdownSequencer(deepEqual(subsystem), deepEqual(obsMode), anything())).thenResolve({
//       _type: 'Success'
//     })
//     const sequencerState: SequencerState = {
//       _type: 'Idle'
//     }
//     renderWithAuth({
//       ui: (
//         <Menu items={[useStopSequencerItem(darkNight, sequencerState)]}/>
//       )
//     })
//
//     const stopSequencer = screen.getByText(stopSequencerConstants.menuItemText)
//     const modalTitleText = stopSequencerConstants.getModalTitle(darkNight.toJSON())
//     await user.click(stopSequencer)
//     const modalTitle = await screen.findByText(modalTitleText)
//     expect(modalTitle).to.exist
//
//     const confirmButton = screen.getByRole('button', {
//       name: stopSequencerConstants.modalOkText
//     })
//     await user.click(confirmButton)
//     await screen.findAllByText(stopSequencerConstants.successMessage(darkNight))
//
//     verify(smService.shutdownSequencer(deepEqual(subsystem), deepEqual(obsMode), anything())).called()
//   })
// })
