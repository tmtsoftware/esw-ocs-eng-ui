import { ExclamationCircleOutlined } from '@ant-design/icons'
import type { ObsMode, SequenceManagerService } from '@tmtsoftware/esw-ts'
import { Button, Modal } from 'antd'
import React from 'react'
import { useSMService } from '../../../../contexts/SMContext'
import { useAction } from './ActionButton'

const showConfirmModal = (onYes: () => void): void => {
  Modal.confirm({
    title: 'Do you want to shutdown observation?',
    icon: <ExclamationCircleOutlined />,
    centered: true,
    okText: 'Shutdown',
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

const shutdown = (obsMode: ObsMode) => async (
  smService: SequenceManagerService
) => {
  const res = await smService.shutdownObsModeSequencers(obsMode)
  switch (res._type) {
    case 'Success':
      return res
    case 'LocationServiceError':
      throw new Error(res.reason)
    case 'Unhandled':
      throw new Error(res.msg)
  }
}

export const ShutdownButton = ({
  obsMode
}: {
  obsMode: ObsMode
}): JSX.Element => {
  const [smContext, loading] = useSMService()
  const smService = smContext?.smService
  const shutdownAction = useAction('Shutdown', shutdown(obsMode))

  return (
    <Button
      disabled={loading || !smService}
      loading={shutdownAction.isLoading}
      onClick={() =>
        smService &&
        showConfirmModal(() => {
          shutdownAction.mutateAsync(smService)
        })
      }
      danger>
      Shutdown
    </Button>
  )
}
