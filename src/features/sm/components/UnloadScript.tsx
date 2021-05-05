import { FileExcelOutlined } from '@ant-design/icons'
import {
  ObsMode,
  Prefix,
  SequenceManagerService,
  ShutdownSequencersResponse,
  Subsystem
} from '@tmtsoftware/esw-ts'
import { Button, Tooltip } from 'antd'
import React from 'react'
import { showConfirmModal } from '../../../components/modal/showConfirmModal'
import { useSMService } from '../../../contexts/SMContext'
import { useMutation } from '../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../utils/message'
import { AGENTS_STATUS } from '../../queryKeys'
import styles from './sm.module.css'

const handleResponse = (res: ShutdownSequencersResponse) => {
  switch (res._type) {
    case 'LocationServiceError':
      throw new Error(res.reason)

    case 'Success':
      return res

    case 'Unhandled':
      throw new Error(res.msg)
  }
}

const unloadScript = (subsystem: Subsystem, obsMode: ObsMode) => (
  smService: SequenceManagerService
) => smService.shutdownSequencer(subsystem, obsMode).then(handleResponse)

export const UnloadScript = ({
  sequencerPrefix
}: {
  sequencerPrefix: Prefix
}): JSX.Element => {
  const [data, isLoading] = useSMService()

  const unloadAction = useMutation({
    mutationFn: unloadScript(
      sequencerPrefix.subsystem,
      new ObsMode(sequencerPrefix.componentName)
    ),
    onError: (e) => errorMessage('Failed to unload sequencer', e),
    onSuccess: () => successMessage('Successfully unloaded sequencer'),
    invalidateKeysOnSuccess: [AGENTS_STATUS.key]
  })

  return (
    <Tooltip placement='bottom' title='Unload script'>
      <Button
        type='text'
        icon={<FileExcelOutlined className={styles.icon} />}
        role='unloadScriptIcon'
        disabled={isLoading}
        onClick={() =>
          data?.smService &&
          showConfirmModal(
            () => {
              unloadAction.mutate(data.smService)
            },
            `Do you want to unload the sequencer ${sequencerPrefix.toJSON()}?`,
            'Unload'
          )
        }
      />
    </Tooltip>
  )
}
