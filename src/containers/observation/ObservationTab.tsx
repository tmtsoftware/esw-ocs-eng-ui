import type { ObsMode, Subsystem } from '@tmtsoftware/esw-ts'
import { Button, Card, Layout, Menu, Space, Typography } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React from 'react'
import PauseButton from '../../features/sequencer/components/actions/PauseButton'
import ShutdownButton from '../../features/sequencer/components/actions/ShutdownButton'
import ResourcesTable, {
  ResourceTableStatus
} from '../../features/sequencer/components/ResourcesTable'
import { SequencersTable } from '../../features/sequencer/components/SequencersTable'
import { useConfigureAction } from '../../features/sm/hooks/useConfigureAction'
import { useRunningResources } from '../../features/sm/hooks/useObsModesDetails'
import { useProvisionStatus } from '../../features/sm/hooks/useProvisionStatus'
import { useSMService } from '../../features/sm/hooks/useSMService'
import type { ObservationTabProps, TabName } from './ObservationTabs'

const { Sider } = Layout

interface ObsModeActionsProps {
  tabName: TabName
  obsMode: ObsMode
}

const RunningActions = ({ obsMode }: { obsMode: ObsMode }) => (
  <Space>
    <PauseButton obsMode={obsMode.name} />
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
      disabled={tabName === 'Non-configurable' || !provisionStatus.data}>
      Configure
    </Button>
  )
}

// TODO: memoise these components  to avoid unnecessary renders
const ObsModeActions = ({
  tabName,
  obsMode
}: ObsModeActionsProps): JSX.Element =>
  tabName === 'Running' ? (
    <RunningActions obsMode={obsMode} />
  ) : (
    <NonRunningActions tabName={tabName} obsMode={obsMode} />
  )

const CurrentObsMode = ({
  currentTab,
  obsMode,
  sequencers,
  resources
}: {
  currentTab: TabName
  obsMode: ObsMode
  sequencers: Subsystem[]
  resources: ResourceTableStatus[]
}): JSX.Element => {
  const isRunning = () => currentTab === 'Running'

  //TODO use StatusAPI of sequencer for this status
  const getStatus = () =>
    isRunning() ? (
      <Typography.Text type='success' strong>
        Running
      </Typography.Text>
    ) : (
      <Typography.Text strong type='secondary'>
        NA
      </Typography.Text>
    )

  return (
    <>
      <Card
        title={
          <>
            <Typography.Title level={4}>{obsMode.name}</Typography.Title>
            <Space>
              <Typography.Text type='secondary'>Status: </Typography.Text>
              {getStatus()}
            </Space>
          </>
        }
        extra={
          <Space style={{ paddingRight: '2.5rem' }}>
            <ObsModeActions tabName={currentTab} obsMode={obsMode} />
          </Space>
        }>
        {isRunning() && (
          <SequencersTable obsMode={obsMode} sequencers={sequencers} />
        )}
        <ResourcesTable resources={resources} />
      </Card>
    </>
  )
}

const getTabBasedResources = (
  currentTab: TabName,
  resources: Subsystem[],
  runningResources: Subsystem[]
): ResourceTableStatus[] => {
  switch (currentTab) {
    case 'Running':
      return resources.map((resource) => ({ key: resource, status: 'InUse' }))
    case 'Configurable':
      return resources.map((resource) => ({
        key: resource,
        status: 'Available'
      }))
    case 'Non-configurable':
      return resources.map((resource) => ({
        key: resource,
        status: runningResources.includes(resource) ? 'InUse' : 'Available'
      }))
  }
}

const ObservationTab = ({
  data,
  currentTab,
  selected,
  setObservation
}: ObservationTabProps): JSX.Element => {
  const selectedObs = data[selected] ?? data[0]
  const runningResources = useRunningResources()
  return (
    <Layout style={{ height: '99%' }}>
      <Sider theme='light' style={{ overflowY: 'scroll' }} width={'13rem'}>
        <Menu
          selectedKeys={selectedObs && [selectedObs.obsMode.name]}
          style={{ paddingTop: '0.4rem' }}>
          {data.map((item, index) => (
            <Menu.Item
              onClick={() => setObservation(index)}
              key={item.obsMode.name}>
              {item.obsMode.name}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Content>
        {selectedObs && (
          <CurrentObsMode
            obsMode={selectedObs.obsMode}
            sequencers={selectedObs.sequencers}
            currentTab={currentTab}
            resources={getTabBasedResources(
              currentTab,
              selectedObs.resources,
              runningResources
            )}
          />
        )}
      </Content>
    </Layout>
  )
}

export default ObservationTab
