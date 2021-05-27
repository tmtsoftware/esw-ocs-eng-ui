import { PauseCircleOutlined } from '@ant-design/icons'
import type { PauseResponse, SequencerService } from '@tmtsoftware/esw-ts'
import { Button, Tooltip } from 'antd'
import React from 'react'
import { useMutation, UseMutationResult } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { useSequencerService } from '../../hooks/useSequencerService'
import type { SequencerProps } from '../Props'
import styles from '../sequencerDetails/sequencerDetails.module.css'

const usePauseSequence = (): UseMutationResult<PauseResponse, unknown, SequencerService> => {
  const mutationFn = (sequencerService: SequencerService) => sequencerService.pause()

  return useMutation({
    mutationFn,
    onSuccess: (res) => {
      if (res._type === 'Ok') return successMessage('Sequence is paused successfully')
      return errorMessage(
        'Failed to pause the sequence',
        Error(res._type === 'CannotOperateOnAnInFlightOrFinishedStep' ? res._type : res.msg)
      )
    },
    onError: (e) => errorMessage('Failed to pause the sequence', e)
  })
}

type PauseSequenceProps = Omit<SequencerProps, 'sequencerState'>

export const PauseSequence = ({ prefix }: PauseSequenceProps): JSX.Element => {
  const sequencerService = useSequencerService(prefix)
  const pauseSequence = usePauseSequence()

  const onClick = () => sequencerService && pauseSequence.mutate(sequencerService)

  return (
    <Tooltip placement='bottom' title={'Pause sequence'}>
      <Button
        onClick={onClick}
        type={'text'}
        shape={'circle'}
        icon={<PauseCircleOutlined className={styles.actionEnabled} />}
        role='PauseSequence'
      />
    </Tooltip>
  )
}
