import { PlusCircleOutlined } from '@ant-design/icons'
import { AgentService, Prefix } from '@tmtsoftware/esw-ts'
import { Button, Input, Popconfirm, Space, Tooltip, Typography } from 'antd'
import React, { useState } from 'react'
import styles from './agentCards.module.css'
import { useAgentService } from '../../../contexts/AgentServiceContext'
import { useMutation } from '../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../utils/message'
import { AGENTS_STATUS } from '../../queryKeys'
import { spawnSequenceComponentConstants } from '../agentConstants'

const spawnSequenceComponent = (agentPrefix: Prefix, componentName: string) => (agentService: AgentService) =>
  agentService.spawnSequenceComponent(agentPrefix, componentName).then((res) => {
    if (res._type === 'Failed') throw new Error(res.msg)
    return res
  })

const requirement = (predicate: boolean, msg: string) => {
  if (predicate) errorMessage(msg)
  return predicate
}

const validateComponentName = (componentName: string) =>
  requirement(componentName !== componentName.trim(), spawnSequenceComponentConstants.whiteSpaceValidation) ||
  requirement(componentName.includes('-'), spawnSequenceComponentConstants.hyphenValidation)

export const SpawnSequenceComponent = ({ agentPrefix }: { agentPrefix: Prefix }): React.JSX.Element => {
  const [componentName, setComponentName] = useState('')

  const [agentService, isLoading] = useAgentService()

  const spawnSequenceComponentAction = useMutation({
    mutationFn: spawnSequenceComponent(agentPrefix, componentName),
    onSuccess: () =>
      successMessage(
        spawnSequenceComponentConstants.getSuccessMessage(
          `${new Prefix(agentPrefix.subsystem, componentName).toJSON()}`
        )
      ),
    onError: (e) => errorMessage(spawnSequenceComponentConstants.getFailureMessage, e), //TODO should we add componentId?
    invalidateKeysOnSuccess: [[AGENTS_STATUS.key]]
  })

  const resetComponentName = () => setComponentName('')

  const onConfirm = () => {
    !validateComponentName(componentName) && agentService && spawnSequenceComponentAction.mutateAsync(agentService)
    resetComponentName()
  }
  return (
    <Tooltip placement='bottom' title='Add sequence component'>
      <Popconfirm
        id='spawnSequenceComponent'
        style={{ paddingLeft: 0 }}
        title={
          <div>
            <Space direction='vertical'>
              <Typography.Text>Add a sequence component</Typography.Text>
              <Input
                placeholder='Enter a name'
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
              />
            </Space>
          </div>
        }
        icon={<></>}
        onCancel={resetComponentName}
        onVisibleChange={(visible) => {
          if (!visible) resetComponentName()
        }}
        onConfirm={onConfirm}
        disabled={spawnSequenceComponentAction.isPending}
        okText={spawnSequenceComponentConstants.modalOkText}>
        <Button
          type='text'
          style={{ paddingTop: '0.33rem' }}
          icon={<PlusCircleOutlined className={styles.addSeqCompIcon} role='addSeqCompIcon' />}
          loading={isLoading || spawnSequenceComponentAction.isPending}
        />
      </Popconfirm>
    </Tooltip>
  )
}
