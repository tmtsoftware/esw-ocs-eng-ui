import type { Prefix, SequencerState } from '@tmtsoftware/esw-ts'
import { Popconfirm, Typography } from 'antd'
import React from 'react'
import { useSMService } from '../../../../contexts/SMContext'
import { useReloadScriptAction } from '../../hooks/reloadScriptAction'
import { sequencerActionConstants } from '../../smConstants'

export const SmSequencerAction = ({
  sequencerPrefix,
  sequencerState
}: {
  sequencerPrefix: Prefix
  sequencerState?: SequencerState
}): JSX.Element => {
  const [smContext, loading] = useSMService()
  const smService = smContext?.smService
  const reloadAction = useReloadScriptAction(sequencerPrefix.subsystem, sequencerPrefix.componentName)
  if (!sequencerState) {
    return <></>
  }
  return (
    <Popconfirm
      title={sequencerActionConstants.popConfirmTitle}
      okText={sequencerActionConstants.popConfirmOkText}
      onConfirm={() => {
        smService && reloadAction.mutateAsync(smService)
      }}>
      <Typography.Link disabled={loading || reloadAction.isLoading}>
        {sequencerActionConstants.reloadScript}
      </Typography.Link>
    </Popconfirm>
  )
}
