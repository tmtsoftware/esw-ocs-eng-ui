import type { ObsMode, Subsystem } from '@tmtsoftware/esw-ts'
import { Button, Layout, Menu, Space } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import PauseButton from '../../features/sequencer/components/actions/PauseButton'
import ShutdownButton from '../../features/sequencer/components/actions/ShutdownButton'
import { useConfigureAction } from '../../features/sm/hooks/useConfigureAction'
import { useProvisionStatus } from '../../features/sm/hooks/useProvisionStatus'
import { useSMService } from '../../features/sm/hooks/useSMService'
import type { ObservationTabProps, TabName } from './ObservationTabs'
import { SequencersTable } from './SequencersTable'

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
  sequencers
}: {
  currentTab: TabName
  obsMode: ObsMode
  sequencers: Subsystem[]
}): JSX.Element => {
  return (
    <>
      <PageHeader
        extra={
          <Space style={{ paddingRight: '2.5rem' }}>
            <ObsModeActions tabName={currentTab} obsMode={obsMode} />
          </Space>
        }
        title={obsMode.name}
      />
      {currentTab === 'Running' && (
        <SequencersTable obsMode={obsMode} sequencers={sequencers} />
      )}
    </>
  )
}

const ObservationTab = ({
  data,
  currentTab,
  selected,
  setObservation
}: ObservationTabProps): JSX.Element => (
  <Layout>
    <Sider
      theme='light'
      style={{ height: '80vh', overflowY: 'scroll' }}
      width={'13rem'}>
      <Menu
        selectedKeys={data[selected] && [data[selected].obsMode.name]}
        style={{ paddingTop: '1rem' }}>
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
      {data[selected] && (
        <CurrentObsMode
          obsMode={data[selected].obsMode}
          sequencers={data[selected].sequencers}
          currentTab={currentTab}
        />
      )}
    </Content>
  </Layout>
)

export default ObservationTab
