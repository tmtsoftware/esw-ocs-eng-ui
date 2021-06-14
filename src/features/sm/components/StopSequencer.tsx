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

const stopSequencer = (subsystem: Subsystem, obsMode: ObsMode) => (smService: SequenceManagerService) =>
  smService.shutdownSequencer(subsystem, obsMode).then(handleResponse)

export const StopSequencer = ({ sequencerPrefix }: { sequencerPrefix: Prefix }): JSX.Element => {
  const [smContext, isLoading] = useSMService()

  const stopAction = useMutation({
    mutationFn: stopSequencer(sequencerPrefix.subsystem, new ObsMode(sequencerPrefix.componentName)),
    onSuccess: () => successMessage(stopSequencerConstants.successMessage(sequencerPrefix)),
    onError: (e) => errorMessage(stopSequencerConstants.failureMessage(sequencerPrefix), e),
    invalidateKeysOnSuccess: [AGENTS_STATUS.key]
  })

  return (
    <Menu.Item
      icon={<CloseCircleOutlined />}
      disabled={isLoading || stopAction.isLoading}
      onClick={() =>
        smContext?.smService &&
        showConfirmModal(
          () => {
            stopAction.mutate(smContext.smService)
          },
          stopSequencerConstants.getModalTitle(sequencerPrefix.toJSON()),
          stopSequencerConstants.modalOkText
        )
      }>
      {stopSequencerConstants.menuItemText}
    </Menu.Item>
  )
}
