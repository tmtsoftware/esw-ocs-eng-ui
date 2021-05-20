import { PlusCircleOutlined } from '@ant-design/icons'
import {
  GenericResponse,
  Sequence,
  SequenceCommand,
  SequencerService
} from '@tmtsoftware/esw-ts'
import { Upload } from 'antd'
import React, { useState } from 'react'
import { useMutation } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { useSequencerService } from '../../hooks/useSequencerService'
import styles from '../sequencerDetails/sequencerDetails.module.css'
import {
  cannotOperateOnAnInFlightOrFinishedStepMsg,
  idDoesNotExistMsg
} from '../sequencerResponsesMapping'
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
    onError: (e) => errorMessage('Failed to add steps', e),
    onSuccess: () => successMessage('Successfully added steps')
  })

  const beforeUpload = (file: File): Promise<void> =>
    new Promise<void>((resolve) => {
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCommands(Sequence.fromString(reader.result).commands)
          resolve()
        }
      }
    })

  return (
    <Upload
      className={styles.upload}
      disabled={disabled}
      beforeUpload={beforeUpload}
      customRequest={() =>
        sequencerService && addStepAction.mutate(sequencerService)
      }>
      <div
        role='addSteps'
        style={disabled ? { color: 'var(--disabledColor)' } : undefined}>
        <PlusCircleOutlined />
        Add steps
      </div>
    </Upload>
  )
}
