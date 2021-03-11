import type { ObsModeDetails } from '@tmtsoftware/esw-ts'
import { Button, Layout, Menu, Space } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React, { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import PauseButton from '../../features/sequencer/components/editorActions/PauseButton'
import ShutdownButton from '../../features/sequencer/components/editorActions/ShutdownButton'
import { useConfigureAction } from '../../features/sm/hooks/useConfigureAction'
import { useSMService } from '../../features/sm/hooks/useSMService'
import type { TabName } from './ObservationTabs'

const { Sider } = Layout

const ObsModeActions = ({
  currentTab,
  currentObsMode
}: {
  currentTab: TabName
  currentObsMode: ObsModeDetails
}): JSX.Element => {
  const configureAction = useConfigureAction(currentObsMode.obsMode)
  const smService = useSMService(false)

  if (currentTab === 'Running') {
    return (
      <Space>
        <PauseButton obsMode={currentObsMode.obsMode.name} />
        <ShutdownButton obsMode={currentObsMode.obsMode} />
      </Space>
    )
  }

  return (
    <Button
      onClick={() => smService.data && configureAction.mutate(smService.data)}
      disabled={currentTab === 'Non-configurable'}>
      Configure
    </Button>
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
  const [currentObsMode, setCurrentObsMode] = useState<ObsModeDetails>()

  useEffect(() => {
    const defaultObsModeForTab = data[0]
    setCurrentObsMode(defaultObsModeForTab)
    // intentionally kept dependency array empty as we don't want to override user's selected obsMode
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout>
      <Sider theme='light' style={{ minHeight: '80vh', paddingTop: '1rem' }}>
        <Menu selectedKeys={[currentObsMode?.obsMode.toJSON() || '']}>
          {data.map((item) => {
            return (
              <Menu.Item
                onClick={() => setCurrentObsMode(item)}
                key={item.obsMode.toJSON()}>
                {item.obsMode.toJSON()}
              </Menu.Item>
            )
          })}
        </Menu>
      </Sider>
      <Content>
        {currentObsMode && (
          <PageHeader
            extra={
              <Space style={{ paddingRight: '2.5rem' }}>
                <ObsModeActions
                  currentTab={currentTab}
                  currentObsMode={currentObsMode}
                />
              </Space>
            }
            title={currentObsMode.obsMode.toJSON()}
          />
        )}
      </Content>
    </Layout>
  )
}

export default ObservationTab
