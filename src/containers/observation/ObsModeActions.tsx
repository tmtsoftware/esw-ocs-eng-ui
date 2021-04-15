import type { ObsMode } from '@tmtsoftware/esw-ts'
import { Button } from 'antd'
import React from 'react'
import { ShutdownButton } from '../../features/sequencer/components/actions/ShutdownButton'
import { useConfigureAction } from '../../features/sm/hooks/useConfigureAction'
import { useProvisionStatus } from '../../features/sm/hooks/useProvisionStatus'
import { useSMService } from '../../features/sm/hooks/useSMService'
import type { TabName } from './ObservationTabs'

type ObsModeActionsProps = {
  tabName: TabName
  obsMode: ObsMode
}

const RunningActions = ({ obsMode }: ObsModeActionsProps) => (
  <ShutdownButton obsMode={obsMode} />
)

const NonRunningActions = ({ tabName, obsMode }: ObsModeActionsProps) => {
  const configureAction = useConfigureAction(obsMode)
  const smService = useSMService(false)
  const provisionStatus = useProvisionStatus(false)

  return (
    <Button
      onClick={() => smService.data && configureAction.mutate(smService.data)}
      loading={configureAction.isLoading}
      disabled={tabName === 'Non-configurable' || !provisionStatus.data}>
      Configure
    </Button>
  )
}

// TODO: memoise these components  to avoid unnecessary renders
export const ObsModeActions = ({
  tabName,
  obsMode
}: ObsModeActionsProps): JSX.Element =>
  tabName === 'Running' ? (
    <RunningActions tabName={tabName} obsMode={obsMode} />
  ) : (
    <NonRunningActions tabName={tabName} obsMode={obsMode} />
  )
