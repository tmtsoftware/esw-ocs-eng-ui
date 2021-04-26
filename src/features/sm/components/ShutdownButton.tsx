import { ExclamationCircleOutlined } from '@ant-design/icons'
import type { AgentService } from '@tmtsoftware/esw-ts'
import { Button, Modal } from 'antd'
import React from 'react'
import { Spinner } from '../../../components/spinners/Spinner'
import { useAgentService } from '../../../contexts/AgentServiceContext'
import { useMutation } from '../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../utils/message'
import { SM_COMPONENT_ID } from '../constants'

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

const shutdownSM = (agent: AgentService) =>
  agent.killComponent(SM_COMPONENT_ID).then((res) => {
    if (res._type === 'Failed') throw new Error(res.msg)
    return res
  })

export const ShutdownSMButton = (): JSX.Element => {
  const [agentService, agentServiceLoading] = useAgentService()

  const shutdownSmAction = useMutation({
    mutationFn: shutdownSM,
    onSuccess: () => successMessage('Successfully shutdown Sequence Manager'),
    onError: (e) => errorMessage('Failed to shutdown Sequence Manager', e),
    useErrorBoundary: true //TODO : remove error boundary
  })

  if (agentServiceLoading) return <Spinner />

  return (
    <Button
      danger
      loading={shutdownSmAction.isLoading}
      onClick={() =>
        agentService &&
        showConfirmModal(() => {
          shutdownSmAction.mutateAsync(agentService)
        })
      }>
      Shutdown
    </Button>
  )
}
