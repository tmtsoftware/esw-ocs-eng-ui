import { PauseCircleOutlined } from '@ant-design/icons'
import type {
  PauseResponse,
  Prefix,
  SequencerService
} from '@tmtsoftware/esw-ts'
import { Tooltip } from 'antd'
import React from 'react'
import { useMutation, UseMutationResult } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { GET_SEQUENCE } from '../../../queryKeys'
import { useSequencerService } from '../../hooks/useSequencerService'
import type { SequencerProps } from '../Props'
import styles from '../sequencerDetails/sequencerDetails.module.css'

const usePauseSequence = (
  prefix: Prefix
): UseMutationResult<PauseResponse, unknown, SequencerService> => {
  const mutationFn = (sequencerService: SequencerService) =>
    sequencerService.pause()

  return useMutation({
    mutationFn,
    onSuccess: (res) => {
      if (res._type === 'Ok')
        return successMessage('Sequence is paused successfully')
      return errorMessage(
        'Failed to pause sequence',
        Error(
          res._type === 'CannotOperateOnAnInFlightOrFinishedStep'
            ? res._type
            : res.msg
        )
      )
    },
    onError: (e) => errorMessage('Failed to pause sequence', e),
    invalidateKeysOnSuccess: [[GET_SEQUENCE.key, prefix.toJSON()]],
    useErrorBoundary: false
  })
}

export const PauseSequence = ({
  prefix,
  sequencerState
}: SequencerProps): JSX.Element => {
  const sequencerService = useSequencerService(prefix)
  const pauseSequence = usePauseSequence(prefix)

  const onClick = () =>
    sequencerService && pauseSequence.mutate(sequencerService)

  return (
    <Tooltip placement='bottom' title='Pause sequence'>
      <PauseCircleOutlined
        disabled={!sequencerState || sequencerState !== 'Running'}
        className={styles.actionEnabled}
        onClick={onClick}
        role='PauseSequence'
      />
    </Tooltip>
  )
}
