import { ReloadOutlined } from '@ant-design/icons'
import { ObsMode, SequenceManagerService, Subsystem } from '@tmtsoftware/esw-ts'
import { Menu } from 'antd'
import React from 'react'
import { showConfirmModal } from '../../../components/modal/showConfirmModal'
import { useSMService } from '../../../contexts/SMContext'
import { useMutation } from '../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../utils/message'
import { AGENTS_STATUS } from '../../queryKeys'
import { reloadScriptConstants } from '../smConstants'
import { handleReloadScriptResponse } from '../smUtils'

const reloadScript = (subsystem: Subsystem, obsMode: ObsMode) => (smService: SequenceManagerService) =>
  smService.restartSequencer(subsystem, obsMode).then(handleReloadScriptResponse)

type ReloadScriptProps = {
  subsystem: Subsystem
  obsMode: string
}
export const ReloadScript = ({ subsystem, obsMode }: ReloadScriptProps): JSX.Element => {
  const [smContext, loading] = useSMService()
  const smService = smContext?.smService

  const reloadScriptAction = useMutation({
    mutationFn: reloadScript(subsystem, new ObsMode(obsMode)),
    onError: (e) => errorMessage(reloadScriptConstants.getFailureMessage(`${subsystem}.${obsMode}`), e),
    onSuccess: () => successMessage(reloadScriptConstants.getSuccessMessage(`${subsystem}.${obsMode}`)),
    invalidateKeysOnSuccess: [AGENTS_STATUS.key]
  })
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
