import { screen, waitFor } from '@testing-library/react'
import {
  AgentStatus,
  AgentStatusResponse,
  ComponentId,
  HttpLocation,
  Prefix,
  SequenceComponentStatus
} from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { mock, verify, when } from 'ts-mockito'
import { SmActions } from '../../../src/containers/infrastructure/SMActions'
import { SM_CONNECTION } from '../../../src/features/sm/constants'
import { getMockServices, renderWithAuth } from '../../utils/test-utils'

describe('SM actions', () => {
  const mockServices = getMockServices()
  const agentService = mockServices.mock.agentService
  const locationService = mockServices.mock.locationService
  const sequenceComponentStatus = mock<SequenceComponentStatus>()
  when(locationService.track(SM_CONNECTION)).thenReturn(() => {
    return { cancel: () => ({}) }
  })
  const agentStatus: AgentStatus = {
    agentId: new ComponentId(new Prefix('APS', 'jdks'), 'Machine'),
    seqCompsStatus: [sequenceComponentStatus]
  }

  const agentStatusSuccess1: AgentStatusResponse = {
    _type: 'Success',
    agentStatus: [agentStatus],
    seqCompsWithoutAgent: []
  }

  const agentStatusSuccess2: AgentStatusResponse = {
    _type: 'Success',
    agentStatus: [],
    seqCompsWithoutAgent: [sequenceComponentStatus]
  }

  const unProvisionRenderTestData: [AgentStatusResponse, string][] = [
    [agentStatusSuccess1, 'on any agent'],
    [agentStatusSuccess2, 'without any agent']
  ]
  unProvisionRenderTestData.map(([agentStatusResponse, name]) => {
    it(`should render provision button as enabled & configure button as disabled if no seq comps are running ${name} | ESW-442, ESW-445`, async () => {
      when(agentService.getAgentStatus()).thenResolve(agentStatusResponse)
      const smLocation: HttpLocation = {
        _type: 'HttpLocation',
        connection: SM_CONNECTION,
        uri: 'url',
        metadata: { agentPrefix: 'ESW.primary' }
      }
      renderWithAuth({
        ui: <SmActions />,
        mockClients: mockServices.serviceFactoryContext
      })

      const configureButton = screen.getByRole('button', {
        name: 'Configure'
      }) as HTMLButtonElement

      const provisionButton = screen.getByRole('button', {
        name: 'Provision'
      }) as HTMLButtonElement

      expect(configureButton.disabled).true
      expect(provisionButton.disabled).false

      // wait for both buttons to be enabled once data is loaded in async manner
      await waitFor(() => {
        expect(
          (screen.getByRole('button', {
            name: 'Provision'
          }) as HTMLButtonElement).disabled
        ).false
      })
      await waitFor(() => {
        expect(
          (screen.getByRole('button', {
            name: 'Configure'
          }) as HTMLButtonElement).disabled
        ).false
      })

      verify(agentService.getAgentStatus()).called()
    })
  })
})
