import { ObsMode, Prefix, SequencerState } from '@tmtsoftware/esw-ts'
import { Popconfirm, Typography } from 'antd'
import React from 'react'
import { Spinner } from '../../../../components/spinners/Spinner'
import { useSMService } from '../../../../contexts/SMContext'
import { isSequencerInProgress } from '../../../sequencer/utils'
import { useReloadScriptAction } from '../../hooks/useReloadScriptAction'
import { useStartSequencerAction } from '../../hooks/useStartSequencerAction'
import { sequencerActionConstants } from '../../smConstants'

export const SmSequencerAction = ({
  sequencerPrefix,
  sequencerState
}: {
  sequencerPrefix: Prefix
  sequencerState?: SequencerState
}): JSX.Element => {
  const [smContext, smLoading] = useSMService()
  const smService = smContext?.smService
  const { subsystem, componentName } = sequencerPrefix
  const reloadAction = useReloadScriptAction(subsystem, componentName)
  const startSequencerAction = useStartSequencerAction(subsystem, new ObsMode(componentName))

  if (reloadAction.isLoading) return <Spinner />

  if (!sequencerState) {
    return (
      <Typography.Link
        disabled={smLoading || startSequencerAction.isLoading}
        onClick={() => smService && startSequencerAction.mutateAsync(smService)}>
        {sequencerActionConstants.startSequencer}
      </Typography.Link>
    )
  }
  const isInProgress = isSequencerInProgress(sequencerState)
  const isDisabled = smLoading || reloadAction.isLoading

  const reload = () => {
    smService && reloadAction.mutateAsync(smService)
  }

  return isInProgress ? (
    <Popconfirm
      title={sequencerActionConstants.getPopConfirmTitle(subsystem, componentName, sequencerState)}
      okText={sequencerActionConstants.popConfirmOkText}
      onConfirm={reload}>
      <Typography.Link disabled={isDisabled}>{sequencerActionConstants.reloadScript}</Typography.Link>
    </Popconfirm>
  ) : (
    <Typography.Link disabled={isDisabled} onClick={reload}>
      {sequencerActionConstants.reloadScript}
    </Typography.Link>
  )
}
