// import { screen, waitFor } from '@testing-library/react'
// import userEvent from '@testing-library/user-event'
// import { ComponentId, ObsMode, Prefix } from '@tmtsoftware/esw-ts'
// import type { SequencerState } from '@tmtsoftware/esw-ts'
// import { anything, deepEqual, verify, when } from '@johanblumenberg/ts-mockito'
// import { Menu } from 'antd'
// import { expect } from 'chai'
// import React from 'react'
// import { reloadScriptConstants } from '../../../../src/features/sm/smConstants'
// import { mockServices, renderWithAuth } from '../../../utils/test-utils'
// import { useReloadScriptItem } from '../../../../src/features/sm/components/ReloadScript'
// import '@ant-design/v5-patch-for-react-19'
//
// describe('Reload script', () => {
//   const user = userEvent.setup()
//   const smService = mockServices.mock.smService
//   const obsMode = new ObsMode('Darknight')
//   const subsystem = 'ESW'
//   const sequencerPrefix = new Prefix(subsystem, obsMode.toJSON())
//   const componentId = new ComponentId(sequencerPrefix, 'Sequencer')
//
//   it(`should return Success when Reload Script is clicked | ESW-502`, async () => {
//     when(smService.restartSequencer(deepEqual(subsystem), deepEqual(obsMode), anything())).thenResolve({
//       _type: 'Success',
//       componentId: componentId
//     })
//
//     const running: SequencerState = {
//       _type: 'Running'
//     }
//
//     renderWithAuth({
//       ui: (
//         <Menu items={[useReloadScriptItem(sequencerPrefix, running)]}/>
//       )
//     })
//
//     const ReloadScriptItem = screen.getByRole('ReloadScript')
//     await waitFor(() => user.click(ReloadScriptItem))
//
//     // expect modal to be visible
//     const modalTitle = await screen.findByText(
//       reloadScriptConstants.getModalTitleWithState(new Prefix(subsystem, obsMode.name).toJSON(), running)
//     )
//     expect(modalTitle).to.exist
//
//     // const document = screen.getByRole('document')
//     // const reloadConfirm = within(document).getByRole('button', {
//     //   name: reloadScriptConstants.modalOkText
//     // })
//     const reloadConfirm = screen.getAllByRole('button', {
//       name: reloadScriptConstants.modalOkText
//     })
//     // TODO: FIXME: screen.findByRole('document') above did not work anymore after dependency update
//     await user.click(reloadConfirm[0])
//
//     await screen.findByText(reloadScriptConstants.getSuccessMessage(`${subsystem}.${obsMode.toJSON()}`))
//     await waitFor(
//       () =>
//         expect(
//           screen.queryByText(
//             reloadScriptConstants.getModalTitleWithState(new Prefix(subsystem, obsMode.name).toJSON(), running)
//           )
//         ).to.null
//     )
//     verify(smService.restartSequencer(deepEqual(subsystem), deepEqual(obsMode), anything())).called()
//   })
//
//   it(`should show confirm modal without state when sequencer is not inProgress | ESW-506`, async () => {
//     when(smService.restartSequencer(deepEqual(subsystem), deepEqual(obsMode))).thenResolve({
//       _type: 'Success',
//       componentId: componentId
//     })
//
//     const sequencerState: SequencerState = { _type: 'Idle' }
//
//     renderWithAuth({
//       ui: (
//         <Menu items={[useReloadScriptItem(sequencerPrefix, sequencerState)]}/>
//       )
//     })
//
//     const ReloadScriptItem = screen.getByRole('ReloadScript')
//     await waitFor(() => user.click(ReloadScriptItem))
//
//     // expect modal to be visible
//     const modalTitle = await screen.findByText(
//       reloadScriptConstants.getModalTitle(new Prefix(subsystem, obsMode.name).toJSON())
//     )
//     expect(modalTitle).to.exist
//
//     // const document = screen.getByRole('document')
//     // const reloadConfirm = within(document).getByRole('button', {
//     //   name: reloadScriptConstants.modalOkText
//     // })
//     const reloadConfirm = screen.getAllByRole('button', {
//       name: reloadScriptConstants.modalOkText
//     })
//     // TODO: FIXME: screen.findByRole('document') above did not work anymore after dependency update
//     await user.click(reloadConfirm[0])
//
//     await screen.findByText(reloadScriptConstants.getSuccessMessage(`${subsystem}.${obsMode.toJSON()}`))
//     verify(smService.restartSequencer(deepEqual(subsystem), deepEqual(obsMode), anything())).called()
//   })
// })
