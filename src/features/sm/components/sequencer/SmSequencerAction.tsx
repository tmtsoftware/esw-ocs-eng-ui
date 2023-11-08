import type { Prefix, SequencerState } from '@tmtsoftware/esw-ts'
import { Popconfirm, Typography } from 'antd'
import React from 'react'
import { Spinner } from '../../../../components/spinners/Spinner'
import { useSMService } from '../../../../contexts/SMContext'
import { obsModeAndVariationFrom } from '../../../../utils/SMutils'
import { isSequencerInProgress } from '../../../sequencer/utils'
import { useReloadScriptAction } from '../../hooks/useReloadScriptAction'
import { useStartSequencerAction } from '../../hooks/useStartSequencerAction'
import { sequencerActionConstants } from '../../smConstants'

export const SmSequencerAction = ({
  sequencerPrefix,
  sequencerState,
  masterSequencerState
}: {
  sequencerPrefix: Prefix
  masterSequencerState?: SequencerState
  sequencerState?: SequencerState
}): React.JSX.Element => {
  const [smContext, smLoading] = useSMService()
  const smService = smContext?.smService
  const [obsMode, variation] = obsModeAndVariationFrom(sequencerPrefix.componentName)
  const reloadAction = useReloadScriptAction(sequencerPrefix.subsystem, obsMode, variation)
  const startSequencerAction = useStartSequencerAction(sequencerPrefix.subsystem, obsMode, variation)

  if (reloadAction.isPending || startSequencerAction.isPending) return <Spinner />

  if (!sequencerState) {
    return (
      <Typography.Link
        disabled={smLoading || startSequencerAction.isPending}
        onClick={() => smService && startSequencerAction.mutateAsync(smService)}>
        {sequencerActionConstants.startSequencer}
      </Typography.Link>
    )
  }

  const reload = () => {
    smService && reloadAction.mutateAsync(smService)
  }

  const popConfirmTitle = (): React.JSX.Element => (
    <div style={{ width: '22rem' }}>
      {masterSequencerState && isSequencerInProgress(masterSequencerState)
        ? sequencerActionConstants.getPopConfirmTitleWithState(sequencerPrefix, masterSequencerState)
        : sequencerActionConstants.getPopConfirmTitle(sequencerPrefix)}
    </div>
  )

  return (
    <Popconfirm title={popConfirmTitle()} okText={sequencerActionConstants.popConfirmOkText} onConfirm={reload}>
      <Typography.Link disabled={smLoading}>{sequencerActionConstants.reloadScript}</Typography.Link>
    </Popconfirm>
  )
}
