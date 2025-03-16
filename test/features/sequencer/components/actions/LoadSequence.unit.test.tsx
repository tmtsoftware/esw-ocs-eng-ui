import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Observe, Prefix, Sequence, Setup } from '@tmtsoftware/esw-ts'
import type { OkOrUnhandledResponse, SequenceCommand, SequencerState } from '@tmtsoftware/esw-ts'
import { anything, deepEqual, reset, verify, when } from '@johanblumenberg/ts-mockito'
import { expect } from 'chai'
import React from 'react'
import { LoadSequence } from '../../../../../src/features/sequencer/components/actions/LoadSequence'
import { loadSequenceConstants } from '../../../../../src/features/sequencer/sequencerConstants'
import { renderWithAuth, sequencerServiceMock } from '../../../../utils/test-utils'
import '@ant-design/v5-patch-for-react-19'

describe('LoadSequence', () => {

  afterEach(async () => {
    reset(sequencerServiceMock)
  })

  const command1: SequenceCommand = new Setup(Prefix.fromString('CSW.ncc.trombone'), 'move', [], '2020A-001-123')
  const command2: SequenceCommand = new Observe(Prefix.fromString('CSW.ncc.trombone'), 'move', [], '2020A-001-123')
  const sequence = new Sequence([command1, command2])

  const file = new File([JSON.stringify(sequence)], 'sequence.json', {
    type: 'application/json'
  })
  const testData: [OkOrUnhandledResponse, string, string][] = [
    [{ _type: 'Ok' }, loadSequenceConstants.successMessage, 'successful'],
    [
      {
        _type: 'Unhandled',
        msg: 'LoadSequence message is not handled in Offline state',
        messageType: 'LoadSequence',
        state: 'Offline'
      },
      `${loadSequenceConstants.failureMessage}, reason: LoadSequence message is not handled in Offline state`,
      'failed'
    ]
  ]

  testData.forEach(([res, msg, state]) => {
    it(`should be ${state} if sequencer response is ${res._type}| ESW-458`, async () => {
      const user = userEvent.setup()
      when(sequencerServiceMock.loadSequence(anything())).thenResolve(res)

      renderWithAuth({
        ui: <LoadSequence prefix={Prefix.fromString('ESW.darknight')} sequencerState={'Idle'} />
      })

      const input: HTMLInputElement = screen.getByTestId('UploadSequence')

      expect(input.type).equal('file')
      expect(input.style.display).equal('none')

      await user.upload(input, file)

      await screen.findByText(msg)

      await waitFor(() => verify(sequencerServiceMock.loadSequence(deepEqual(sequence))).called())
    })
  })

  it('should show error if the sequence is not valid | ESW-458', async () => {
    const user = userEvent.setup()
    const file0 = new File([], 'sequence.json', { type: 'application/json' })

    renderWithAuth({
      ui: <LoadSequence prefix={Prefix.fromString('ESW.darknight')} sequencerState={'Idle'} />
    })

    const input: HTMLInputElement = screen.getByTestId('UploadSequence')

    await user.upload(input, file0)

    await screen.findAllByText(/failed to load the sequence, reason: /i)

    await waitFor(() => verify(sequencerServiceMock.loadSequence(anything())).never())
  })

  it('should show failed if error is returned | ESW-458', async () => {
    const user = userEvent.setup()
    when(sequencerServiceMock.loadSequence(anything())).thenReject(Error('error occurred'))

    renderWithAuth({
      ui: <LoadSequence prefix={Prefix.fromString('ESW.darknight')} sequencerState={'Idle'} />
    })

    const input: HTMLInputElement = screen.getByTestId('UploadSequence')

    await user.upload(input, file)

    await screen.findByText(`${loadSequenceConstants.failureMessage}, reason: error occurred`)

    await waitFor(() => verify(sequencerServiceMock.loadSequence(deepEqual(sequence))).called())
  })

  const disabledStates: SequencerState['_type'][] = ['Processing', 'Offline', 'Running']

  disabledStates.forEach((state) => {
    it(`should be disabled if sequencer in ${state} | ESW-458`, async () => {
      renderWithAuth({
        ui: <LoadSequence prefix={Prefix.fromString('ESW.darknight')} sequencerState={state} />
      })

      const loadButton = screen.getByRole('LoadSequence') as HTMLButtonElement

      expect(loadButton.disabled).to.be.true
    })
  })
})
