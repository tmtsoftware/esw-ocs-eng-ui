import { StopOutlined } from '@ant-design/icons'
import type { OkOrUnhandledResponse, SequencerService } from '@tmtsoftware/esw-ts'
import { Button, Tooltip } from 'antd'
import React from 'react'
import { showConfirmModal } from '../../../../components/modal/showConfirmModal'
import { useMutation, UseMutationResult } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { useSequencerService } from '../../hooks/useSequencerService'
import type { SequencerProps } from '../Props'
import styles from '../sequencerDetails/sequencerDetails.module.css'

const useStopAction = (): UseMutationResult<OkOrUnhandledResponse, unknown, SequencerService> => {
  const mutationFn = (sequencerService: SequencerService) => sequencerService.stop()

  return useMutation({
    mutationFn,
    onSuccess: (res) => {
      if (res._type === 'Ok') return successMessage('Successfully stopped the Sequence')
      return errorMessage('Failed to stop the Sequence', Error(res.msg))
    },
    onError: (e) => errorMessage('Failed to stop the Sequence', e)
  })
}

type StopSequenceProps = Omit<SequencerProps, 'sequencerState'>

export const StopSequence = ({ prefix, isSequencerRunning }: StopSequenceProps): JSX.Element => {
  const sequencerService = useSequencerService(prefix)
  const stopAction = useStopAction()
  const disabled = !isSequencerRunning

  const onClick = () =>
    sequencerService &&
    showConfirmModal(
      () => {
        stopAction.mutate(sequencerService)
      },
      'Do you want to stop the sequence?',
      'Stop'
    )

  return (
    <Tooltip placement='bottom' title={'Stop sequencer'}>
      <Button
        onClick={onClick}
        type={'text'}
        shape={'circle'}
        icon={
          <StopOutlined className={disabled ? styles.actionDisabled : styles.actionEnabled + ' ' + styles.danger} />
        }
        disabled={disabled}
        role='StopSequence'
      />
    </Tooltip>
  )
}
