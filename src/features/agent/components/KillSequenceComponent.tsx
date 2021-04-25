import { DeleteOutlined } from '@ant-design/icons'
import type { ComponentId, AgentService } from '@tmtsoftware/esw-ts'
import { Button, Tooltip } from 'antd'
import React from 'react'
import { useAgentService } from '../../../contexts/AgentServiceContext'
import { useMutation } from '../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../utils/message'
import { AGENTS_STATUS } from '../../queryKeys'
import styles from './agentCards.module.css'

const killComponent = (componentId: ComponentId) => (
  agentService: AgentService
) =>
  agentService.killComponent(componentId).then((res) => {
    if (res._type === 'Failed') throw new Error(res.msg)
    return res
  })

export const KillSequenceComponent = ({
  componentId
}: {
  componentId: ComponentId
}): JSX.Element => {
  const [agentService, isLoading] = useAgentService()

  const killSequenceComponentAction = useMutation({
    mutationFn: killComponent(componentId),
    onSuccess: () =>
      successMessage(
        `Successfully killed Sequence Component: ${componentId.prefix.toJSON()}`
      ),
    onError: (e) => errorMessage('Sequence Component could not be killed', e),
    invalidateKeysOnSuccess: [AGENTS_STATUS.key]
  })

  return (
    <Tooltip placement='bottom' title={'Delete sequence component'}>
      <Button
        type='text'
        icon={
          <DeleteOutlined
            className={styles.deleteIcon}
            role='deleteSeqCompIcon'
            onClick={() =>
              agentService &&
              killSequenceComponentAction.mutateAsync(agentService)
            }
          />
        }
        loading={isLoading || killSequenceComponentAction.isLoading}
      />
    </Tooltip>
  )
}
