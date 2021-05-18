import { PlayCircleOutlined } from '@ant-design/icons'
import type {
  Prefix,
  SequencerService,
  SubmitResponse
} from '@tmtsoftware/esw-ts'
import { Button, Tooltip } from 'antd'
import React from 'react'
import { useMutation, UseMutationResult } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { GET_SEQUENCE, SEQUENCER_STATE } from '../../../queryKeys'
import { useSequencerService } from '../../hooks/useSequencerService'
import type { SequencerProps } from '../Props'
import styles from '../sequencerDetails/sequencerDetails.module.css'

const useStartSequence = (
  prefix: Prefix
): UseMutationResult<SubmitResponse, unknown, SequencerService> => {
  const mutationFn = (sequencerService: SequencerService) =>
    sequencerService.startSequence()

  const showError = (str: string) =>
    errorMessage('Failed to start the sequence', Error(str))

  return useMutation({
    mutationFn,
    onSuccess: (res) => {
      switch (res._type) {
        case 'Completed':
          return successMessage('Sequence is completed successfully')
        case 'Started':
          return successMessage('Sequence is started successfully')
        case 'Error':
          return showError(res.message)
        case 'Invalid':
          return showError(res.issue.reason)
        default:
          return showError(res._type)
      }
    },
    onError: (e) =>
      errorMessage(
        'Failed to start the sequence',
        (e as Error).message ? e : Error((e as string).toString())
      ),
    invalidateKeysOnSuccess: [
      [SEQUENCER_STATE.key, prefix.toJSON()],
      [GET_SEQUENCE.key, prefix.toJSON()]
    ]
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
    <Tooltip placement='bottom' title={'Start sequence'}>
      <Button
        onClick={() =>
          sequencerService && startSequence.mutate(sequencerService)
        }
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
    </Tooltip>
  )
}
