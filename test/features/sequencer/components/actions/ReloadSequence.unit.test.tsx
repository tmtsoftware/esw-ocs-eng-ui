import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { OkOrUnhandledResponse } from '@tmtsoftware/esw-ts'
import { Sequence } from '@tmtsoftware/esw-ts'
import { anything, deepEqual, reset, verify, when } from '@typestrong/ts-mockito'
import { expect } from 'chai'
import React from 'react'
import { ReloadSequence } from '../../../../../src/features/sequencer/components/steplist/ReloadSequence'
import { loadSequenceConstants } from '../../../../../src/features/sequencer/sequencerConstants'
import { getStepList } from '../../../../utils/sequence-utils'
import { renderWithStepListContext, sequencerServiceMock } from '../../../../utils/test-utils'

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
      const stepList = getStepList('Success')
      when(sequencerServiceMock.loadSequence(anything())).thenResolve(res)
      renderWithStepListContext(<ReloadSequence stepList={stepList} />)

      const button = await screen.findByRole('ReloadSequence')
      expect(button).to.exist
      await waitFor(() => userEvent.click(button))

      await screen.findByText(msg)
      const sequence = new Sequence([stepList.steps[0].command])
      await waitFor(() => verify(sequencerServiceMock.loadSequence(deepEqual(sequence))).called())
    })
  })
})
