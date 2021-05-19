import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentId, Prefix } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { deepEqual, verify, when } from 'ts-mockito'
import { KillSequenceComponent } from '../../../../src/features/agent/components/KillSequenceComponent'
import { mockServices, renderWithAuth } from '../../../utils/test-utils'

describe('Kill sequence component button', () => {
  const prefix = new Prefix('ESW', 'ESW_1')
  const sequenceComponentID = new ComponentId(prefix, 'SequenceComponent')

  it('should remove sequence component from agent | ESW-446', async () => {
    const agentService = mockServices.mock.agentService
    when(
      agentService.killComponent(deepEqual(sequenceComponentID))
    ).thenResolve({ _type: 'Killed' })

    renderWithAuth({
      ui: <KillSequenceComponent componentId={sequenceComponentID} />
    })
    const killIcon = screen.getByRole('deleteSeqCompIcon')
    userEvent.click(killIcon)

    await screen.findByText(
      `Do you want to delete ${sequenceComponentID.prefix.toJSON()} sequence component?`
    )

    const document = screen.getByRole('document')
    const confirm = within(document).getByRole('button', { name: /delete/i })
    userEvent.click(confirm)

    await screen.findByText(
      `Successfully killed Sequence Component: ${prefix.toJSON()}`
    )

    verify(agentService.killComponent(deepEqual(sequenceComponentID))).called()

    await waitFor(
      () =>
        expect(
          screen.queryByText(
            `Do you want to delete ${sequenceComponentID.prefix.toJSON()} sequence component?`
          )
        ).to.null
    )
  })

  it('should give error when kill sequence component fails | ESW-446', async () => {
    const agentService = mockServices.mock.agentService
    when(
      agentService.killComponent(deepEqual(sequenceComponentID))
    ).thenResolve({ _type: 'Failed', msg: 'Failed to kill Sequence Component' })

    renderWithAuth({
      ui: <KillSequenceComponent componentId={sequenceComponentID} />
    })
    const killIcon = await screen.findByRole('deleteSeqCompIcon')
    await waitFor(() => userEvent.click(killIcon))

    await screen.findByText(
      `Do you want to delete ${sequenceComponentID.prefix.toJSON()} sequence component?`
    )

    const document = screen.getByRole('document')
    const confirm = within(document).getByRole('button', { name: /delete/i })

    userEvent.click(confirm)

    await screen.findByText(
      'Sequence Component could not be killed, reason: Failed to kill Sequence Component'
    )

    verify(agentService.killComponent(deepEqual(sequenceComponentID))).called()

    await waitFor(
      () =>
        expect(
          screen.queryByText(
            `Do you want to delete ${sequenceComponentID.prefix.toJSON()} sequence component?`
          )
        ).to.null
    )
  })
})
