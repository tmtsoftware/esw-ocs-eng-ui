import { PlusCircleOutlined } from '@ant-design/icons'
import type { Sequence, SequenceCommand, SequencerService } from '@tmtsoftware/esw-ts'
import React, { useState } from 'react'
import { useMutation } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { useStepListContext } from '../../hooks/useStepListContext'
import { addStepConstants } from '../../sequencerConstants'
import { handleStepActionResponse } from '../../utils'
import styles from '../sequencerDetails/sequencerDetails.module.css'
import { UploadSequence } from '../UploadSequence'
import { ItemType } from 'antd/es/menu/interface'

export function addStepsItem(disabled: boolean, stepId: string): ItemType {
  const [commands, setCommands] = useState<SequenceCommand[]>([])
  const { sequencerService } = useStepListContext()

  const addStepAction = useMutation({
    mutationFn: (seq: SequencerService) => seq.insertAfter(stepId, commands).then(handleStepActionResponse),
    onSuccess: () => successMessage(addStepConstants.successMessage),
    onError: (e) => errorMessage(addStepConstants.failureMessage, e)
  })

  return {
    key: 'AddSteps',
    disabled: disabled,
    label: (
      <UploadSequence
        setSequence={(seq: Sequence) => setCommands(seq.commands)}
        request={() => sequencerService && addStepAction.mutate(sequencerService)}
        uploadErrorMsg={addStepConstants.failureMessage}
        disabled={disabled}
        className={styles.upload}>
        <div role='addSteps' style={disabled ? { color: 'var(--disabledColor)' } : undefined}>
          <PlusCircleOutlined style={{ fontSize: '12px', marginRight: '8px' }} />
          {addStepConstants.menuItemText}
        </div>
      </UploadSequence>
    )
  }
}
