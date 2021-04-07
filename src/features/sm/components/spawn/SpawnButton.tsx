import { AgentService, Prefix, TrackingEvent } from '@tmtsoftware/esw-ts'
import { Button } from 'antd'
import React, { useState } from 'react'
import { SelectionModal } from '../../../../components/Modal/SelectionModal'
import { Spinner } from '../../../../components/spinners/Spinner'
import { useMutation } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import {
  useAgentService,
  useAgentServiceTrack
} from '../../../agent/hooks/useAgentService'
import { useAgentsList } from '../../../agent/hooks/useAgentsList'
import { SM_SERVICE, SM_STATUS } from '../../../queryKeys'
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
const callback = (event: TrackingEvent) => {
  console.log('inside shutdown sm button ', event)
} 
export const SpawnSMButton = (): JSX.Element => {
  const [modalVisibility, setModalVisibility] = useState(false)
  const [agentPrefix, setAgentPrefix] = useState('')

  const allAgentsQuery = useAgentsList()
  const agentServiceQuery = useAgentService()

  useAgentServiceTrack(callback)
  const spawnSmAction = useMutation({
    mutationFn: spawnSM(agentPrefix),
    onSuccess: () => successMessage('Successfully spawned Sequence Manager'),
    onError: (e) =>
      errorMessage(
        'Sequence Manager could not be spawned. Please try again.',
        e
      ),
    invalidateKeysOnSuccess: [SM_STATUS.key, SM_SERVICE.key],
    useErrorBoundary: true
  })

  const handleModalOk = () => {
    if (agentPrefix && agentPrefix !== '') {
      agentServiceQuery.data &&
        spawnSmAction.mutateAsync(agentServiceQuery.data)
      setModalVisibility(false)
    } else {
      errorMessage(`Please select agent!`)
    }
  }

  const handleOnButtonClick = () => {
    if (allAgentsQuery.data && allAgentsQuery.data.length !== 0) {
      setModalVisibility(true)
    } else {
      errorMessage('Agents are not running. Please start an agent first.')
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
