import type { ObsModeDetails } from '@tmtsoftware/esw-ts'
import { Button, Layout, Menu, Space } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React, { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import type { TabStatusMap } from './ObservationTabs'

const { Sider } = Layout

const ObservationTab = ({
  data,
  currentTab
}: {
  data: ObsModeDetails[]
  currentTab: keyof typeof TabStatusMap
}): JSX.Element => {
  const [currentObsMode, setCurrentObsMode] = useState<ObsModeDetails>()

  useEffect(() => {
    const defaultObsModeForTab = data[0]
    setCurrentObsMode(defaultObsModeForTab)
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
                {currentTab === 'Configurable' && <Button>Configure</Button>}
                {currentTab === 'Non-configurable' && (
                  <Button disabled>Configure</Button>
                )}
                {currentTab === 'Running' && (
                  <>
                    <Button>Pause</Button>
                    <Button>Shutdown</Button>
                  </>
                )}
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
