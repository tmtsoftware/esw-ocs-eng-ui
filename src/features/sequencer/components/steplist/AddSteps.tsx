import { PlusCircleOutlined } from '@ant-design/icons'
import {
  GenericResponse,
  Sequence,
  SequenceCommand,
  SequencerService
} from '@tmtsoftware/esw-ts'
import { Menu, Upload } from 'antd'
import React, { useState } from 'react'
import { useMutation } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { useSequencerService } from '../../hooks/useSequencerService'
import styles from '../sequencerDetails/sequencerDetails.module.css'
import {
  addStepsErrorPrefix,
  addStepsSuccessMsg,
  cannotOperateOnAnInFlightOrFinishedStepMsg,
  couldNotDeserialiseSequenceMsg,
  idDoesNotExistMsg
} from '../sequencerMessageConstants'
import type { Prefix } from '@tmtsoftware/esw-ts'

const handleResponse = (res: GenericResponse) => {
  switch (res._type) {
    case 'Ok':
      return res

    case 'CannotOperateOnAnInFlightOrFinishedStep':
      throw new Error(cannotOperateOnAnInFlightOrFinishedStepMsg)

    case 'IdDoesNotExist':
      throw new Error(idDoesNotExistMsg(res.id))

    case 'Unhandled':
      throw new Error(res.msg)
  }
}

const addSteps =
  (id: string, commands: SequenceCommand[]) =>
  (sequencerService: SequencerService) =>
    sequencerService.insertAfter(id, commands).then(handleResponse)

type AddStepsProps = {
  disabled: boolean
  stepId: string
  sequencerPrefix: Prefix
}

export const AddSteps = ({
  disabled,
  stepId,
  sequencerPrefix
}: AddStepsProps): JSX.Element => {
  const [commands, setCommands] = useState<SequenceCommand[]>([])
  const sequencerService = useSequencerService(sequencerPrefix)

  const addStepAction = useMutation({
    mutationFn: addSteps(stepId, commands),
    onError: (e) => errorMessage(addStepsErrorPrefix, e),
    onSuccess: () => successMessage(addStepsSuccessMsg)
  })

  const beforeUpload = (file: File): Promise<void> =>
    new Promise<void>((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onerror = () => errorMessage(addStepsErrorPrefix, reader.error)
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          try {
            setCommands(Sequence.fromString(reader.result).commands)
            resolve()
          } catch (e) {
            errorMessage(
              addStepsErrorPrefix,
              Error(couldNotDeserialiseSequenceMsg)
            ).then(reject)
          }
        }
      }
    })

  return (
    <Menu.Item key='AddSteps' disabled={disabled}>
      <Upload
        className={styles.upload}
        disabled={disabled}
        showUploadList={false}
        beforeUpload={beforeUpload}
        customRequest={() =>
          sequencerService && addStepAction.mutate(sequencerService)
        }
        accept='application/json'>
        <div
          role='addSteps'
          style={disabled ? { color: 'var(--disabledColor)' } : undefined}>
          <PlusCircleOutlined
            style={{ fontSize: '12px', marginRight: '8px' }}
          />
          Add steps
        </div>
      </Upload>
    </Menu.Item>
  )
}
