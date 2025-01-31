import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import type { SequencerService, Step } from '@tmtsoftware/esw-ts'
import { Modal } from 'antd'
import React from 'react'
import { useMutation } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { useStepListContext } from '../../hooks/useStepListContext'
import { deleteStepConstants } from '../../sequencerConstants'
import { handleStepActionResponse } from '../../utils'
import { ItemType } from 'antd/es/menu/interface'

const deleteStep = (id: string) => (sequencerService: SequencerService) => {
  return sequencerService.delete(id).then(handleStepActionResponse)
}

const showConfirmModal = (stepName: string, onYes: () => void): void => {
  Modal.confirm({
    title: deleteStepConstants.getModalTitle(stepName),
    icon: <ExclamationCircleOutlined />,
    centered: true,
    okText: deleteStepConstants.modalOkText,
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

export function deleteActionItem(step: Step, isDisabled: boolean): ItemType {
  const { sequencerService } = useStepListContext()
  const deleteAction = useMutation({
    mutationFn: deleteStep(step.id),
    onSuccess: () => successMessage(deleteStepConstants.successMessage),
    onError: (e) => errorMessage(deleteStepConstants.failureMessage, e)
  })

  return {
    key: 'Delete',
    disabled: isDisabled,
    danger: !isDisabled,
    icon: <DeleteOutlined />,
    onClick: () =>
      showConfirmModal(step.command.commandName, () => {
        sequencerService && deleteAction.mutateAsync(sequencerService)
      }),
    label: deleteStepConstants.menuItemText
  }
}
