import { ObsMode, Prefix, SequencerState } from '@tmtsoftware/esw-ts'
import { Popconfirm, Typography } from 'antd'
import React from 'react'
import { useSMService } from '../../../../contexts/SMContext'
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

  if (!sequencerState) {
    return (
      <Typography.Link
        disabled={smLoading || startSequencerAction.isLoading}
        onClick={() => smService && startSequencerAction.mutateAsync(smService)}>
        {sequencerActionConstants.startSequencer}
      </Typography.Link>
    )
  }
  return (
    <Popconfirm
      title={sequencerActionConstants.getPopConfirmTitle(subsystem, componentName)}
      okText={sequencerActionConstants.popConfirmOkText}
      onConfirm={() => {
        smService && reloadAction.mutateAsync(smService)
      }}>
      <Typography.Link disabled={smLoading || reloadAction.isLoading}>
        {sequencerActionConstants.reloadScript}
      </Typography.Link>
    </Popconfirm>
  )
}
