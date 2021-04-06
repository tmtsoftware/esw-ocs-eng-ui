import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Prefix } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { deepEqual, when } from 'ts-mockito'
import { AddSequenceComponent } from '../../../../src/features/agent/components/AddSequenceComponent'
import { getMockServices, renderWithAuth } from '../../../utils/test-utils'

describe('Add sequence component icon', () => {
  const agentPrefix = new Prefix('ESW', 'primary')
  const mockServices = getMockServices()
  const agentService = mockServices.mock.agentService
  const seqCompName = 'ESW_1'

  it('should open pop-up to add component name', async function () {
    renderWithAuth({
      ui: <AddSequenceComponent agentPrefix={agentPrefix} />,
      mockClients: mockServices.serviceFactoryContext
    })
    await assertPopup()
  })

  it('should show validation error on invalid component name', async function () {
    renderWithAuth({
      ui: <AddSequenceComponent agentPrefix={agentPrefix} />,
      mockClients: mockServices.serviceFactoryContext
    })
    await assertPopup()
    userEvent.type(screen.getByRole('textbox'), ' primary21 ')
    userEvent.click(screen.getByRole('button', { name: 'OK' }))
    await screen.findByText(
      'component name has leading and trailing whitespaces'
    )
  })

  it('should spawn sequence component on a agent', async function () {
    when(
      agentService.spawnSequenceComponent(
        deepEqual(agentPrefix),
        deepEqual(seqCompName)
      )
    ).thenResolve({ _type: 'Spawned' })

    renderWithAuth({
      ui: <AddSequenceComponent agentPrefix={agentPrefix} />,
      mockClients: mockServices.serviceFactoryContext
    })
    await assertPopup()
    userEvent.type(screen.getByRole('textbox'), 'ESW_1')
    userEvent.click(screen.getByRole('button', { name: 'OK' }))

    await screen.findByText(
      'Successfully spawned Sequence Component: ESW.ESW_1'
    )
  })

  it('should spawn sequence component on a agent', async function () {
    when(
      agentService.spawnSequenceComponent(
        deepEqual(agentPrefix),
        deepEqual(seqCompName)
      )
    ).thenResolve({
      _type: 'Failed',
      msg: 'Failed to spawn Sequence Component'
    })

    renderWithAuth({
      ui: <AddSequenceComponent agentPrefix={agentPrefix} />,
      mockClients: mockServices.serviceFactoryContext
    })

    await assertPopup()
    userEvent.type(screen.getByRole('textbox'), 'ESW_1')
    userEvent.click(screen.getByRole('button', { name: 'OK' }))

    await screen.findByText(
      'Sequence Component could not be spawned, reason: Failed to spawn Sequence Component'
    )
  })

  const assertPopup = async () => {
    const icon = await screen.findByRole('addSeqCompIcon')
    userEvent.click(icon)
    const inputBox = await screen.findByText('Component name:')
    expect(inputBox).to.exist
  }
})
