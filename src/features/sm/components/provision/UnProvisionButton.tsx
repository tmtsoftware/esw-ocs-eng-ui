import { ExclamationCircleOutlined } from '@ant-design/icons'
import type { SequenceManagerService } from '@tmtsoftware/esw-ts'
import { Button, Modal } from 'antd'
import React from 'react'
import { Spinner } from '../../../../components/spinners/Spinner'
import { useProvisionAction } from '../../hooks/useProvisionAction'
import { useSMService } from '../hooks/useSMService'

function showConfirmModal<T>(onYes: () => Promise<T>): void {
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

export const UnProvisionButton = (): JSX.Element => {
  const smService = useSMService()

  const unProvisionAction = useProvisionAction(
    shutdownAllSequenceComps,
    'Successfully shutdown all the Sequence Components',
    'Failed to shutdown all Sequence Components'
  )

  if (smService.isLoading) return <Spinner />

  return (
    <Button
      danger
      loading={unProvisionAction.isLoading}
      onClick={() =>
        smService.data &&
        showConfirmModal(() => unProvisionAction.mutateAsync(smService.data))
      }>
      Unprovision
    </Button>
  )
}
