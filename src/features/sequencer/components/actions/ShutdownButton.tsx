import type { ObsMode, SequenceManagerService } from '@tmtsoftware/esw-ts'
import React from 'react'
import { useSMService } from '../../../sm/hooks/useSMService'
import ActionButton from './ActionButton'

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

const ShutdownButton = ({ obsMode }: { obsMode: ObsMode }): JSX.Element => {
  const smService = useSMService(false)
  return (
    <ActionButton
      title='Shutdown'
      queryResult={smService}
      onClick={shutdown(obsMode)}
    />
  )
}

export default ShutdownButton
