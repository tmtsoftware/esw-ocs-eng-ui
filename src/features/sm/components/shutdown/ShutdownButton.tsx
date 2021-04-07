import { ExclamationCircleOutlined } from '@ant-design/icons'
import type { AgentService, TrackingEvent } from '@tmtsoftware/esw-ts'
import { Button, Modal } from 'antd'
import React, { useEffect } from 'react'
import { Spinner } from '../../../../components/spinners/Spinner'
import { useMutation } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import {
  useAgentService,
  useAgentServiceTrack
} from '../../../agent/hooks/useAgentService'
import { SM_STATUS } from '../../../queryKeys'
import { SM_COMPONENT_ID } from '../../constants'

const showConfirmModal = (onYes: () => void): void => {
  Modal.confirm({
    title: 'Do you want to shutdown Sequence Manager?',
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

const callback = (event: TrackingEvent) => {
  console.log('inside shutdown sm button ', event)
}

const shutdownSM = (agent: AgentService) =>
  agent.killComponent(SM_COMPONENT_ID).then((res) => {
    if (res._type === 'Failed') throw new Error(res.msg)
    return res
  })

export const ShutdownSMButton = (): JSX.Element => {
  const agentQuery = useAgentService()

  const shutdownSmAction = useMutation({
    mutationFn: shutdownSM,
    onSuccess: () => successMessage('Successfully shutdown Sequence Manager'),
    onError: (e) => errorMessage('Failed to shutdown Sequence Manager', e),
    invalidateKeysOnSuccess: [SM_STATUS.key],
    useErrorBoundary: true
  })

  if (agentQuery.isLoading) return <Spinner />

  return (
    <Button
      danger
      loading={shutdownSmAction.isLoading}
      onClick={() =>
        agentQuery.data &&
        showConfirmModal(() => {
          shutdownSmAction.mutateAsync(agentQuery.data)
        })
      }>
      Shutdown
    </Button>
  )
}
