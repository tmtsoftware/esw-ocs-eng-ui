import { Prefix, Subsystem, subsystems } from '@tmtsoftware/esw-ts'

import { AutoComplete, Button, Form, message, Modal, Select } from 'antd'
import React, { useState } from 'react'
import { useSMService } from '../../../contexts/SMContext'
import { GroupedObsModeDetails, useObsModesDetails } from '../hooks/useObsModesDetails'
import { useStartSequencerAction } from '../hooks/useStartSequencerAction'
import { startSequencerConstants } from '../smConstants'

export const StartSequencer = ({ disabled }: { disabled?: boolean }): JSX.Element => {
  const emptyString = ''

  const [smContext] = useSMService()
  const { data: obsModeDetails } = useObsModesDetails()

  const [subsystem, setSubsystem] = useState<Subsystem>()
  const [componentName, setComponentName] = useState<string>(emptyString)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const obsModes = getAllObsModes(obsModeDetails)
  // obsModeDetails?.Configurable.map((e) => ({
  //   value: e.obsMode.name
  // }))
  const resetInputData = () => {
    setComponentName(emptyString)
    setSubsystem(undefined)
  }

  const startSequencerAction = useStartSequencerAction(new Prefix(subsystem as Subsystem, componentName))
  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    if (subsystem && componentName) {
      smContext && startSequencerAction.mutateAsync(smContext.smService)
      setIsModalVisible(false)
      resetInputData()
    } else {
      message.error(startSequencerConstants.inputErrorMessage)
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

  const onComponentNameChange = (data: string) => setComponentName(data)

  return (
    <>
      <Button onClick={showModal} disabled={disabled} loading={startSequencerAction.isLoading}>
        {startSequencerConstants.buttonText}
      </Button>
      <Modal
        title={startSequencerConstants.modalTitle}
        visible={isModalVisible}
        onOk={handleOk}
        okText={startSequencerConstants.modalOkText}
        okButtonProps={{
          disabled: !subsystem || !componentName
        }}
        onCancel={handleCancel}
        destroyOnClose
        centered>
        <Form labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
          <Form.Item label={startSequencerConstants.subsystemInputLabel} name='Subsystem'>
            <Select
              showSearch
              onClear={() => setSubsystem(undefined)}
              allowClear
              placeholder={startSequencerConstants.subsystemInputPlaceholder}
              onSelect={onSubsystemChange}
              listHeight={124}>
              {subsystems.map((sub) => (
                <Select.Option key={sub} value={sub}>
                  {sub}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label={startSequencerConstants.obsModeInputLabel} name='ComponentName'>
            <AutoComplete
              value={componentName}
              options={obsModes}
              placeholder={startSequencerConstants.obsModeInputPlaceholder}
              onChange={onComponentNameChange}
              onSelect={onComponentNameChange}
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
