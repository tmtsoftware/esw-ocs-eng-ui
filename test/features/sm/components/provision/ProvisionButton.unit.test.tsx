import type { ByRoleMatcher } from '@testing-library/dom/types/matches'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  AgentProvisionConfig,
  ConfigData,
  Prefix,
  ProvisionConfig
} from '@tmtsoftware/esw-ts'
import type { ProvisionResponse } from '@tmtsoftware/esw-ts/lib/dist/src/clients/sequence-manager/models/SequenceManagerRes'
import { expect } from 'chai'
import React from 'react'
import { deepEqual, verify, when } from 'ts-mockito'
import { ProvisionButton } from '../../../../../src/features/sm/components/provision/ProvisionButton'
import { PROVISION_CONF_PATH } from '../../../../../src/features/sm/constants'
import { getMockServices, renderWithAuth } from '../../../../utils/test-utils'

describe('ProvisionButton component', () => {
  const mockServices = getMockServices()
  const smService = mockServices.mock.smService
  const configService = mockServices.mock.configService
  const provisionRes: ProvisionResponse = {
    _type: 'Success'
  }

  const eswPrefixStr = 'ESW.machine1'
  const tcsPrefixStr = 'TCS.machine1'

  const confData: Record<string, number> = {
    [eswPrefixStr]: 2,
    [tcsPrefixStr]: 2
  }

  const provisionConfig = new ProvisionConfig(
    Object.entries(confData).map(([pStr, num]) => {
      return new AgentProvisionConfig(Prefix.fromString(pStr), num)
    })
  )

  it('should be able to successfully provision | ESW-444', async () => {
    when(configService.getActive(PROVISION_CONF_PATH)).thenResolve(
      ConfigData.fromString(JSON.stringify(confData))
    )

    when(smService.provision(deepEqual(provisionConfig))).thenResolve(
      provisionRes
    )

    const { getByText, getByRole, findByRole } = renderWithAuth({
      ui: <ProvisionButton />,
      loggedIn: true,
      mockClients: mockServices.serviceFactoryContext
    })

    //User clicks provision button
    const provisionButton = await findByRole('button', { name: 'Provision' })

    userEvent.click(provisionButton)

    //Provision config modal will appear with provision button
    await assertDialog((container, name) => getByRole(container, { name }))

    verify(configService.getActive(PROVISION_CONF_PATH)).called()

    const document = screen.getByRole('document')
    const confirmButton = within(document).getByRole('button', {
      name: /provision/i
    })

    userEvent.click(confirmButton)

    await waitFor(() => {
      expect(getByText('Successfully provisioned')).to.exist
    })

    verify(smService.provision(deepEqual(provisionConfig))).called()
  })
})

const assertDialog = async (
  getByRole: (con: ByRoleMatcher, name: string | RegExp) => HTMLElement
) => {
  await waitFor(() => expect(getByRole('dialog', /provision config/i)).to.exist)

  const dialog = getByRole('dialog', /provision config/i)

  const elementsInsideDialog = [
    ['table'],
    ['button', /provision/i],
    ['button', /cancel/i]
  ]

  await Promise.all(
    elementsInsideDialog.map(([container, name]) => {
      return waitFor(
        () => expect(within(dialog).getByRole(container, { name })).to.exist
      )
    })
  )
}
