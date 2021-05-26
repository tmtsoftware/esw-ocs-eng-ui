import { FileAddOutlined } from '@ant-design/icons'
import { ObsMode, SequenceManagerService, StartSequencerResponse } from '@tmtsoftware/esw-ts'
import { Button, Input, Popconfirm, Tooltip } from 'antd'
import React, { useState } from 'react'
import { useSMService } from '../../../contexts/SMContext'
import { useMutation } from '../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../utils/message'
import { AGENTS_STATUS } from '../../queryKeys'
import styles from './sm.module.css'
import type { Subsystem } from '@tmtsoftware/esw-ts/lib/src'

const handleResponse = (res: StartSequencerResponse) => {
  switch (res._type) {
    case 'Started':
      return res.componentId

    case 'AlreadyRunning':
      throw new Error(`${res.componentId.prefix.toJSON()} is already running`)

    case 'LoadScriptError':
      throw new Error(res.reason)

    case 'LocationServiceError':
      throw new Error(res.reason)

    case 'SequenceComponentNotAvailable':
      throw new Error(res.msg)

    case 'Unhandled':
      throw new Error(res.msg)

    case 'FailedResponse':
      throw new Error(res.reason)
  }
}

const loadScript = (subsystem: Subsystem, obsMode: ObsMode) => (smService: SequenceManagerService) =>
  smService.startSequencer(subsystem, obsMode).then(handleResponse)

export const LoadScript = ({ subsystem }: { subsystem: Subsystem }): JSX.Element => {
  const [obsMode, setObsMode] = useState<string>('')
  const resetObsMode = () => setObsMode('')
  const [data, isLoading] = useSMService()

  const loadScriptAction = useMutation({
    mutationFn: loadScript(subsystem, new ObsMode(obsMode)),
    onError: (e) => errorMessage('Failed to load script', e),
    onSuccess: () => successMessage('Successfully loaded script'),
    invalidateKeysOnSuccess: [AGENTS_STATUS.key]
  })

  return (
    <Tooltip placement='bottom' title='Load script'>
      <Popconfirm
        title={
          <>
            Observation Mode:
            <Input value={obsMode} onChange={(e) => setObsMode(e.target.value)} />
          </>
        }
        icon={<></>}
        onCancel={resetObsMode}
        onConfirm={() => {
          data && loadScriptAction.mutateAsync(data.smService)
          resetObsMode()
        }}
        disabled={isLoading}>
        <Button
          type='text'
          icon={<FileAddOutlined className={styles.icon} />}
          role='loadScript'
          loading={loadScriptAction.isLoading}
        />
      </Popconfirm>
    </Tooltip>
  )
}
