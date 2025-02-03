import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpConnection, Prefix } from '@tmtsoftware/esw-ts'
import type { HttpLocation } from '@tmtsoftware/esw-ts'
import { anything, capture, when } from '@johanblumenberg/ts-mockito'
import { expect } from 'chai'
import React from 'react'
import { SpawnSMButton } from '../../../../src/features/sm/components/SpawnButton'
import { OBS_MODE_CONFIG } from '../../../../src/features/sm/constants'
import { spawnSMConstants } from '../../../../src/features/sm/smConstants'
import { mockServices, renderWithAuth } from '../../../utils/test-utils'

describe('SpawnSMButton', () => {
  const user = userEvent.setup()
  const locServiceMock = mockServices.mock.locationService
  when(locServiceMock.track(anything())).thenReturn(() => {
    return {
      cancel: () => ({})
    }
  })
  it('should spawn the sequence manager | ESW-441', async () => {
    const agentServiceMock = mockServices.mock.agentService
    const agentPrefix = new Prefix('ESW', 'ESW.Machine1')
    const agentLocation: HttpLocation = {
      _type: 'HttpLocation',
      connection: HttpConnection(agentPrefix, 'Service'),
      uri: 'url',
      metadata: {}
    }

    when(locServiceMock.listByComponentType('Machine')).thenResolve([agentLocation])

    when(agentServiceMock.spawnSequenceManager(anything(), OBS_MODE_CONFIG, false)).thenResolve({ _type: 'Spawned' })

    renderWithAuth({
      ui: <SpawnSMButton />
    })

    //User clicks spawn button
    const spawnButton = await screen.findByRole('button', { name: 'Spawn' })
    await user.click(spawnButton)

    //modal will appear with spawn button
    await screen.findByText(spawnSMConstants.modalTitle)

    // const modalDocument = screen.getByRole('document')
    // const modalSpawnButton = within(modalDocument).getByRole('button', {
    //   name: spawnSMConstants.modalOkText
    // })
    const modalSpawnButton = screen.getAllByRole('button', {
      name: spawnSMConstants.modalOkText
    })
    // TODO: FIXME: screen.findByRole('document') above did not work anymore after dependency update
    const menuItem = screen.getByRole('menuitem', {
      name: agentPrefix.toJSON()
    })
    //User selects agent machine
    await user.click(menuItem)

    //User clicks modal's spawn button
    await user.click(modalSpawnButton[1])

    await screen.findByText(spawnSMConstants.successMessage)

    const [prefix, expectedConfig, isLocal] = capture(agentServiceMock.spawnSequenceManager).first()

    expect(prefix.toJSON()).eq(agentPrefix.toJSON())
    expect(expectedConfig).eq(OBS_MODE_CONFIG)
    expect(isLocal).to.false
  })

  it('should show error message if no agents are present and user tries spawning machine | ESW-441', async () => {
    when(locServiceMock.listByComponentType('Machine')).thenResolve([])

    renderWithAuth({
      ui: <SpawnSMButton />
    })

    //User clicks spawn button
    const spawnButton = await screen.findByRole('button', { name: 'Spawn' })
    await user.click(spawnButton)

    await screen.findByText(spawnSMConstants.agentNotRunningMessage)

    await waitFor(() => expect(screen.queryByText(spawnSMConstants.modalTitle)).not.exist)
  })

  it('should show notification if spawning sequence manager fails | ESW-441', async () => {
    const agentServiceMock = mockServices.mock.agentService

    const agentPrefix = new Prefix('ESW', 'ESW.Machine1')
    const agentLocation: HttpLocation = {
      _type: 'HttpLocation',
      connection: HttpConnection(agentPrefix, 'Service'),
      uri: 'url',
      metadata: {}
    }

    when(locServiceMock.listByComponentType('Machine')).thenResolve([agentLocation])

    when(agentServiceMock.spawnSequenceManager(anything(), OBS_MODE_CONFIG, false)).thenResolve({
      _type: 'Failed',
      msg: 'Config file not found'
    })

    renderWithAuth({
      ui: <SpawnSMButton />
    })

    //User clicks spawn button
    const spawnButton = await screen.findByRole('button', { name: 'Spawn' })
    await user.click(spawnButton)

    //modal will appear with spawn button
    await screen.findByText(spawnSMConstants.modalTitle)

    // const modalDocument = screen.getByRole('document')
    // const modalSpawnButton = within(modalDocument).getByRole('button', {
    //   name: spawnSMConstants.modalOkText
    // })
    const modalSpawnButton = screen.getAllByRole('button', {
      name: spawnSMConstants.modalOkText
    })
    // TODO: FIXME: screen.findByRole('document') above did not work anymore after dependency update

    const menuItem = screen.getByRole('menuitem', {
      name: agentPrefix.toJSON()
    })
    //User selects agent machine
    await user.click(menuItem)

    //User clicks modal's spawn button
    await user.click(modalSpawnButton[1])

    await screen.findByText(`${spawnSMConstants.failureMessage}, reason: Config file not found`)
  })
})
