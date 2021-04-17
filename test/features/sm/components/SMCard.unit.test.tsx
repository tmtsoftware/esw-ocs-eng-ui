import { screen, waitFor } from '@testing-library/react'
import type { HttpLocation } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { when } from 'ts-mockito'
import { SMServiceProvider } from '../../../../src/contexts/SMContext'
import { SMCard } from '../../../../src/features/sm/components/smcard/SMCard'
import { SM_CONNECTION } from '../../../../src/features/sm/constants'
import { getMockServices, renderWithAuth } from '../../../utils/test-utils'

describe('SMCard', () => {
  const mockServices = getMockServices()
  const locServiceMock = mockServices.mock.locationService
  when(locServiceMock.track(SM_CONNECTION)).thenReturn(() => ({
    cancel: () => ({})
  }))

  it('should show Spawn button if Sequence Manager is not spawned | ESW-441', async () => {
    renderWithAuth({
      ui: (
        <SMServiceProvider initialValue={[undefined, false]}>
          <SMCard />
        </SMServiceProvider>
      ),
      mockClients: mockServices
    })

    await waitFor(
      () => expect(screen.queryByRole('button', { name: 'Shutdown' })).to.null
    )

    await screen.findByRole('button', { name: 'Spawn' })
  })

  it('should show Shutdown button if Sequence Manager is already spawned | ESW-441', async () => {
    const smLocation: HttpLocation = {
      _type: 'HttpLocation',
      connection: SM_CONNECTION,
      uri: 'url',
      metadata: {}
    }

    renderWithAuth({
      ui: (
        <SMServiceProvider
          initialValue={[
            { smService: mockServices.instance.smService, smLocation },
            false
          ]}>
          <SMCard />
        </SMServiceProvider>
      ),
      mockClients: mockServices
    })

    await waitFor(
      () => expect(screen.queryByRole('button', { name: 'Spawn' })).to.null
    )

    await screen.findByRole('button', { name: 'Shutdown' })
  })
})
