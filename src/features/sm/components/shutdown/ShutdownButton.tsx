import { ExclamationCircleOutlined } from '@ant-design/icons'
import type { AgentService } from '@tmtsoftware/esw-ts'
import { Button, Modal } from 'antd'
import React from 'react'
import { Spinner } from '../../../../components/spinners/Spinner'
import { useAgentService } from '../../../agent/hooks/useAgentService'
import { useAgentServiceAction } from '../../../agent/hooks/useAgentServiceAction'
import { smComponentId } from '../../constants'

function showConfirmModal<T>(onYes: () => Promise<T>): void {
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
  agent.killComponent(smComponentId).then((res) => {
    if (res._type === 'Failed') throw new Error(res.msg)
    return res
  })

export const ShutdownSMButton = (): JSX.Element => {
  const agentQuery = useAgentService()

  const shutdownSmAction = useAgentServiceAction(
    shutdownSM,
    'Successfully shutdown Sequence Manager',
    'Failed to shutdown Sequence Manager'
  )

  if (agentQuery.isLoading) return <Spinner />

  return (
    <Button
      danger
      loading={shutdownSmAction.isLoading}
      onClick={() =>
        agentQuery.data &&
        showConfirmModal(() => shutdownSmAction.mutateAsync(agentQuery.data))
      }>
      Shutdown
    </Button>
  )
}
