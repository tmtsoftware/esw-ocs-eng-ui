import { ExclamationCircleOutlined } from '@ant-design/icons'
import type { AgentService } from '@tmtsoftware/esw-ts'
import { Button, Modal } from 'antd'
import React from 'react'
import { Spinner } from '../../../../components/spinners/Spinner'
import { useAction } from '../../../../hooks/useAction'
import { errorMessage, successMessage } from '../../../../utils/message'
import { useAgentService } from '../../../agent/hooks/useAgentService'
import { SM_STATUS_KEY } from '../../../queryKeys'
import { SM_COMPONENT_ID } from '../../constants'

function showConfirmModal(onYes: () => void): void {
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
  const agentQuery = useAgentService()

  const shutdownSmAction = useAction({
    mutationFn: shutdownSM,
    onSuccess: () => successMessage('Successfully shutdown Sequence Manager'),
    onError: (e) => errorMessage('Failed to shutdown Sequence Manager', e),
    invalidateKeysOnSuccess: [SM_STATUS_KEY],
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
