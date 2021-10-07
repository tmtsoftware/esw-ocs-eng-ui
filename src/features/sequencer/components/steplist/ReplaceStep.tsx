// To replace remove step and add new step
import { PlusCircleOutlined } from '@ant-design/icons'
import type { SequencerService, Sequence, SequenceCommand } from '@tmtsoftware/esw-ts'
import { Menu } from 'antd'
import React, { useState } from 'react'
import { useMutation } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { useStepListContext } from '../../hooks/useStepListContext'
import { replaceStepConstants } from '../../sequencerConstants'
import { handleStepActionResponse } from '../../utils'
import styles from '../sequencerDetails/sequencerDetails.module.css'
import { UploadSequence } from '../UploadSequence'

type ReplaceActionProps = {
  disabled: boolean
  step: string
}

export const ReplaceStep = ({ step, disabled }: ReplaceActionProps): JSX.Element => {
  const [commands, setCommands] = useState<SequenceCommand[]>([])
  const { sequencerService } = useStepListContext()

  const replaceAction = useMutation({
    mutationFn: (seq: SequencerService) => seq.replace(step, commands).then(handleStepActionResponse),
    onSuccess: () => successMessage(replaceStepConstants.successMessage),
    onError: (e) => errorMessage(replaceStepConstants.failureMessage, e)
  })

  return (
    <Menu.Item key='ReplaceStep' disabled={disabled}>
      <UploadSequence
        setSequence={(seq: Sequence) => setCommands(seq.commands)}
        request={() => sequencerService && replaceAction.mutate(sequencerService)}
        uploadErrorMsg={replaceStepConstants.failureMessage}
        disabled={disabled}
        className={styles.upload}>
        <div role='addSteps' style={disabled ? { color: 'var(--disabledColor)' } : undefined}>
          <PlusCircleOutlined style={{ fontSize: '12px', marginRight: '8px' }} />
          {replaceStepConstants.menuItemText}
        </div>
      </UploadSequence>
    </Menu.Item>
  )
}
