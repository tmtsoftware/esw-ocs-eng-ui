import type { ObsMode, ObsModeDetails, Subsystem } from '@tmtsoftware/esw-ts'
import { Button, Drawer, Layout, Menu, Space } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React, { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import PauseButton from '../../features/sequencer/components/actions/PauseButton'
import ShutdownButton from '../../features/sequencer/components/actions/ShutdownButton'
import SequencerDetails from '../../features/sequencer/components/SequencerDetails'
import { useConfigureAction } from '../../features/sm/hooks/useConfigureAction'
import { useProvisionStatus } from '../../features/sm/hooks/useProvisionStatus'
import { useSMService } from '../../features/sm/hooks/useSMService'
import type { TabName } from './ObservationTabs'
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
      <SequencersTable obsMode={obsMode} sequencers={sequencers} />
    </>
  )
}

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

  const [isVisible, setVisible] = useState(false)
  // const [selectedSequencer, selectSequencer] = useState<HttpLocation>()

  useEffect(() => {
    setSelectedObsModeDetails(data[0])
  }, [data])

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
          <CurrentObsMode
            obsMode={selectedObsModeDetails.obsMode}
            sequencers={selectedObsModeDetails.sequencers}
            currentTab={currentTab}
          />
        )}
        <Button onClick={() => setVisible(true)}>Open</Button>
      </Content>
      <Drawer
        visible={isVisible}
        width={'80%'}
        onClose={() => setVisible(false)}>
        {
          // TODO : Update hardcoded values with selected sequencer once ESW-451 is done
        }
        <SequencerDetails
          sequencer='IRIS.IRIS_Darknight'
          agentPrefix='IRIS.machine1'
        />
      </Drawer>
    </Layout>
  )
}

export default ObservationTab
