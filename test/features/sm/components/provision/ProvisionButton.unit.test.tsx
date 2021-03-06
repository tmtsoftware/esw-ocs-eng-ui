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
import { anything, deepEqual, verify, when } from 'ts-mockito'
import type { ServiceFactoryContextType } from '../../../../../src/contexts/ServiceFactoryContext'
import { ProvisionButton } from '../../../../../src/features/sm/components/provision/ProvisionButton'
import { PROVISION_CONF_PATH } from '../../../../../src/features/sm/constants'
import { getMockServices, renderWithAuth } from '../../../../utils/test-utils'

describe('ProvisionButton component', () => {
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
    const mockServices = getMockServices()
    const smService = mockServices.mock.smService
    const configService = mockServices.mock.configService

    when(configService.getActive(PROVISION_CONF_PATH)).thenResolve(
      ConfigData.fromString(JSON.stringify(confData))
    )

    when(smService.provision(deepEqual(provisionConfig))).thenResolve(
      provisionRes
    )

    const {
      provisionButton,
      getByText,
      getByRole
    } = await renderAndFindProvision(mockServices.serviceFactoryContext)

    //User clicks provision button
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

  it('should log if fetching provision config call failed | ESW-444', async () => {
    const mockServices = getMockServices()
    const smService = mockServices.mock.smService
    const configService = mockServices.mock.configService

    when(configService.getActive(PROVISION_CONF_PATH)).thenReject(
      Error('error occurred')
    )

    const {
      provisionButton,
      getByText,
      queryByRole
    } = await renderAndFindProvision(mockServices.serviceFactoryContext)

    //User clicks provision button
    userEvent.click(provisionButton)

    //Provision config modal will not appear
    await waitFor(
      () =>
        expect(
          queryByRole('dialog', {
            name: /provision config/i
          })
        ).to.null
    )

    verify(configService.getActive(PROVISION_CONF_PATH)).called()

    await waitFor(() => {
      expect(getByText(/error occurred/i)).to.exist
    })

    verify(smService.provision(anything())).never()
  })

  const provisionConfTestData: [string, RegExp, string][] = [
    [
      'esw.esw-machine',
      /component name esw-machine has '-'/i,
      'prefix(esw.esw-machine)'
    ],
    [
      'esw.esw_machine ',
      /component name esw_machine has leading\/trailing whitespace/i,
      'prefix(esw.esw_machine )'
    ],
    ['rms.esw_machine', /Subsystem: rms is invalid/i, 'subsystem(rms)']
  ]

  provisionConfTestData.forEach(([agentPrefix, errMsg, statement]) => {
    it(`should log error if provision config agent field is not a valid ${statement} | ESW-444`, async () => {
      const mockServices = getMockServices()
      const smService = mockServices.mock.smService
      const configService = mockServices.mock.configService

      when(configService.getActive(PROVISION_CONF_PATH)).thenResolve(
        ConfigData.fromString(
          JSON.stringify({
            [agentPrefix]: 2
          })
        )
      )

      const {
        provisionButton,
        getByText,
        queryByRole
      } = await renderAndFindProvision(mockServices.serviceFactoryContext)

      //User clicks provision button
      userEvent.click(provisionButton)

      //Provision config modal will not appear
      await waitFor(
        () =>
          expect(
            queryByRole('dialog', {
              name: /provision config/i
            })
          ).to.null
      )

      verify(configService.getActive(PROVISION_CONF_PATH)).called()

      await waitFor(() => {
        expect(getByText(errMsg)).to.exist
      })

      verify(smService.provision(anything())).never()
    })
  })

  const unhandled: ProvisionResponse = {
    _type: 'Unhandled',
    state: 'Processing',
    messageType: 'Provision',
    msg: 'Provision message type is not supported in Processing state'
  }

  const locServiceError: ProvisionResponse = {
    _type: 'LocationServiceError',
    reason: 'Esw.sequence_manger is not found'
  }

  const spawnSeqCompError: ProvisionResponse = {
    _type: 'SpawningSequenceComponentsFailed',
    failureResponses: ['failed to spawn']
  }

  const couldNotFindMachine: ProvisionResponse = {
    _type: 'CouldNotFindMachines',
    prefix: [Prefix.fromString('esw.esw_machine')]
  }

  const provisionErrorTestData: [
    string,
    Promise<ProvisionResponse>,
    RegExp
  ][] = [
    [
      'Unhandled',
      Promise.resolve(unhandled),
      /provision message type is not supported in processing state/i
    ],
    [
      'LocationServiceError',
      Promise.resolve(locServiceError),
      /esw\.sequence_manger is not found/i
    ],
    [
      'SpawningSequenceComponentsFailed',
      Promise.resolve(spawnSeqCompError),
      /failed to spawn/i
    ],
    [
      'CouldNotFindMachines',
      Promise.resolve(couldNotFindMachine),
      /could not found following machine: esw.esw_machine/i
    ],
    ['Exception', Promise.reject(Error('error occured')), /error occured/i]
  ]

  provisionErrorTestData.forEach(([name, provisionRes, errMsg]) => {
    it(`should be able to show error log if provision return ${name} | ESW-444`, async () => {
      const mockServices = getMockServices()

      const smService = mockServices.mock.smService
      const configService = mockServices.mock.configService

      when(configService.getActive(PROVISION_CONF_PATH)).thenResolve(
        ConfigData.fromString(JSON.stringify(confData))
      )

      when(smService.provision(deepEqual(provisionConfig))).thenReturn(
        provisionRes
      )

      const {
        provisionButton,
        getByText,
        getByRole
      } = await renderAndFindProvision(mockServices.serviceFactoryContext)

      //User clicks provision button
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
        expect(getByText(errMsg)).to.exist
      })

      verify(smService.provision(deepEqual(provisionConfig))).called()
    })
  })

  const renderAndFindProvision = async (
    serviceFactoryContext: ServiceFactoryContextType
  ) => {
    const { getByText, queryByRole, findByRole, getByRole } = renderWithAuth({
      ui: <ProvisionButton />,
      loggedIn: true,
      mockClients: serviceFactoryContext
    })

    const provisionButton = await findByRole('button', { name: 'Provision' })

    return { provisionButton, getByText, queryByRole, findByRole, getByRole }
  }

  const assertDialog = async (
    getByRole: (con: ByRoleMatcher, name: string | RegExp) => HTMLElement
  ) => {
    await waitFor(
      () => expect(getByRole('dialog', /provision config/i)).to.exist
    )

    const dialog = getByRole('dialog', /provision config/i)

    const items = await waitFor(() => [
      within(dialog).getByRole('table'),
      within(dialog).getByRole('button', { name: /provision/i }),
      within(dialog).getByRole('button', { name: /cancel/i })
    ])

    items.forEach((item) => {
      expect(item).to.exist
    })
  }
})
