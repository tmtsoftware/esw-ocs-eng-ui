import { screen, waitFor } from '@testing-library/react'
import { HttpLocation, GATEWAY_CONNECTION } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { anything, verify, when } from 'ts-mockito'
import { createServiceCtx } from '../../../src/contexts/utils/createServiceCtx'
import { mockServices, renderWithAuth } from '../../utils/test-utils'
const gatewayLocation: HttpLocation = {
  _type: 'HttpLocation',
  connection: GATEWAY_CONNECTION,
  uri: 'http://localhost:5000/',
  metadata: { agentPrefix: 'ESW.primary' }
}
describe('Service context helper', () => {
  const serviceInstance = 'dummyService'

  const factory = () => {
    return serviceInstance
  }

  const [useContext, Provider] = createServiceCtx(GATEWAY_CONNECTION, factory)

  const Component = () => {
    const [str] = useContext()
    return <span>{str ? str : 'Unknown'}</span>
  }
  it('returns undefined for a provided factory with use hook', async () => {
    when(mockServices.mock.locationService.track(anything())).thenReturn(() => {
      return {
        cancel: () => ({})
      }
    })

    renderWithAuth({
      ui: (
        <Provider>
          <Component />
        </Provider>
      )
    })

    await waitFor(() => {
      expect(screen.getByText('Unknown')).to.exist
    })

    verify(mockServices.mock.locationService.track(anything())).called()
  })

  it('returns instance of a provided factory with use hook', async () => {
    when(mockServices.mock.locationService.track(anything())).thenReturn(
      (cb) => {
        cb({ _type: 'LocationUpdated', location: gatewayLocation })
        return {
          cancel: () => ({})
        }
      }
    )

    renderWithAuth({
      ui: (
        <Provider>
          <Component />
        </Provider>
      )
    })

    await waitFor(() => {
      expect(screen.getByText(serviceInstance)).to.exist
    })

    verify(mockServices.mock.locationService.track(anything())).called()
  })
})
