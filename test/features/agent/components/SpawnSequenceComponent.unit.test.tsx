import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Prefix } from '@tmtsoftware/esw-ts'
import type { SpawnResponse } from '@tmtsoftware/esw-ts'
import { deepEqual, when } from '@johanblumenberg/ts-mockito'
import { expect } from 'chai'
import React from 'react'
import { spawnSequenceComponentConstants } from '../../../../src/features/agent/agentConstants'
import { SpawnSequenceComponent } from '../../../../src/features/agent/components/SpawnSequenceComponent'
import { mockServices, renderWithAuth } from '../../../utils/test-utils'
import '@ant-design/v5-patch-for-react-19'

describe('Spawn sequence component icon', () => {
  const user = userEvent.setup()
  const agentPrefix = new Prefix('ESW', 'primary')
  const agentService = mockServices.mock.agentService
  const seqCompName = 'ESW_1'

  it('should open pop-up to add component name | ESW-446', async function () {
    renderWithAuth({
      ui: <SpawnSequenceComponent agentPrefix={agentPrefix} />
    })
    await assertPopup()
  })

  it('should show validation error on invalid component name | ESW-446', async function () {
    renderWithAuth({
      ui: <SpawnSequenceComponent agentPrefix={agentPrefix} />
    })
    await assertPopup()
    const textBox = screen.getByRole('textbox')
    await waitFor(() => user.click(textBox))
    await userEvent.type(textBox, ' primary21 ')
    await user.click(screen.getByRole('button', { name: spawnSequenceComponentConstants.modalOkText }))
    await screen.findByText(spawnSequenceComponentConstants.whiteSpaceValidation)
  })

  it("should show validation error on invalid component name with '-' | ESW-446", async function () {
    renderWithAuth({
      ui: <SpawnSequenceComponent agentPrefix={agentPrefix} />
    })
    await assertPopup()
    const textBox = screen.getByRole('textbox')
    await waitFor(() => user.click(textBox))
    await userEvent.type(textBox, 'primary-21')
    await user.click(screen.getByRole('button', { name: spawnSequenceComponentConstants.modalOkText }))
    await screen.findByText(spawnSequenceComponentConstants.hyphenValidation)
  })

  const tests: [string, SpawnResponse, string][] = [
    [
      'spawn',
      { _type: 'Spawned' },
      spawnSequenceComponentConstants.getSuccessMessage(`${agentPrefix.subsystem}.${seqCompName}`)
    ],
    [
      'fail to spawn',
      {
        _type: 'Failed',
        msg: 'Failed to spawn Sequence Component'
      },
      `${spawnSequenceComponentConstants.getFailureMessage}, reason: Failed to spawn Sequence Component`
    ]
  ]

  tests.forEach(([testname, response, message]) => {
    it(`should ${testname} sequence component on a agent | ESW-446`, async function () {
      when(agentService.spawnSequenceComponent(deepEqual(agentPrefix), deepEqual(seqCompName))).thenResolve(response)

      renderWithAuth({
        ui: <SpawnSequenceComponent agentPrefix={agentPrefix} />
      })
      await assertPopup()
      const textBox = screen.getByRole('textbox')
      await waitFor(() => user.click(textBox))
      await userEvent.type(textBox, seqCompName)
      await user.click(screen.getByRole('button', { name: spawnSequenceComponentConstants.modalOkText }))

      await screen.findByText(message)
    })
  })

  const assertPopup = async () => {
    const icon = await screen.findByRole('addSeqCompIcon')
    await waitFor(() => user.click(icon))
    const inputBox = await screen.findByText('Add a sequence component')
    expect(inputBox).to.exist
  }
})
