import type { SequencerService } from '@tmtsoftware/esw-ts'
import { Button, Tooltip } from 'antd'
import React from 'react'
import { StepThroughIcon } from '../../../../components/icons'
import { useMutation } from '../../../../hooks/useMutation'
import { errorMessage } from '../../../../utils/message'
import { useStepListContext } from '../../hooks/useStepListContext'
import { handleActionResponse } from '../../utils'
import styles from '../sequencerDetails/sequencerDetails.module.css'

const stepThrough =
  (currentStepId: string, nextStepId: string | undefined) => async (sequencerService: SequencerService) => {
    //when current step is last step, next Step will not exist, hence skip add breakpoint
    nextStepId && (await sequencerService.addBreakpoint(nextStepId).then(handleActionResponse))
    return sequencerService.removeBreakpoint(currentStepId).then(handleActionResponse)
  }

type StepThroughSequenceProps = {
  currentStepId: string
  nextStepId: string | undefined
  disabled: boolean
}

export const stepThroughFailedMessage = 'StepThrough failed for step'

export const StepThroughSequence = ({ currentStepId, nextStepId, disabled }: StepThroughSequenceProps): JSX.Element => {
  const { sequencerService } = useStepListContext()
  const stepThroughAction = useMutation({
    mutationFn: stepThrough(currentStepId, nextStepId),
    onSuccess: () => 'Do not show any message',
    onError: (e) => errorMessage(stepThroughFailedMessage, e)
  })

  return (
    <Tooltip title={'Step-Through'}>
      <Button
        style={{ paddingTop: '0.33em' }}
        onClick={() => sequencerService && stepThroughAction.mutate(sequencerService)}
        icon={<StepThroughIcon className={disabled ? styles.actionDisabled : styles.actionEnabled} />}
        role='StepThroughSequence'
        disabled={disabled}
        type='text'
      />
    </Tooltip>
  )
}
