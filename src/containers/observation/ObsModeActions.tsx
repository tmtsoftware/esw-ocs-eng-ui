import type { ObsMode } from '@tmtsoftware/esw-ts'
import { Button } from 'antd'
import React from 'react'
import type { TabName } from './ObservationTabs'
import { useSMService } from '../../contexts/SMContext'
import { ShutdownButton } from '../../features/sequencer/components/actions/ShutdownButton'
import { useConfigureAction } from '../../features/sm/hooks/useConfigureAction'
import { useProvisionStatus } from '../../features/sm/hooks/useProvisionStatus'

type ObsModeActionsProps = {
  tabName?: TabName
  obsMode: ObsMode
}

export const RunningActions = ({ obsMode }: ObsModeActionsProps): React.JSX.Element => (
  <ShutdownButton obsMode={obsMode} />
)

export const ConfigurableActions = ({ obsMode }: ObsModeActionsProps): React.JSX.Element => {
  const configureAction = useConfigureAction(obsMode)
  const [smContext, isLoading] = useSMService()
  const smService = smContext?.smService
  const provisionStatus = useProvisionStatus()

  return (
    <Button
      onClick={() => smService && configureAction.mutate(smService)}
      loading={isLoading || configureAction.isLoading}
      disabled={!provisionStatus}>
      Configure
    </Button>
  )
}
