import { PauseCircleOutlined } from '@ant-design/icons'
import type { PauseResponse, SequencerService } from '@tmtsoftware/esw-ts'
import { Button, Tooltip } from 'antd'
import React from 'react'
import { useMutation, UseMutationResult } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { useStepListContext } from '../../hooks/useStepListContext'
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

export const PauseSequence = (): JSX.Element => {
  const { sequencerService } = useStepListContext()
  const pauseSequence = usePauseSequence()

  const onClick = () => sequencerService && pauseSequence.mutate(sequencerService)

  return (
    <Tooltip title={'Pause sequence'}>
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
