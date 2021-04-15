import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentId, Prefix } from '@tmtsoftware/esw-ts'
import React from 'react'
import { deepEqual, when } from 'ts-mockito'
import { KillSequenceComponent } from '../../../../src/features/agent/components/KillSequenceComponent'
import { getMockServices, renderWithAuth } from '../../../utils/test-utils'

describe('Kill sequence component button | ESW-446', () => {
  const prefix = new Prefix('ESW', 'ESW_1')
  const sequenceComponentID = new ComponentId(prefix, 'SequenceComponent')
  const mockServices = getMockServices()

  it('should remove sequence component from agent | ESW-446', async function () {
    const agentService = mockServices.mock.agentService
    when(
      agentService.killComponent(deepEqual(sequenceComponentID))
    ).thenResolve({ _type: 'Killed' })

    renderWithAuth({
      ui: <KillSequenceComponent componentId={sequenceComponentID} />,
      mockClients: mockServices
    })
    const killIcon = await screen.findByRole('deleteSeqCompIcon')
    userEvent.click(killIcon)
    await screen.findByText(
      `Successfully killed Sequence Component: ${prefix.toJSON()}`
    )
  })

  it('should give error when kill sequence component fails | ESW-446', async function () {
    const agentService = mockServices.mock.agentService
    when(
      agentService.killComponent(deepEqual(sequenceComponentID))
    ).thenResolve({ _type: 'Failed', msg: 'Failed to kill Sequence Component' })

    renderWithAuth({
      ui: <KillSequenceComponent componentId={sequenceComponentID} />,
      mockClients: mockServices
    })
    const killIcon = await screen.findByRole('deleteSeqCompIcon')
    userEvent.click(killIcon)
    await screen.findByText(
      'Sequence Component could not be killed, reason: Failed to kill Sequence Component'
    )
  })
})
