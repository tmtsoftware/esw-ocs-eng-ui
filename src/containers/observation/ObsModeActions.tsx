import type { ObsMode } from '@tmtsoftware/esw-ts'
import { Space, Button } from 'antd'
import React from 'react'
import { PauseButton } from '../../features/sequencer/components/actions/PauseButton'
import { ResumeButton } from '../../features/sequencer/components/actions/ResumeButton'
import { ShutdownButton } from '../../features/sequencer/components/actions/ShutdownButton'
import type { RunningObsModeStatus } from '../../features/sequencer/hooks/useObsModeStatus'
import { useConfigureAction } from '../../features/sm/hooks/useConfigureAction'
import { useProvisionStatus } from '../../features/sm/hooks/useProvisionStatus'
import { useSMService } from '../../features/sm/hooks/useSMService'
import type { TabName } from './ObservationTabs'

type ObsModeActionsProps = {
  tabName: TabName
  obsMode: ObsMode
  obsModeStatus?: RunningObsModeStatus
}

const RunningActions = ({ obsMode, obsModeStatus }: ObsModeActionsProps) => (
  <Space>
    {obsModeStatus && obsModeStatus === 'Paused' ? (
      <ResumeButton obsMode={obsMode} />
    ) : (
      <PauseButton obsMode={obsMode} />
    )}

    <ShutdownButton obsMode={obsMode} />
  </Space>
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
  obsMode,
  obsModeStatus
}: ObsModeActionsProps): JSX.Element =>
  tabName === 'Running' ? (
    <RunningActions
      tabName={tabName}
      obsMode={obsMode}
      obsModeStatus={obsModeStatus}
    />
  ) : (
    <NonRunningActions tabName={tabName} obsMode={obsMode} />
  )
