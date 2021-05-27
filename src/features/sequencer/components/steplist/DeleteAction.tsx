import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Menu, Modal } from 'antd'
import React from 'react'
import { useMutation } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { useStepListContext } from '../../hooks/useStepListContext'
import { cannotOperateOnAnInFlightOrFinishedStepMsg, idDoesNotExistMsg } from '../sequencerMessageConstants'
import type { GenericResponse, SequencerService, Step } from '@tmtsoftware/esw-ts'

const handleDeleteResponse = (res: GenericResponse) => {
  switch (res._type) {
    case 'Ok':
      return res

    case 'Unhandled':
      throw new Error(res.msg)

    case 'CannotOperateOnAnInFlightOrFinishedStep':
      throw new Error(cannotOperateOnAnInFlightOrFinishedStepMsg)

    case 'IdDoesNotExist':
      throw new Error(idDoesNotExistMsg(res.id))
  }
}

const deleteStep = (id: string) => (sequencerService: SequencerService) => {
  return sequencerService.delete(id).then(handleDeleteResponse)
}

const showConfirmModal = (stepName: string, onYes: () => void): void => {
  Modal.confirm({
    title: `Do you want to delete a step '${stepName}'?`,
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

type DeleteActionProps = {
  step: Step
  isDisabled: boolean
}

export const DeleteAction = ({ step, isDisabled }: DeleteActionProps): JSX.Element => {
  const { sequencerService } = useStepListContext()
  const deleteAction = useMutation({
    mutationFn: deleteStep(step.id),
    onSuccess: () => successMessage('Successfully deleted step'),
    onError: (e) => errorMessage('Failed to delete step', e)
  })

  return (
    <Menu.Item
      key='Delete'
      disabled={isDisabled}
      danger={!isDisabled}
      icon={<DeleteOutlined />}
      onClick={() =>
        showConfirmModal(step.command.commandName, () => {
          sequencerService && deleteAction.mutateAsync(sequencerService)
        })
      }>
      Delete
    </Menu.Item>
  )
}
