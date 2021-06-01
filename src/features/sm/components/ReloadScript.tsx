import { ReloadOutlined } from '@ant-design/icons'
import { ObsMode, RestartSequencerResponse, SequenceManagerService, Subsystem } from '@tmtsoftware/esw-ts'
import { Menu } from 'antd'
import React from 'react'
import { showConfirmModal } from '../../../components/modal/showConfirmModal'
import { useSMService } from '../../../contexts/SMContext'
import { useMutation } from '../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../utils/message'
import { AGENTS_STATUS } from '../../queryKeys'

const handleRestartResponse = (res: RestartSequencerResponse) => {
  switch (res._type) {
    case 'Success':
      return res
    case 'LoadScriptError':
      throw new Error(res.reason)

    case 'LocationServiceError':
      throw new Error(res.reason)

    case 'Unhandled':
      throw new Error(res.msg)

    case 'FailedResponse':
      throw new Error(res.reason)
  }
}
const reloadScript = (subsystem: Subsystem, obsMode: ObsMode) => (smService: SequenceManagerService) =>
  smService.restartSequencer(subsystem, obsMode).then(handleRestartResponse)

type ReloadScriptProps = {
  subsystem: Subsystem
  obsMode: string
}
export const ReloadScript = ({ subsystem, obsMode }: ReloadScriptProps): JSX.Element => {
  const [smContext, loading] = useSMService()
  const smService = smContext?.smService

  const reloadScriptAction = useMutation({
    mutationFn: reloadScript(subsystem, new ObsMode(obsMode)),
    onError: (e) => errorMessage(`Failed to load script (${subsystem}.${obsMode})`, e),
    onSuccess: () => successMessage(`Successfully loaded script ${subsystem}.${obsMode}`),
    invalidateKeysOnSuccess: [AGENTS_STATUS.key]
  })
  const handleOnClick = () => {
    smService &&
      showConfirmModal(
        () => {
          reloadScriptAction.mutateAsync(smService)
        },
        `Do you want to reload the sequencer ${subsystem}.${obsMode}?`,
        'Reload'
      )
  }
  return (
    <Menu.Item
      key='ReloadSequencer'
      icon={<ReloadOutlined />}
      onClick={handleOnClick}
      disabled={loading}
      role='ReloadSequencer'>
      Reload Sequencer
    </Menu.Item>
  )
}
