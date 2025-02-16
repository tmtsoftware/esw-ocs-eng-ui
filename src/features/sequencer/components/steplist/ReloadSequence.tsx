import { ReloadOutlined } from '@ant-design/icons'
import { Sequence, StepList } from '@tmtsoftware/esw-ts'
import { Button, Tooltip } from 'antd'
import React from 'react'
import { useLoadAction } from '../../hooks/useLoadAction'
import { useStepListContext } from '../../hooks/useStepListContext'
import { getStepListInfo } from '../../utils'
import styles from '../sequencerDetails/sequencerDetails.module.css'

export const ReloadSequence = ({ stepList }: { stepList?: StepList }): React.JSX.Element => {
  const { sequencerService } = useStepListContext()
  const sequence = stepList?.steps.map((step) => step.command)
  const reloadSequence = useLoadAction(
    sequence && sequence.length > 0 ? new Sequence([sequence[0], ...sequence.slice(1)]) : undefined
  )
  const stepListInfo = stepList && getStepListInfo(stepList)

  const disabled = !(stepList?.isFailed() || stepListInfo?.status === 'All Steps Completed')
  return (
    <Tooltip title={'Reload sequence'}>
      <Button
        onClick={async () => sequencerService && await reloadSequence.mutate(sequencerService)}
        type={'text'}
        shape={'circle'}
        icon={<ReloadOutlined className={disabled ? styles.actionDisabled : styles.actionEnabled} />}
        disabled={disabled}
        role='ReloadSequence'
      />
    </Tooltip>
  )
}
