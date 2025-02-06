import { PoweroffOutlined } from '@ant-design/icons'
import type { AgentService, ComponentId } from '@tmtsoftware/esw-ts'
import React from 'react'
import { showConfirmModal } from '../../../components/modal/showConfirmModal'
import { useAgentService } from '../../../contexts/AgentServiceContext'
import { useMutation } from '../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../utils/message'
import { AGENTS_STATUS } from '../../queryKeys'
import { killSequenceComponentConstants } from '../agentConstants'
import type { ItemType } from 'antd/es/menu/interface'

const killComponent = (componentId: ComponentId) => (agentService: AgentService) =>
  agentService.killComponent(componentId).then((res) => {
    if (res._type === 'Failed') throw new Error(res.msg)
    return res
  })

// XXX TODO FIXME: Was a react element, make ito a hook?
export function killSequenceComponentItem(componentId: ComponentId): ItemType {
  const [agentService, isLoading] = useAgentService()

  const killSequenceComponentAction = useMutation({
    mutationFn: killComponent(componentId),
    onSuccess: () => successMessage(killSequenceComponentConstants.getSuccessMessage(componentId.prefix.toJSON())),
    onError: (e) => errorMessage(killSequenceComponentConstants.getFailureMessage(componentId.prefix.toJSON()), e),
    invalidateKeysOnSuccess: [[AGENTS_STATUS.key]]
  })

  const handleOnClick = () => {
    agentService &&
      showConfirmModal(
        () => {
          killSequenceComponentAction.mutateAsync(agentService)
        },
        killSequenceComponentConstants.getModalTitle(componentId.prefix.toJSON()),
        killSequenceComponentConstants.modalOkText
      )
  }
  return ({
      key: 'KillSequenceComponent',
      // role: 'KillSequenceComponent',
      danger: true,
      disabled: isLoading,
      icon: <PoweroffOutlined />,
      onClick: handleOnClick,
      label: killSequenceComponentConstants.menuItemText
    })
}
