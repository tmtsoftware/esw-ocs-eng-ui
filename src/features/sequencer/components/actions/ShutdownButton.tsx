import type { ObsMode, SequenceManagerService } from '@tmtsoftware/esw-ts'
import { Button } from 'antd'
import React from 'react'
import { useAction } from '../../../common/hooks/useAction'
import { errorMessage, successMessage } from '../../../common/message'
import { OBS_MODES_DETAILS_KEY } from '../../../queryKeys'
import { useSMService } from '../../../sm/hooks/useSMService'

const ShutdownButton = ({ obsMode }: { obsMode: ObsMode }): JSX.Element => {
  const smService = useSMService(false)

  const shutdownAction = useAction({
    mutationFn: async (smService: SequenceManagerService) =>
      smService.shutdownObsModeSequencers(obsMode).then((res) => {
        switch (res._type) {
          case 'Success':
            return res
          case 'LocationServiceError':
            throw new Error(res.reason)
          case 'Unhandled':
            throw new Error(res.msg)
        }
      }),
    onSuccess: () => successMessage('Successfully shutdown sequencer'),
    onError: () => errorMessage('Failed to shutdown sequencer'),
    invalidateKeysOnSuccess: [OBS_MODES_DETAILS_KEY]
  })
  return (
    <Button
      disabled={smService.isLoading || smService.isError}
      loading={shutdownAction.isLoading}
      onClick={() =>
        smService.data && shutdownAction.mutateAsync(smService.data)
      }>
      Shutdown
    </Button>
  )
}

export default ShutdownButton
