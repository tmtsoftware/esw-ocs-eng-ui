import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import type {
  GenericResponse,
  Prefix,
  SequencerService,
  Step
} from '@tmtsoftware/esw-ts'
import { Modal } from 'antd'
import React from 'react'
import { useMutation } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { GET_SEQUENCE } from '../../../queryKeys'
import { useSequencerService } from '../../hooks/useSequencerService'

const handleDeleteResponse = (res: GenericResponse) => {
  switch (res._type) {
    case 'Ok':
      return res

    case 'Unhandled':
      throw new Error(res.msg)

    case 'CannotOperateOnAnInFlightOrFinishedStep':
      throw new Error('Cannot operate on in progress or finished step')

    case 'IdDoesNotExist':
      throw new Error(`${res.id} does not exist`)
  }
}

const deleteStep = (id: string) => (sequencerService: SequencerService) => {
  return sequencerService.delete(id).then(handleDeleteResponse)
}

const showConfirmModal = (onYes: () => void): void => {
  Modal.confirm({
    title: 'Do you want to delete a step?',
    icon: <ExclamationCircleOutlined />,
    centered: true,
    okText: 'Delete',
    okButtonProps: {
      danger: true,
      type: 'primary'
    },
    closable: true,
    maskClosable: true,
    cancelText: 'Cancel',
    onOk: () => onYes()
  })
}

export const DeleteAction = ({
  step,
  sequencerPrefix,
  isDisabled
}: {
  step: Step
  sequencerPrefix: Prefix
  isDisabled: boolean
}): JSX.Element => {
  const sequencerService = useSequencerService(sequencerPrefix)
  const deleteAction = useMutation({
    mutationFn: deleteStep(step.id),
    onSuccess: () => successMessage('Successfully deleted step'),
    onError: (e) => errorMessage('Failed to delete step', e),
    invalidateKeysOnSuccess: [[GET_SEQUENCE.key, sequencerPrefix.toJSON()]]
  })

  return (
    <div
      onClick={() =>
        !isDisabled &&
        showConfirmModal(() => {
          sequencerService && deleteAction.mutateAsync(sequencerService)
        })
      }>
      <DeleteOutlined />
      Delete
    </div>
  )
}
