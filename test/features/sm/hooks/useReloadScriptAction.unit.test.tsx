import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentId, ObsMode, Prefix } from '@tmtsoftware/esw-ts'
import type { RestartSequencerResponse, Subsystem, Variation } from '@tmtsoftware/esw-ts'
import { anything, deepEqual, resetCalls, verify, when } from '@johanblumenberg/ts-mockito'
import React from 'react'
import { useSMService } from '../../../../src/contexts/SMContext'
import { useReloadScriptAction } from '../../../../src/features/sm/hooks/useReloadScriptAction'
import { reloadScriptConstants } from '../../../../src/features/sm/smConstants'
import { mockServices, renderWithAuth } from '../../../utils/test-utils'
import '@ant-design/v5-patch-for-react-19'

const Component = ({
  subsystem,
  obsmode,
  variation
}: {
  subsystem: Subsystem
  obsmode: ObsMode
  variation?: Variation
}) => {
  const [smContext] = useSMService()
  const reloadSequencerAction = useReloadScriptAction(subsystem, obsmode, variation)
  return (
    <button onClick={async () => smContext && await reloadSequencerAction.mutateAsync(smContext.smService)}>
      Restart sequencer
    </button>
  )
}

describe('Reload script', () => {
  beforeEach(() => resetCalls(smService))
  const smService = mockServices.mock.smService
  const obsMode = new ObsMode('Darknight')
  const subsystem = 'ESW'
  const sequencerPrefix = new Prefix(subsystem, obsMode.toJSON())
  const componentId = new ComponentId(sequencerPrefix, 'Sequencer')
  const failureMessage = reloadScriptConstants.getFailureMessage(`${subsystem}.${obsMode.toJSON()}`)

  const responseScenarios: [string, RestartSequencerResponse, string][] = [
    [
      'Success',
      {
        _type: 'Success',
        componentId: componentId
      },
      reloadScriptConstants.getSuccessMessage(`${subsystem}.${obsMode.toJSON()}`)
    ],
    [
      'LocationServiceError',
      {
        _type: 'LocationServiceError',
        reason: 'Sequencer location not found'
      },
      `${failureMessage}, reason: Sequencer location not found`
    ],
    [
      'Unhandled',
      {
        _type: 'Unhandled',
        state: 'Processing',
        messageType: 'RestartSequencer',
        msg: "Sequence Manager can not accept 'RestartSequencer' message in 'Processing'"
      },
      `${failureMessage}, reason: Sequence Manager can not accept 'RestartSequencer' message in 'Processing'`
    ],
    [
      'FailedResponse',
      {
        _type: 'FailedResponse',
        reason: 'Sequence Manager Operation(RestartSequencer) failed due to: Ask timed out after [10000] ms'
      },
      `${failureMessage}, reason: Sequence Manager Operation(RestartSequencer) failed due to: Ask timed out after [10000] ms`
    ]
  ]

  responseScenarios.forEach(([testName, res, message]) => {
    it(`should return ${testName} when Reload Script is clicked | ESW-502`, async () => {
      const user = userEvent.setup()
      when(smService.restartSequencer(deepEqual(subsystem), deepEqual(obsMode), anything())).thenResolve(res)

      renderWithAuth({
        ui: <Component subsystem={subsystem} obsmode={obsMode} />
      })

      const button = screen.getByRole('button', { name: 'Restart sequencer' })
      await user.click(button)

      await screen.findByText(message)
      verify(smService.restartSequencer(deepEqual(subsystem), deepEqual(obsMode), anything())).once()
    })
  })
})
