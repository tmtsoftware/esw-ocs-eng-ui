import { waitFor } from '@testing-library/react'
import { Prefix } from '@tmtsoftware/esw-ts'
import type {
  AgentStatus,
  AgentStatusResponse,
  SequenceComponentStatus
} from '@tmtsoftware/esw-ts/lib/dist/src/clients/sequence-manager/models/SequenceManagerRes'
import { ComponentId } from '@tmtsoftware/esw-ts/lib/dist/src/models/ComponentId'
import { expect } from 'chai'
import React from 'react'
import { mock, verify, when } from 'ts-mockito'
import Provision from '../../../../../src/features/sm/components/provision/Provision'
import { getMockServices, renderWithAuth } from '../../../../utils/test-utils'

describe('Provision Component', () => {
  const mockServices = getMockServices()
  const smService = mockServices.mock.smService
  const sequenceComponentStatus = mock<SequenceComponentStatus>()

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

  unProvisionRenderTestData.forEach(([agentStatus, name]) => {
    it(`should render Unprovision button if there is no sequence component running ${name} | ESW-444`, async () => {
      when(smService.getAgentStatus()).thenResolve(agentStatus)

      const { getByRole, queryByRole } = renderWithAuth({
        ui: <Provision />,
        loggedIn: true,
        mockClients: mockServices.serviceFactoryContext
      })

      await waitFor(
        () => expect(getByRole('button', { name: 'Unprovision' })).to.be.exist
      )

      await waitFor(
        () => expect(queryByRole('button', { name: 'Provision' })).to.null
      )

      verify(smService.getAgentStatus()).called()
    })
  })

  it('should render Provision button | ESW-444', async () => {
    const agentStatusSuccess: AgentStatusResponse = {
      _type: 'Success',
      agentStatus: [],
      seqCompsWithoutAgent: []
    }

    when(smService.getAgentStatus()).thenResolve(agentStatusSuccess)

    const { getByRole, queryByRole } = renderWithAuth({
      ui: <Provision />,
      loggedIn: true,
      mockClients: mockServices.serviceFactoryContext
    })

    await waitFor(
      () => expect(getByRole('button', { name: 'Provision' })).to.be.exist
    )

    await waitFor(
      () => expect(queryByRole('button', { name: 'UnProvision' })).to.null
    )

    verify(smService.getAgentStatus()).called()
  })
})
