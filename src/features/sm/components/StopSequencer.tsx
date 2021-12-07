import { CloseCircleOutlined } from '@ant-design/icons'
import type {
  SequenceManagerService,
  SequencerState,
  ShutdownSequencersResponse,
  Subsystem,
  ObsMode,
  Prefix,
  Variation
} from '@tmtsoftware/esw-ts'
import { Menu } from 'antd'
import React from 'react'
import { showConfirmModal } from '../../../components/modal/showConfirmModal'
import { useSMService } from '../../../contexts/SMContext'
import { useMutation } from '../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../utils/message'
import { obsModeAndVariationFrom } from '../../../utils/SMutils'
import { AGENTS_STATUS } from '../../queryKeys'
import { isSequencerInProgress } from '../../sequencer/utils'
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

const getModalTitle = (isInProgress: boolean, sequencerPrefix: Prefix, sequencerState: SequencerState) =>
  isInProgress
    ? stopSequencerConstants.getModalTitleWithState(sequencerPrefix.toJSON(), sequencerState)
    : stopSequencerConstants.getModalTitle(sequencerPrefix.toJSON())

const stopSequencer =
  (subsystem: Subsystem, obsMode: ObsMode, variation?: Variation) => (smService: SequenceManagerService) =>
    smService.shutdownSequencer(subsystem, obsMode, variation).then(handleResponse)

export const StopSequencer = ({
  sequencerPrefix,
  sequencerState
}: {
  sequencerPrefix: Prefix
  sequencerState: SequencerState | undefined
}): JSX.Element => {
  const [smContext, isLoading] = useSMService()
  const isInProgress = isSequencerInProgress(sequencerState)
  const [obsMode, variation] = obsModeAndVariationFrom(sequencerPrefix.componentName)
  const handleOnClick = () => {
    sequencerState &&
      smContext?.smService &&
      showConfirmModal(
        () => {
          stopAction.mutate(smContext.smService)
        },
        getModalTitle(isInProgress, sequencerPrefix, sequencerState),
        stopSequencerConstants.modalOkText
      )
  }

  const stopAction = useMutation({
    mutationFn: stopSequencer(sequencerPrefix.subsystem, obsMode, variation),
    onSuccess: () => successMessage(stopSequencerConstants.successMessage(sequencerPrefix)),
    onError: (e) => errorMessage(stopSequencerConstants.failureMessage(sequencerPrefix), e),
    invalidateKeysOnSuccess: [AGENTS_STATUS.key]
  })

  return (
    <Menu.Item
      icon={<CloseCircleOutlined />}
      disabled={isLoading || stopAction.isLoading}
      onClick={handleOnClick}
      key='stopSequencer'>
      {stopSequencerConstants.menuItemText}
    </Menu.Item>
  )
}
