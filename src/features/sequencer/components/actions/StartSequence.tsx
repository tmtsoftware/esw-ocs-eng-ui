import { PlayCircleOutlined } from '@ant-design/icons'
import type {
  Prefix,
  SequencerService,
  SubmitResponse
} from '@tmtsoftware/esw-ts'
import React from 'react'
import { useMutation, UseMutationResult } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { GET_SEQUENCE, SEQUENCER_STATE } from '../../../queryKeys'
import { useSequencerService } from '../../hooks/useSequencerService'
import type { SequencerProps } from '../Props'
import styles from '../sequencerDetails/sequencerDetails.module.css'
import { Button } from 'antd'

const useStartSequence = (
  prefix: Prefix
): UseMutationResult<SubmitResponse, unknown, SequencerService> => {
  const mutationFn = (sequencerService: SequencerService) =>
    sequencerService.startSequence()

  return useMutation({
    mutationFn,
    onSuccess: (res) => {
      switch (res._type) {
        case 'Completed':
          return successMessage('Sequence is completed successfully')
        case 'Started':
          return successMessage('Sequence is started successfully')
        case 'Error':
          return errorMessage('Failed to start the Sequence', res.message)
        case 'Invalid':
          return errorMessage('Failed to start the Sequence', res.issue.reason)
        default:
          return errorMessage('Failed to start the Sequence', Error(res._type))
      }
    },
    onError: (e) => errorMessage('Failed to start the Sequence', e),
    invalidateKeysOnSuccess: [
      [SEQUENCER_STATE.key, prefix.toJSON()],
      [GET_SEQUENCE.key, prefix.toJSON()]
    ],
    useErrorBoundary: false
  })
}

export const StartSequence = ({
  prefix,
  sequencerState
}: SequencerProps): JSX.Element => {
  const sequencerService = useSequencerService(prefix)
  const startSequence = useStartSequence(prefix)

  const disabled = !sequencerState || sequencerState !== 'Loaded'
  return (
    <Button
      onClick={() => sequencerService && startSequence.mutate(sequencerService)}
      type={'text'}
      shape={'circle'}
      icon={
        <PlayCircleOutlined
          className={disabled ? styles.actionDisabled : styles.actionEnabled}
        />
      }
      disabled={disabled}
      role='StartSequence'
    />
  )
}
