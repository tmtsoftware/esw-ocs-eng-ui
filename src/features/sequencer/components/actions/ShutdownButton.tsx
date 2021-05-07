import type { ObsMode, SequenceManagerService } from '@tmtsoftware/esw-ts'
import { Button } from 'antd'
import React from 'react'
import { showConfirmModal } from '../../../../components/modal/showConfirmModal'
import { useSMService } from '../../../../contexts/SMContext'
import { OBS_MODES_DETAILS } from '../../../queryKeys'
import { useAction } from './ActionButton'

const shutdown = (obsMode: ObsMode) => async (
  smService: SequenceManagerService
) => {
  const res = await smService.shutdownObsModeSequencers(obsMode)
  switch (res._type) {
    case 'Success':
      return res
    case 'LocationServiceError':
      throw new Error(res.reason)
    case 'Unhandled':
      throw new Error(res.msg)
  }
}

export const ShutdownButton = ({
  obsMode
}: {
  obsMode: ObsMode
}): JSX.Element => {
  const [smContext, loading] = useSMService()
  const smService = smContext?.smService
  const shutdownAction = useAction('Shutdown', shutdown(obsMode), [
    OBS_MODES_DETAILS.key
  ])

  return (
    <Button
      disabled={loading || !smService}
      loading={shutdownAction.isLoading}
      onClick={() =>
        smService &&
        showConfirmModal(
          () => {
            shutdownAction.mutateAsync(smService)
          },
          `Do you want to shutdown Observation ${obsMode.toJSON()}?`,
          'Shutdown'
        )
      }
      danger>
      Shutdown
    </Button>
  )
}
