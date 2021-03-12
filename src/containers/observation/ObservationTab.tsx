import type { ObsMode, ObsModeDetails } from '@tmtsoftware/esw-ts'
import { Button, Layout, Menu, Space } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React, { useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import PauseButton from '../../features/sequencer/components/actions/PauseButton'
import ShutdownButton from '../../features/sequencer/components/actions/ShutdownButton'
import { useConfigureAction } from '../../features/sm/hooks/useConfigureAction'
import { useSMService } from '../../features/sm/hooks/useSMService'
import type { TabName } from './ObservationTabs'

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

  return (
    <Button
      onClick={() => smService.data && configureAction.mutate(smService.data)}
      disabled={tabName === 'Non-configurable'}>
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

interface ObservationTabProps {
  data: ObsModeDetails[]
  currentTab: TabName
}

const ObservationTab = ({
  data,
  currentTab
}: ObservationTabProps): JSX.Element => {
  const [selectedObsModeDetails, setSelectedObsModeDetails] = useState<
    ObsModeDetails | undefined
  >(data[0])

  return (
    <Layout>
      <Sider theme='light' style={{ minHeight: '80vh', paddingTop: '1rem' }}>
        <Menu
          selectedKeys={
            selectedObsModeDetails && [selectedObsModeDetails.obsMode.name]
          }>
          {data.map((item) => (
            <Menu.Item
              onClick={() => setSelectedObsModeDetails(item)}
              key={item.obsMode.name}>
              {item.obsMode.name}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Content>
        {selectedObsModeDetails && (
          <PageHeader
            extra={
              <Space style={{ paddingRight: '2.5rem' }}>
                <ObsModeActions
                  tabName={currentTab}
                  obsMode={selectedObsModeDetails.obsMode}
                />
              </Space>
            }
            title={selectedObsModeDetails.obsMode.name}
          />
        )}
      </Content>
    </Layout>
  )
}

export default ObservationTab
