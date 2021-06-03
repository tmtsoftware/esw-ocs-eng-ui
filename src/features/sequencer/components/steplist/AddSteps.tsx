import { PlusCircleOutlined } from '@ant-design/icons'
import type { Sequence, SequenceCommand, SequencerService } from '@tmtsoftware/esw-ts'
import { Menu } from 'antd'
import React, { useState } from 'react'
import { useMutation } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { useStepListContext } from '../../hooks/useStepListContext'
import { handleActionResponse } from '../../utils'
import styles from '../sequencerDetails/sequencerDetails.module.css'
import { addStepsErrorPrefix, addStepsSuccessMsg } from '../sequencerMessageConstants'
import { UploadSequence } from '../UploadSequence'

type AddStepsProps = {
  disabled: boolean
  stepId: string
}

export const AddSteps = ({ disabled, stepId }: AddStepsProps): JSX.Element => {
  const [commands, setCommands] = useState<SequenceCommand[]>([])
  const { sequencerService } = useStepListContext()

  const addStepAction = useMutation({
    mutationFn: (seq: SequencerService) => seq.insertAfter(stepId, commands).then(handleActionResponse),
    onError: (e) => errorMessage(addStepsErrorPrefix, e),
    onSuccess: () => successMessage(addStepsSuccessMsg)
  })

  return (
    <Menu.Item key='AddSteps' disabled={disabled}>
      <UploadSequence
        setSequence={(seq: Sequence) => setCommands(seq.commands)}
        request={() => sequencerService && addStepAction.mutate(sequencerService)}
        uploadErrorMsg={addStepsErrorPrefix}
        disabled={disabled}
        className={styles.upload}>
        <div role='addSteps' style={disabled ? { color: 'var(--disabledColor)' } : undefined}>
          <PlusCircleOutlined style={{ fontSize: '12px', marginRight: '8px' }} />
          Add steps
        </div>
      </UploadSequence>
    </Menu.Item>
  )
}
