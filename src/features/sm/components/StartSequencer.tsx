import { ObsMode, SequenceManagerService, StartSequencerResponse, subsystems } from '@tmtsoftware/esw-ts'
import type { Subsystem } from '@tmtsoftware/esw-ts'
import { AutoComplete, Button, Form, message, Modal, Select } from 'antd'
import React, { useState } from 'react'
import { useSMService } from '../../../contexts/SMContext'
import { useMutation } from '../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../utils/message'
import { AGENTS_STATUS } from '../../queryKeys'
import { GroupedObsModeDetails, useObsModesDetails } from '../hooks/useObsModesDetails'

const handleResponse = (res: StartSequencerResponse) => {
  switch (res._type) {
    case 'Started':
      return res.componentId

    case 'AlreadyRunning':
      throw new Error(`${res.componentId.prefix.toJSON()} is already running`)

    case 'LoadScriptError':
      throw new Error(res.reason)

    case 'LocationServiceError':
      throw new Error(res.reason)

    case 'SequenceComponentNotAvailable':
      throw new Error(res.msg)

    case 'Unhandled':
      throw new Error(res.msg)

    case 'FailedResponse':
      throw new Error(res.reason)
  }
}

const startSequencer = (subsystem: Subsystem, obsMode: ObsMode) => (smService: SequenceManagerService) =>
  smService.startSequencer(subsystem, obsMode).then(handleResponse)

export const StartSequencer = ({ disabled }: { disabled?: boolean }): JSX.Element => {
  const emptyString = ''

  const [smService, isSMLoading] = useSMService()
  const { data: obsModeDetails } = useObsModesDetails()

  const [subsystem, setSubsystem] = useState<Subsystem>()
  const [obsMode, setObsMode] = useState<string>(emptyString)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const obsModes = getAllObsModes(obsModeDetails)
  obsModeDetails?.Configurable.map((e) => ({
    value: e.obsMode.name
  }))
  const resetInputData = () => {
    setObsMode(emptyString)
    setSubsystem(undefined)
  }

  const startSequencerAction = useMutation({
    mutationFn: startSequencer(subsystem as Subsystem, new ObsMode(obsMode)),
    onError: (e) => errorMessage('Failed to start sequencer', e),
    onSuccess: () => successMessage('Successfully started sequencer'),
    invalidateKeysOnSuccess: [AGENTS_STATUS.key]
  })
  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    if (subsystem && obsMode) {
      smService && startSequencerAction.mutateAsync(smService.smService)
      setIsModalVisible(false)
      resetInputData()
    } else {
      message.error('Please input subsystem and observation mode')
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    resetInputData()
  }

  const onSubsystemChange = (subsystem: string) => {
    if (subsystems.find((e) => e === subsystem)) {
      setSubsystem(subsystem as Subsystem)
    }
  }

  const onObsModeChange = (data: string) => setObsMode(data)

  return (
    <>
      <Button onClick={showModal} disabled={isSMLoading || disabled} loading={startSequencerAction.isLoading}>
        Start Sequencer
      </Button>
      <Modal
        title='Select a Subsystem and Observation Mode to spawn:'
        visible={isModalVisible}
        onOk={handleOk}
        okText='Confirm'
        okButtonProps={{
          disabled: !subsystem || !obsMode
        }}
        onCancel={handleCancel}
        destroyOnClose
        centered>
        <Form labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
          <Form.Item label='Subsystem' name='Subsystem'>
            <Select
              showSearch
              onClear={() => setSubsystem(undefined)}
              allowClear
              placeholder='Select a Subsystem'
              onSelect={onSubsystemChange}
              listHeight={124}>
              {subsystems.map((sub) => (
                <Select.Option key={sub} value={sub}>
                  {sub}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label='Observation Mode' name='ObservationMode'>
            <AutoComplete
              value={obsMode}
              options={obsModes}
              placeholder='Enter Observation Mode'
              onChange={onObsModeChange}
              onSelect={onObsModeChange}
              filterOption={(inputValue, option) =>
                option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
const getAllObsModes = (obsModeDetails: GroupedObsModeDetails | undefined) => {
  if (!obsModeDetails) return undefined

  const running = obsModeDetails.Running
  const configurable = obsModeDetails.Configurable
  const nonConfigurable = obsModeDetails['Non-configurable']
  return running
    .concat(configurable)
    .concat(nonConfigurable)
    .map((obs) => ({
      value: obs.obsMode.name
    }))
}
