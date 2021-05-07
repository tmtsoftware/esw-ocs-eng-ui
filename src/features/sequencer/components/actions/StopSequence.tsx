import { StopOutlined } from '@ant-design/icons'
import type {
  OkOrUnhandledResponse,
  Prefix,
  SequencerService
} from '@tmtsoftware/esw-ts'
import { Button, Tooltip } from 'antd'
import React from 'react'
import { showConfirmModal } from '../../../../components/modal/showConfirmModal'
import { useMutation, UseMutationResult } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { GET_SEQUENCE, SEQUENCER_STATE } from '../../../queryKeys'
import { useSequencerService } from '../../hooks/useSequencerService'
import type { SequencerProps } from '../Props'
import styles from '../sequencerDetails/sequencerDetails.module.css'

const useStopAction = (
  prefix: Prefix
): UseMutationResult<OkOrUnhandledResponse, unknown, SequencerService> => {
  const mutationFn = (sequencerService: SequencerService) =>
    sequencerService.stop()

  return useMutation({
    mutationFn,
    onSuccess: (res) => {
      if (res._type === 'Ok')
        return successMessage('Successfully stop the Sequence')
      return errorMessage('Failed to stop the Sequence', Error(res.msg))
    },
    onError: (e) => errorMessage('Failed to stop the Sequence', e),
    invalidateKeysOnSuccess: [
      [SEQUENCER_STATE.key, prefix.toJSON()],
      [GET_SEQUENCE.key, prefix.toJSON()]
    ],
    useErrorBoundary: false
  })
}

export const StopSequence = ({
  prefix,
  sequencerState
}: SequencerProps): JSX.Element => {
  const sequencerService = useSequencerService(prefix)
  const stopAction = useStopAction(prefix)
  const disabled = !sequencerState || sequencerState !== 'Running'

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
        danger
        icon={
          <StopOutlined
            className={disabled ? styles.actionDisabled : styles.actionEnabled}
          />
        }
        disabled={disabled}
        role='StopSequence'
      />
    </Tooltip>
  )
}
