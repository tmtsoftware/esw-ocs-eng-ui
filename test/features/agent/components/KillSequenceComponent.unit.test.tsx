import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentId, KillResponse, Prefix } from '@tmtsoftware/esw-ts'
import { Menu } from 'antd'
import { expect } from 'chai'
import React from 'react'
import { deepEqual, verify, when } from 'ts-mockito'
import { KillSequenceComponent } from '../../../../src/features/agent/components/KillSequenceComponent'
import { mockServices, renderWithAuth } from '../../../utils/test-utils'

describe('Kill sequence component button', () => {
  const prefix = new Prefix('ESW', 'ESW_1')
  const sequenceComponentID = new ComponentId(prefix, 'SequenceComponent')
  const responseScenarios: [string, KillResponse, string][] = [
    [
      'Killed',
      {
        _type: 'Killed'
      },
      `Successfully killed Sequence Component: ${prefix.toJSON()}`
    ],
    [
      'Failed',
      {
        _type: 'Failed',
        msg: 'Ask timed out'
      },
      `Sequence Component (${prefix.toJSON()}) could not be killed, reason: Ask timed out`
    ]
  ]

  responseScenarios.forEach(([testName, res, message]) => {
    it.only(`should return ${testName} when ShutdownComponent is clicked  | ESW-446, ESW-502`, async () => {
      const agentService = mockServices.mock.agentService
      when(agentService.killComponent(deepEqual(sequenceComponentID))).thenResolve(res)
      renderWithAuth({
        ui: (
          <Menu>
            <KillSequenceComponent componentId={sequenceComponentID} />
          </Menu>
        )
      })
      const KillSequenceComponentItem = screen.getByRole('KillSequenceComponent')
      await waitFor(() => userEvent.click(KillSequenceComponentItem))

      await screen.findByText(`Do you want to delete ${sequenceComponentID.prefix.toJSON()} sequence component?`)

      const document = screen.getByRole('document')
      const confirm = within(document).getByRole('button', { name: /delete/i })
      userEvent.click(confirm)

      await screen.findByText(message)

      verify(agentService.killComponent(deepEqual(sequenceComponentID))).called()

      await waitFor(
        () =>
          expect(screen.queryByText(`Do you want to delete ${sequenceComponentID.prefix.toJSON()} sequence component?`))
            .to.null
      )
    })
  })
})
