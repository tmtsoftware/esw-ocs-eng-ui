import { AgentService, Prefix } from '@tmtsoftware/esw-ts'
import { Button, message } from 'antd'
import React, { useState } from 'react'
import { SelectionModal } from '../../../../components/Modal/SelectionModal'
import { Spinner } from '../../../../components/spinners/Spinner'
import { useAgentService } from '../../../agent/hooks/useAgentService'
import { useAgentServiceAction } from '../../../agent/hooks/useAgentServiceAction'
import { useAgentsList } from '../../../agent/hooks/useAgentsList'
import { OBS_MODE_CONFIG } from '../../constants'

const spawnSM = (agentPrefix: string) => (agent: AgentService) =>
  agent
    .spawnSequenceManager(
      Prefix.fromString(agentPrefix),
      OBS_MODE_CONFIG,
      false
    )
    .then((res) => {
      if (res._type === 'Failed') throw new Error(res.msg)
      return res
    })

export const SpawnSMButton = (): JSX.Element => {
  const [modalVisibility, setModalVisibility] = useState(false)
  const [agentPrefix, setAgentPrefix] = useState('')

  const allAgentsQuery = useAgentsList()
  const agentServiceQuery = useAgentService()

  const spawnSmAction = useAgentServiceAction(
    spawnSM(agentPrefix),
    'Successfully spawned Sequence Manager',
    'Sequence Manager could not be spawned. Please try again.'
  )

  const handleModalOk = () => {
    if (agentPrefix && agentPrefix !== '') {
      agentServiceQuery.data &&
        spawnSmAction.mutateAsync(agentServiceQuery.data)
      setModalVisibility(false)
    } else {
      message.error(`Please select agent!`)
    }
  }

  const handleOnButtonClick = () => {
    if (allAgentsQuery.data && allAgentsQuery.data.length !== 0) {
      setModalVisibility(true)
    } else {
      message.error('Agents are not running. Please start an agent first.')
    }
  }
  const handleModalCancel = () => setModalVisibility(false)
  const handleModalAgentSelection = (value: string) => setAgentPrefix(value)

  if (agentServiceQuery.isLoading || allAgentsQuery.isLoading)
    return <Spinner />

  return (
    <>
      <Button
        type='primary'
        size='middle'
        loading={spawnSmAction.isLoading}
        onClick={handleOnButtonClick}>
        Spawn
      </Button>
      <SelectionModal
        title='Choose an agent to spawn the Sequence Manager'
        okText='Spawn'
        visible={modalVisibility}
        confirmLoading={spawnSmAction.isLoading}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        data={allAgentsQuery.data?.map((prefix) => prefix.toJSON())}
        selectedItem={agentPrefix}
        onChange={handleModalAgentSelection}
      />
    </>
  )
}
