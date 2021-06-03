import { PoweroffOutlined } from '@ant-design/icons'
import type { AgentService, ComponentId } from '@tmtsoftware/esw-ts'
import { Menu } from 'antd'
import React from 'react'
import { showConfirmModal } from '../../../components/modal/showConfirmModal'
import { useAgentService } from '../../../contexts/AgentServiceContext'
import { useMutation } from '../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../utils/message'
import { AGENTS_STATUS } from '../../queryKeys'
import { killComponentConstants } from '../agentConstants'

const killComponent = (componentId: ComponentId) => (agentService: AgentService) =>
  agentService.killComponent(componentId).then((res) => {
    if (res._type === 'Failed') throw new Error(res.msg)
    return res
  })

export const KillSequenceComponent = ({ componentId }: { componentId: ComponentId }): JSX.Element => {
  const [agentService, isLoading] = useAgentService()

  const killSequenceComponentAction = useMutation({
    mutationFn: killComponent(componentId),
    onSuccess: () => successMessage(killComponentConstants.getSuccessMessage(componentId.prefix.toJSON())),
    onError: (e) => errorMessage(killComponentConstants.getFailureMessage(componentId.prefix.toJSON()), e),
    invalidateKeysOnSuccess: [AGENTS_STATUS.key]
  })

  const handleOnClick = () => {
    agentService &&
      showConfirmModal(
        () => {
          killSequenceComponentAction.mutateAsync(agentService)
        },
        killComponentConstants.getModalTitle(componentId.prefix.toJSON()),
        killComponentConstants.modalOkButtonText
      )
  }
  return (
    <Menu.Item
      key='KillSequenceComponent'
      role='KillSequenceComponent'
      danger={true}
      disabled={isLoading}
      icon={<PoweroffOutlined />}
      onClick={handleOnClick}>
      {killComponentConstants.menuItemText}
    </Menu.Item>
  )
}
