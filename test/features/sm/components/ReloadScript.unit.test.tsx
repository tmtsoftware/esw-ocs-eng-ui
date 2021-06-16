import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentId, ObsMode, Prefix } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { deepEqual, verify, when } from 'ts-mockito'
import { ReloadScript } from '../../../../src/features/sm/components/ReloadScript'
import { reloadScriptConstants } from '../../../../src/features/sm/smConstants'
import { MenuWithStepListContext, mockServices, renderWithAuth } from '../../../utils/test-utils'

describe('Reload script', () => {
  const smService = mockServices.mock.smService
  const obsMode = new ObsMode('Darknight')
  const subsystem = 'ESW'
  const componentId = new ComponentId(new Prefix(subsystem, obsMode.toJSON()), 'Sequencer')

  it(`should return Success when Reload Script is clicked | ESW-502`, async () => {
    when(smService.restartSequencer(subsystem, deepEqual(obsMode))).thenResolve({
      _type: 'Success',
      componentId: componentId
    })

    renderWithAuth({
      ui: <MenuWithStepListContext menuItem={<ReloadScript subsystem={subsystem} obsMode={obsMode.toJSON()} />} />
    })

    const reloadScriptItem = screen.getByRole('ReloadScript')
    await waitFor(() => userEvent.click(reloadScriptItem))

    // expect modal to be visible
    const modalTitle = await screen.findByText(reloadScriptConstants.getModalTitle(subsystem, obsMode.name))
    expect(modalTitle).to.exist

    const document = screen.getByRole('document')
    const reloadConfirm = within(document).getByRole('button', {
      name: reloadScriptConstants.modalOkText
    })
    await waitFor(() => userEvent.click(reloadConfirm))

    await screen.findByText(reloadScriptConstants.getSuccessMessage(`${subsystem}.${obsMode.toJSON()}`))
    await waitFor(
      () => expect(screen.queryByText(reloadScriptConstants.getModalTitle(subsystem, obsMode.name))).to.null
    )
    verify(smService.restartSequencer(subsystem, deepEqual(obsMode))).called()
  })
})
