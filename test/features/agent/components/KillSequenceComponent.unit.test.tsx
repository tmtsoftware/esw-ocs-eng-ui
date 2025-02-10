// import { screen, waitFor } from '@testing-library/react'
// import userEvent from '@testing-library/user-event'
// import { ComponentId, Prefix } from '@tmtsoftware/esw-ts'
// import type { KillResponse } from '@tmtsoftware/esw-ts'
// import { deepEqual, verify, when } from '@johanblumenberg/ts-mockito'
// import { Menu } from 'antd'
// import { expect } from 'chai'
// import React from 'react'
// import { killSequenceComponentConstants } from '../../../../src/features/agent/agentConstants'
// import { mockServices, renderWithAuth } from '../../../utils/test-utils'
// import { useKillSequenceComponentItem } from '../../../../src/features/agent/components/KillSequenceComponent'
//
// describe('Kill sequence component button', () => {
//   const user = userEvent.setup()
//   const prefix = new Prefix('ESW', 'ESW_1')
//   const sequenceComponentID = new ComponentId(prefix, 'SequenceComponent')
//   const responseScenarios: [string, KillResponse, string][] = [
//     [
//       'Killed',
//       {
//         _type: 'Killed'
//       },
//       killSequenceComponentConstants.getSuccessMessage(prefix.toJSON())
//     ],
//     [
//       'Failed',
//       {
//         _type: 'Failed',
//         msg: 'Ask timed out'
//       },
//       `${killSequenceComponentConstants.getFailureMessage(prefix.toJSON())}, reason: Ask timed out`
//     ]
//   ]
//
//   responseScenarios.forEach(([testName, res, message]) => {
//     it(`should return ${testName} when ShutdownComponent is clicked  | ESW-446, ESW-502`, async () => {
//       const agentService = mockServices.mock.agentService
//       when(agentService.killComponent(deepEqual(sequenceComponentID))).thenResolve(res)
//       renderWithAuth({
//         ui: (
//           <Menu items={[useKillSequenceComponentItem(sequenceComponentID)]}/>
//         )
//       })
//       const KillSequenceComponentItem = screen.getByRole('KillSequenceComponent')
//       await waitFor(() => user.click(KillSequenceComponentItem))
//
//       await screen.findByText(killSequenceComponentConstants.getModalTitle(sequenceComponentID.prefix.toJSON()))
//
//       // const document = screen.getByRole('document')
//       // const confirm = within(document).getByRole('button', { name: killSequenceComponentConstants.modalOkText })
//       const confirm = screen.getAllByRole('button', {
//         name: killSequenceComponentConstants.modalOkText
//       })
//       // TODO: FIXME: screen.findByRole('document') above did not work anymore after dependency update
//       await user.click(confirm[0])
//
//       await screen.findByText(message)
//
//       verify(agentService.killComponent(deepEqual(sequenceComponentID))).called()
//
//       await waitFor(
//         () =>
//           expect(screen.queryByText(killSequenceComponentConstants.getModalTitle(sequenceComponentID.prefix.toJSON())))
//             .to.null
//       )
//     })
//   })
// })
