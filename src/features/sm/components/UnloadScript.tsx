import { CloseCircleOutlined } from '@ant-design/icons'
import { ObsMode, Prefix, SequenceManagerService, ShutdownSequencersResponse, Subsystem } from '@tmtsoftware/esw-ts'
import { Menu } from 'antd'
import React from 'react'
import { showConfirmModal } from '../../../components/modal/showConfirmModal'
import { useSMService } from '../../../contexts/SMContext'
import { useMutation } from '../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../utils/message'
import { AGENTS_STATUS } from '../../queryKeys'
import { stopSequencerConstants } from '../smConstants'

const handleResponse = (res: ShutdownSequencersResponse) => {
  switch (res._type) {
    case 'LocationServiceError':
      throw new Error(res.reason)

    case 'Success':
      return res

    case 'Unhandled':
      throw new Error(res.msg)

    case 'FailedResponse':
      throw new Error(res.reason)
  }
}

const unloadScript = (subsystem: Subsystem, obsMode: ObsMode) => (smService: SequenceManagerService) =>
  smService.shutdownSequencer(subsystem, obsMode).then(handleResponse)

export const UnloadScript = ({ sequencerPrefix }: { sequencerPrefix: Prefix }): JSX.Element => {
  const [data, isLoading] = useSMService()

  const unloadAction = useMutation({
    mutationFn: unloadScript(sequencerPrefix.subsystem, new ObsMode(sequencerPrefix.componentName)),
    onSuccess: () => successMessage(stopSequencerConstants.successMessage),
    onError: (e) => errorMessage(stopSequencerConstants.failureMessage, e),
    invalidateKeysOnSuccess: [AGENTS_STATUS.key]
  })

  return (
    <Menu.Item
      icon={<CloseCircleOutlined />}
      disabled={isLoading || unloadAction.isLoading}
      onClick={() =>
        data?.smService &&
        showConfirmModal(
          () => {
            unloadAction.mutate(data.smService)
          },
          stopSequencerConstants.getModalTitle(sequencerPrefix.toJSON()),
          stopSequencerConstants.modalOkButtonText
        )
      }>
      {stopSequencerConstants.menuItemText}
    </Menu.Item>
  )
}
