import { ExclamationCircleOutlined } from '@ant-design/icons'
import type { SequenceManagerService } from '@tmtsoftware/esw-ts'
import { Button, Modal } from 'antd'
import React from 'react'
import { Spinner } from '../../../../components/spinners/Spinner'
import { useSMService } from '../../../../contexts/SMContext'
import { useProvisionAction } from '../../hooks/useProvisionAction'

function showConfirmModal(onYes: () => void): void {
  Modal.confirm({
    title: 'Do you want to shutdown all the Sequence Components?',
    icon: <ExclamationCircleOutlined />,
    centered: true,
    okText: 'Shutdown',
    okButtonProps: {
      danger: true,
      type: 'primary'
    },
    cancelText: 'Cancel',
    onOk: () => onYes()
  })
}

const shutdownAllSequenceComps = (
  sequenceManagerService: SequenceManagerService
) =>
  sequenceManagerService.shutdownAllSequenceComponents().then((res) => {
    switch (res._type) {
      case 'LocationServiceError':
        throw Error(res.reason)
      case 'Unhandled':
        throw Error(res.msg)
      case 'Success':
        return res
    }
  })

export const UnProvisionButton = ({
  disabled = false
}: {
  disabled?: boolean
}): JSX.Element => {
  const useErrorBoundary = false
  const [smContext, isLoading] = useSMService()
  const smService = smContext?.smService

  const unProvisionAction = useProvisionAction(
    shutdownAllSequenceComps,
    'Successfully shutdown all the Sequence Components',
    'Failed to shutdown all Sequence Components',
    useErrorBoundary
  )

  if (isLoading) return <Spinner />

  return (
    <Button
      danger
      disabled={disabled}
      loading={unProvisionAction.isLoading}
      onClick={() =>
        smService &&
        showConfirmModal(() => {
          unProvisionAction.mutateAsync(smService)
        })
      }>
      Unprovision
    </Button>
  )
}
