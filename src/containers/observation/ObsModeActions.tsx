import type { ObsMode } from '@tmtsoftware/esw-ts'
import { Button } from 'antd'
import React from 'react'
import { useSMService } from '../../contexts/SMContext'
import { ShutdownButton } from '../../features/sequencer/components/actions/ShutdownButton'
import { useConfigureAction } from '../../features/sm/hooks/useConfigureAction'
import { useProvisionStatus } from '../../features/sm/hooks/useProvisionStatus'
import type { TabName } from './ObservationTabs'

type ObsModeActionsProps = {
  tabName?: TabName
  obsMode: ObsMode
}

const RunningActions = ({ obsMode }: ObsModeActionsProps) => (
  <ShutdownButton obsMode={obsMode} />
)

const NonRunningActions = ({ tabName, obsMode }: ObsModeActionsProps) => {
  const configureAction = useConfigureAction(obsMode)
  const [smContext, isLoading] = useSMService()
  const smService = smContext?.smService
  const provisionStatus = useProvisionStatus()

  return (
    <Button
      onClick={() => smService && configureAction.mutate(smService)}
      loading={isLoading || configureAction.isLoading}
      disabled={tabName === 'Non-configurable' || !provisionStatus}>
      Configure
    </Button>
  )
}

// TODO memoise these components  to avoid unnecessary renders
export const ObsModeActions = ({
  tabName,
  obsMode
}: ObsModeActionsProps): JSX.Element =>
  tabName === 'Running' ? (
    <RunningActions tabName={tabName} obsMode={obsMode} />
  ) : (
    <NonRunningActions tabName={tabName} obsMode={obsMode} />
  )
