import type { ObsModeDetails } from '@tmtsoftware/esw-ts'
import { Button, Card, Empty, Layout, Menu, Space, Tabs } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React, { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import { groupBy } from '../../config/AppConfig'
import { useObsModesDetails } from '../../features/sm/hooks/useObsModesDetails'
import type { ObsModesDataType } from './Observations'
const { TabPane } = Tabs
const { Sider } = Layout

const ObservationTabs = (): JSX.Element => {
  const [currentObsMode, setCurrentObsMode] = useState<ObsModeDetails>()
  const [selectedTab, setSelectedTab] = useState<string>()
  const { data } = useObsModesDetails()
  const grouped = data && groupBy(data.obsModes, (x) => x.status._type)

  const handleSelectItem = (obsMode: ObsModeDetails) => {
    setCurrentObsMode(obsMode)
  }

  const getObservationTabs = ({ keyName, data }: ObsModesDataType) => {
    if (!data)
      return (
        <Empty
          description={`No ${keyName} ObsModes`}
          style={{ minHeight: '80vh' }}
        />
      )
    return (
      <Layout>
        <Sider theme='light' style={{ minHeight: '80vh', paddingTop: '1rem' }}>
          <Menu selectedKeys={[currentObsMode?.obsMode.toJSON() || '']}>
            {data.map((item) => {
              return (
                <Menu.Item
                  onClick={() => {
                    handleSelectItem(item)
                    setSelectedTab(keyName)
                  }}
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
                  {keyName === 'Configurable' && <Button>Configure</Button>}
                  {keyName === 'Non-configurable' && (
                    <Button disabled>Configure</Button>
                  )}
                  {keyName === 'Running' && (
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

  const dd: Record<string, ObsModeDetails['status']['_type']> = {
    Running: 'Configured',
    'Non-configurable': 'NonConfigurable',
    Configurable: 'Configurable'
  }

  useEffect(() => {
    const defaultObsModeForTab = grouped?.get('Configured')?.[0]
    setCurrentObsMode(defaultObsModeForTab)
    console.log('here')
  }, [])

  return (
    <Card
      bodyStyle={{ display: 'none' }}
      title={
        <Tabs
          activeKey={selectedTab}
          onTabClick={(key: string) => {
            setSelectedTab(key)
            const defaultObsModeForTab = grouped?.get(
              dd[key] as ObsModeDetails['status']['_type']
            )?.[0]
            setCurrentObsMode(defaultObsModeForTab)
          }}
          tabBarStyle={{ marginBottom: '1em' }}>
          {Object.keys(dd).map((tabName) => {
            return (
              <TabPane key={tabName} tab={tabName}>
                {getObservationTabs({
                  keyName: tabName,
                  data: grouped?.get(dd[tabName])
                })}
              </TabPane>
            )
          })}
        </Tabs>
      }
    />
  )
}

export default ObservationTabs
