import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Prefix, Sequence } from '@tmtsoftware/esw-ts'
import type { OkOrUnhandledResponse, SequencerState } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { anything, deepEqual, reset, verify, when } from 'ts-mockito'
import { LoadSequence } from '../../../../../src/features/sequencer/components/actions/LoadSequence'
import { ReloadSequence } from '../../../../../src/features/sequencer/components/steplist/ReloadSequence'
import { loadSequenceConstants } from '../../../../../src/features/sequencer/sequencerConstants'
import { getStepList } from '../../../../utils/sequence-utils'
import { renderWithAuth, renderWithStepListContext, sequencerServiceMock } from '../../../../utils/test-utils'

describe('ReloadSequence', () => {
  afterEach(async () => {
    reset(sequencerServiceMock)
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
    it(`should be ${state} if sequencer response is ${res._type}| ESW-583`, async () => {
      const stepList = getStepList('Pending')
      when(sequencerServiceMock.loadSequence(anything())).thenResolve(res)
      renderWithStepListContext(<ReloadSequence sequencerState={'Loaded'} stepList={stepList} />)

      const button = await screen.findByRole('ReloadSequence')
      expect(button).to.exist
      await waitFor(() => userEvent.click(button))

      await screen.findByText(msg)
      const sequence = new Sequence([stepList.steps[0].command])
      await waitFor(() => verify(sequencerServiceMock.loadSequence(deepEqual(sequence))).called())
    })
  })
})
