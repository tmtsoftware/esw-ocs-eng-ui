import { ReloadOutlined } from '@ant-design/icons'
import type { Subsystem } from '@tmtsoftware/esw-ts'
import { Menu } from 'antd'
import React from 'react'
import { showConfirmModal } from '../../../components/modal/showConfirmModal'
import { useSMService } from '../../../contexts/SMContext'
import { useReloadScriptAction } from '../hooks/useReloadScriptAction'
import { reloadScriptConstants } from '../smConstants'

type ReloadScriptProps = {
  subsystem: Subsystem
  obsMode: string
}
export const ReloadScript = ({ subsystem, obsMode }: ReloadScriptProps): JSX.Element => {
  const [smContext, loading] = useSMService()
  const smService = smContext?.smService

  const reloadScriptAction = useReloadScriptAction(subsystem, obsMode)
  const handleOnClick = () => {
    smService &&
      showConfirmModal(
        () => {
          reloadScriptAction.mutateAsync(smService)
        },
        reloadScriptConstants.getModalTitle(subsystem, obsMode),
        reloadScriptConstants.modalOkText
      )
  }
  return (
    <Menu.Item
      key='ReloadScript'
      icon={<ReloadOutlined />}
      onClick={handleOnClick}
      disabled={loading}
      role='ReloadScript'>
      {reloadScriptConstants.menuItemText}
    </Menu.Item>
  )
}
