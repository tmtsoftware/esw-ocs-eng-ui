import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentId, ObsMode, Prefix, Variation } from '@tmtsoftware/esw-ts'
import { anything, deepEqual, reset, verify, when } from '@johanblumenberg/ts-mockito'
import { expect } from 'chai'
import React from 'react'
import { StartSequencer } from '../../../../src/features/sm/components/StartSequencer'
import { startSequencerConstants } from '../../../../src/features/sm/smConstants'
import { obsModesData } from '../../../jsons/obsmodes'
import { mockServices, renderWithAuth } from '../../../utils/test-utils'
import '@ant-design/v5-patch-for-react-19'

describe('Start Sequencer', () => {
  const ESW = 'ESW'
  const smService = mockServices.mock.smService
  const subsystem = ESW
  const obsMode = new ObsMode('DarkNight_1')
  const sequencerPrefix = new Prefix(ESW, obsMode.name)
  const componentId = new ComponentId(sequencerPrefix, 'Sequencer')

  beforeEach(() => {
    reset(smService)
  })

  it('should start the sequencer for given subsystem and obsmode only i.e without variation | ESW-447, ESW-507, ESW-565', async () => {
    const user = userEvent.setup()
    when(smService.getObsModesDetails()).thenResolve(obsModesData)
    when(smService.startSequencer(deepEqual(subsystem), deepEqual(obsMode), anything())).thenResolve({
      _type: 'Started',
      componentId
    })

    renderWithAuth({ ui: <StartSequencer /> })

    const startSequencerButton = screen.getByRole('button', {
      name: startSequencerConstants.buttonText
    })
    await user.click(startSequencerButton)

    const modal = await screen.findByRole('dialog', {
      name: startSequencerConstants.modalTitle
    })
    await enterUserInputInSelect(modal, startSequencerConstants.subsystemInputLabel, 'es', ESW)

    await enterUserInputInAutoComplete(modal, startSequencerConstants.obsModeInputLabel, 'dark', obsMode.name)

    const confirmButton = screen.getByRole('button', { name: startSequencerConstants.modalOkText })
    await user.click(confirmButton)

    await screen.findByText(startSequencerConstants.successMessage)
    verify(smService.startSequencer(deepEqual(subsystem), deepEqual(obsMode), anything())).called()
    await waitFor(() => expect(screen.queryByText(startSequencerConstants.modalTitle)).to.null)
  })

  it('should start the sequencer for given subsystem and obsmode along with a variation| ESW-565', async () => {
    const user = userEvent.setup()
    const variation = new Variation('IRIS_IFS')
    when(smService.getObsModesDetails()).thenResolve(obsModesData)
    when(smService.startSequencer(deepEqual(subsystem), deepEqual(obsMode), deepEqual(variation))).thenResolve({
      _type: 'Started',
      componentId
    })

    renderWithAuth({ ui: <StartSequencer /> })

    const startSequencerButton = screen.getByRole('button', {
      name: startSequencerConstants.buttonText
    })
    await user.click(startSequencerButton)

    const modal = await screen.findByRole('dialog', {
      name: startSequencerConstants.modalTitle
    })
    await enterUserInputInSelect(modal, startSequencerConstants.subsystemInputLabel, 'es', ESW)

    await enterUserInputInAutoComplete(modal, startSequencerConstants.obsModeInputLabel, 'dark', obsMode.name)

    await enterUserInputInInputBox(modal, startSequencerConstants.variationInputLabel, variation.name)

    const confirmButton = screen.getByRole('button', { name: startSequencerConstants.modalOkText })

    await user.click(confirmButton)

    await screen.findAllByText(startSequencerConstants.successMessage)
    verify(smService.startSequencer(deepEqual(subsystem), deepEqual(obsMode), deepEqual(variation))).called()
    await waitFor(() => expect(screen.queryByText(startSequencerConstants.modalTitle)).to.null)
  })

  it('should open modal and render a form containing subsystem and obsmode input| ESW-447', async () => {
    const user = userEvent.setup()
    when(smService.getObsModesDetails()).thenResolve(obsModesData)

    renderWithAuth({
      ui: <StartSequencer />
    })

    const startSequencerButton = screen.getByRole('button', { name: startSequencerConstants.buttonText })
    await user.click(startSequencerButton)

    const modal = await screen.findByRole('dialog', {
      name: startSequencerConstants.modalTitle
    })

    within(modal).getByRole('combobox', { name: startSequencerConstants.subsystemInputLabel })
    within(modal).getByRole('combobox', { name: startSequencerConstants.obsModeInputLabel })
    within(modal).getByText(startSequencerConstants.subsystemInputPlaceholder)
    within(modal).getByText(startSequencerConstants.obsModeInputPlaceholder)
    within(modal).getByRole('textbox', { name: startSequencerConstants.variationInputLabel })
    within(modal).getByRole('button', { name: startSequencerConstants.modalOkText })
  })
})

const enterUserInputInSelect = async (
  withinElement: HTMLElement,
  label: string,
  userInput: string,
  optionToChoose: string
) => {
  const combobox = within(withinElement).getByRole('combobox', { name: label })
  const user = userEvent.setup()
  await user.click(combobox)
  await user.type(combobox, userInput)
  const option = await screen.findByText(optionToChoose)

  await waitFor(() => user.click(option))
}

const enterUserInputInAutoComplete = async (
  withinElement: HTMLElement,
  label: string,
  userInput: string,
  optionToChoose: string
) => {
  const combobox = within(withinElement).getByRole('combobox', { name: label })
  const user = userEvent.setup()
  await user.click(combobox)
  await user.type(combobox, userInput)

  const obsModeItem = await screen.findAllByText(optionToChoose)
  await waitFor(() => user.click(obsModeItem[1]))
}

const enterUserInputInInputBox = async (withinElement: HTMLElement, label: string, userInput: string) => {
  const combobox = within(withinElement).getByRole('textbox', { name: label })
  const user = userEvent.setup()
  await user.click(combobox)
  await user.type(combobox, userInput)
}
