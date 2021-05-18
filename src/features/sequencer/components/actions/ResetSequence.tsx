import { ScissorOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
import React from 'react'
import { showConfirmModal } from '../../../../components/modal/showConfirmModal'
import { useMutation, UseMutationResult } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { GET_SEQUENCE, SEQUENCER_STATE } from '../../../queryKeys'
import { useSequencerService } from '../../hooks/useSequencerService'
import type { SequencerProps } from '../Props'
import styles from '../sequencerDetails/sequencerDetails.module.css'
import type {
  OkOrUnhandledResponse,
  Prefix,
  SequencerService
} from '@tmtsoftware/esw-ts'

const useResetAction = (
  prefix: Prefix
): UseMutationResult<OkOrUnhandledResponse, unknown, SequencerService> => {
  const mutationFn = (sequencerService: SequencerService) =>
    sequencerService.reset()

  return useMutation({
    mutationFn,
    onSuccess: (res) => {
      if (res._type === 'Ok')
        return successMessage('Successfully reset the Sequence')
      return errorMessage('Failed to reset the Sequence', Error(res.msg))
    },
    onError: (e) => errorMessage('Failed to reset the Sequence', e),
    invalidateKeysOnSuccess: [
      [SEQUENCER_STATE.key, prefix.toJSON()],
      [GET_SEQUENCE.key, prefix.toJSON()]
    ],
    useErrorBoundary: false
  })
}

export const ResetSequence = ({
  prefix,
  sequencerState
}: SequencerProps): JSX.Element => {
  const sequencerService = useSequencerService(prefix)
  const resetAction = useResetAction(prefix)
  const disabled = !sequencerState || sequencerState !== 'Running'

  const onClick = () =>
    sequencerService &&
    showConfirmModal(
      () => {
        resetAction.mutate(sequencerService)
      },
      'Do you want to reset the sequence?',
      'Reset'
    )

  return (
    <Tooltip placement='bottom' title='Reset sequence'>
      <Button
        onClick={onClick}
        type={'text'}
        shape={'circle'}
        icon={
          <ScissorOutlined
            className={
              disabled
                ? styles.actionDisabled
                : styles.actionEnabled + ' ' + styles.danger
            }
          />
        }
        disabled={disabled}
        role='ResetSequence'
      />
    </Tooltip>
  )
}
