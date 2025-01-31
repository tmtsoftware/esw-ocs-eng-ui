import { ReloadOutlined } from '@ant-design/icons'
import type { SequencerState, Prefix } from '@tmtsoftware/esw-ts'
import React from 'react'
import { showConfirmModal } from '../../../components/modal/showConfirmModal'
import { useSMService } from '../../../contexts/SMContext'
import { obsModeAndVariationFrom } from '../../../utils/SMutils'
import { isSequencerInProgress } from '../../sequencer/utils'
import { useReloadScriptAction } from '../hooks/useReloadScriptAction'
import { reloadScriptConstants } from '../smConstants'
import type { ItemType } from 'antd/es/menu/interface'

const getModalTitle = (isInProgress: boolean, sequencerPrefix: Prefix, sequencerState: SequencerState) =>
  isInProgress
    ? reloadScriptConstants.getModalTitleWithState(sequencerPrefix.toJSON(), sequencerState)
    : reloadScriptConstants.getModalTitle(sequencerPrefix.toJSON())

export function reloadScriptItem(sequencerPrefix: Prefix, sequencerState: SequencerState | undefined): ItemType {
  const [smContext, loading] = useSMService()
  const smService = smContext?.smService
  const [obsMode, variation] = obsModeAndVariationFrom(sequencerPrefix.componentName)
  const reloadScriptAction = useReloadScriptAction(sequencerPrefix.subsystem, obsMode, variation)
  const isInProgress = isSequencerInProgress(sequencerState)

  const handleOnClick = () => {
    sequencerState &&
      smService &&
      showConfirmModal(
        () => {
          reloadScriptAction.mutateAsync(smService)
        },
        getModalTitle(isInProgress, sequencerPrefix, sequencerState),
        reloadScriptConstants.modalOkText
      )
  }

  return {
    key: 'ReloadScript',
    icon: <ReloadOutlined />,
    onClick: handleOnClick,
    disabled: loading,
    // role: 'ReloadScript',
    label: reloadScriptConstants.menuItemText
  }
}
