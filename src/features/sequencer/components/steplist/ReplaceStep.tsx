// To replace remove step and add new step
import { PlusCircleOutlined } from '@ant-design/icons'
import type { SequencerService, Sequence, SequenceCommand } from '@tmtsoftware/esw-ts'
import React, { useState } from 'react'
import { useMutation } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { useStepListContext } from '../../hooks/useStepListContext'
import { replaceStepConstants } from '../../sequencerConstants'
import { handleStepActionResponse } from '../../utils'
import styles from '../sequencerDetails/sequencerDetails.module.css'
import { UploadSequence } from '../UploadSequence'
import { ItemType } from 'antd/es/menu/interface'

// XXX NOTE: Was an antd 4.x MenuItem react component, made into a hook returning ItemType props for antd 5.x
export function useReplaceStepItem(disabled: boolean, step: string): ItemType {
  const [commands, setCommands] = useState<SequenceCommand[]>([])
  const { sequencerService } = useStepListContext()

  const replaceAction = useMutation({
    mutationFn: (seq: SequencerService) => seq.replace(step, commands).then(handleStepActionResponse),
    onSuccess: () => successMessage(replaceStepConstants.successMessage),
    onError: (e) => errorMessage(replaceStepConstants.failureMessage, e)
  })

  return {
    key: 'ReplaceStep',
    disabled: disabled,
    label: (
      <UploadSequence
        setSequence={(seq: Sequence) => setCommands(seq.commands)}
        request={() => sequencerService && replaceAction.mutate(sequencerService)}
        uploadErrorMsg={replaceStepConstants.failureMessage}
        disabled={disabled}
        className={styles.upload}>
        <div role='replaceSteps' style={disabled ? { color: 'var(--disabledColor)' } : undefined}>
          <PlusCircleOutlined style={{ fontSize: '12px', marginRight: '8px' }} />
          {replaceStepConstants.menuItemText}
        </div>
      </UploadSequence>
    )
  }
}
