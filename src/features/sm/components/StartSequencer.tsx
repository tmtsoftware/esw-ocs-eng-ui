import { ObsMode, subsystems, Variation } from '@tmtsoftware/esw-ts'
import type { Subsystem } from '@tmtsoftware/esw-ts'
import { AutoComplete, Button, Form, Input, message, Modal, Select } from 'antd'
import React, { ChangeEvent, useState } from 'react'
import { useSMService } from '../../../contexts/SMContext'
import { useObsModesDetails } from '../hooks/useObsModesDetails'
import type { GroupedObsModeDetails } from '../hooks/useObsModesDetails'
import { useStartSequencerAction } from '../hooks/useStartSequencerAction'
import { startSequencerConstants } from '../smConstants'

export const StartSequencer = ({ disabled }: { disabled?: boolean }): React.JSX.Element => {
  const emptyString = ''

  const [smContext] = useSMService()
  const { data: obsModeDetails } = useObsModesDetails()

  const [subsystem, setSubsystem] = useState<Subsystem>()
  const [obsMode, setObsMode] = useState<string>(emptyString)
  const [variation, setVariation] = useState<string | undefined>(undefined)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const obsModes = getAllObsModes(obsModeDetails)

  const resetInputData = () => {
    setObsMode(emptyString)
    setVariation(undefined)
    setSubsystem(undefined)
  }

  const startSequencerAction = useStartSequencerAction(
    subsystem as Subsystem,
    new ObsMode(obsMode),
    variation ? new Variation(variation) : undefined
  )

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    if (subsystem && obsMode) {
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

  const onObsModeChange = (data: string) => setObsMode(data)

  const onVariationChange = (event: ChangeEvent<HTMLInputElement>) => {
    setVariation(event.target.value)
  }

  return (
    <>
      <Button onClick={showModal} disabled={disabled} loading={startSequencerAction.isPending}>
        {startSequencerConstants.buttonText}
      </Button>
      <Modal
        title={startSequencerConstants.modalTitle}
        open={isModalVisible}
        onOk={handleOk}
        okText={startSequencerConstants.modalOkText}
        okButtonProps={{
          disabled: !subsystem || !obsMode
        }}
        onCancel={handleCancel}
        destroyOnClose
        centered>
        <Form labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
          <Form.Item label={startSequencerConstants.subsystemInputLabel} name='Subsystem' required>
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
          <Form.Item label={startSequencerConstants.obsModeInputLabel} name='ObsMode' required>
            <AutoComplete
              value={obsMode}
              options={obsModes}
              placeholder={startSequencerConstants.obsModeInputPlaceholder}
              onChange={onObsModeChange}
              onSelect={onObsModeChange}
              filterOption={(inputValue, option) =>
                option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
            />
          </Form.Item>
          <Form.Item label={startSequencerConstants.variationInputLabel} name='Variation'>
            <Input
              placeholder={startSequencerConstants.variationInputPlaceholder}
              value={variation}
              onChange={onVariationChange}
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
