import type { ObsModeDetails } from '@tmtsoftware/esw-ts'
import { Button, Layout, Menu, Space } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React, { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import type { TabName } from './ObservationTabs'

const { Sider } = Layout

const ObsModeActions = ({
  currentTab
}: {
  currentTab: TabName
}): JSX.Element => {
  if (currentTab === 'Running') {
    return (
      <Space>
        <Button>Pause</Button>
        <Button>Shutdown</Button>
      </Space>
    )
  }

  return <Button disabled={currentTab === 'Non-configurable'}>Configure</Button>
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
              <Space>
                <ObsModeActions currentTab={currentTab} />
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
