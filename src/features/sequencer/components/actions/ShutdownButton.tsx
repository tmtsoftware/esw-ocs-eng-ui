import { ExclamationCircleOutlined } from '@ant-design/icons'
import type { ObsMode, SequenceManagerService } from '@tmtsoftware/esw-ts'
import { Button, Modal } from 'antd'
import React from 'react'
import { OBS_MODES_DETAILS } from '../../../queryKeys'
import { useSMService } from '../../../sm/hooks/useSMService'
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
  const smService = useSMService(false)
  const shutdownAction = useAction('Shutdown', shutdown(obsMode), [
    OBS_MODES_DETAILS.key
  ])

  return (
    <Button
      disabled={smService.isLoading || smService.isError}
      loading={shutdownAction.isLoading}
      onClick={() =>
        smService.data &&
        showConfirmModal(() => {
          shutdownAction.mutateAsync(smService.data)
        })
      }
      danger>
      Shutdown
    </Button>
  )
}
