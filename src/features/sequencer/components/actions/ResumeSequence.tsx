import { PlayCircleOutlined } from '@ant-design/icons'
import type { OkOrUnhandledResponse, SequencerService } from '@tmtsoftware/esw-ts'
import { Button, Tooltip } from 'antd'
import React from 'react'
import { useMutation, UseMutationResult } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { useSequencerService } from '../../hooks/useSequencerService'
import type { SequencerProps } from '../Props'
import styles from '../sequencerDetails/sequencerDetails.module.css'

const useResumeSequence = (): UseMutationResult<OkOrUnhandledResponse, unknown, SequencerService> => {
  const mutationFn = (sequencerService: SequencerService) => sequencerService.resume()

  return useMutation({
    mutationFn,
    onSuccess: (res) => {
      if (res._type === 'Ok') return successMessage('Sequence is resumed successfully')
      return errorMessage('Failed to resume the sequence', Error(res.msg))
    },
    onError: (e) => errorMessage('Failed to resume the sequence', e)
  })
}

type ResumeSequenceProps = Omit<SequencerProps, 'sequencerState'>

export const ResumeSequence = ({
  prefix,
  isSequencerRunning,
  isCurrentStepRunningAndNextPaused
}: ResumeSequenceProps & { isCurrentStepRunningAndNextPaused: boolean }): JSX.Element => {
  const sequencerService = useSequencerService(prefix)
  const resumeSequence = useResumeSequence()

  const disabled = !isSequencerRunning || isCurrentStepRunningAndNextPaused
  return (
    <Tooltip title={'Resume sequence'}>
      <Button
        onClick={() => sequencerService && resumeSequence.mutate(sequencerService)}
        type={'text'}
        shape={'circle'}
        icon={<PlayCircleOutlined className={disabled ? styles.actionDisabled : styles.actionEnabled} />}
        disabled={disabled}
        role='ResumeSequence'
      />
    </Tooltip>
  )
}
