import { DeleteOutlined } from '@ant-design/icons'
import type { ComponentId } from '@tmtsoftware/esw-ts'
import { AgentService, Prefix } from '@tmtsoftware/esw-ts'
import { Button, Tooltip } from 'antd'
import React from 'react'
import { useMutation } from '../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../utils/message'
import { AGENTS_STATUS } from '../../queryKeys'
import { useAgentService } from '../hooks/useAgentService'
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
  const { data: agentService } = useAgentService()

  const killSequenceComponentAction = useMutation({
    mutationFn: killComponent(componentId),
    onSuccess: () =>
      successMessage(
        `Successfully killed Sequence Component: ${new Prefix(
          componentId.prefix.subsystem,
          componentId.prefix.componentName
        ).toJSON()}`
      ),
    onError: (e) =>
      errorMessage(
        'Sequence Component could not be killed. Please try again.',
        e
      ),
    invalidateKeysOnSuccess: [AGENTS_STATUS.key],
    useErrorBoundary: false
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
        loading={killSequenceComponentAction.isLoading}
      />
    </Tooltip>
  )
}
