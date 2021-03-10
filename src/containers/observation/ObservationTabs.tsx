import type { ObsModeDetails } from '@tmtsoftware/esw-ts'
import { Button, Card, Empty, Layout, Menu, Space, Tabs } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React, { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import { groupBy } from '../../config/AppConfig'
import { useObsModesDetails } from '../../features/sm/hooks/useObsModesDetails'
import type { ObsModesDataType } from './Observations'
import ObservationTab from './ObservationTab'
const { TabPane } = Tabs

export const TabStatusMap: Record<string, ObsModeDetails['status']['_type']> = {
  Running: 'Configured',
  'Non-configurable': 'NonConfigurable',
  Configurable: 'Configurable'
}

const ObservationTabs = (): JSX.Element => {
  const [selectedTab, setSelectedTab] = useState<string>()
  const { data } = useObsModesDetails()
  const grouped = data && groupBy(data.obsModes, (x) => x.status._type)

  const getObservationTabs = ({ keyName, data }: ObsModesDataType) => {
    if (!data)
      return (
        <Empty
          description={`No ${keyName} ObsModes`}
          style={{ minHeight: '80vh' }}
        />
      )
    return <ObservationTab data={data} currentTab={keyName} />
  }

  return (
    <Card
      bodyStyle={{ display: 'none' }}
      title={
        <Tabs
          activeKey={selectedTab}
          onTabClick={(key: string) => setSelectedTab(key)}
          tabBarStyle={{ marginBottom: '1em' }}>
          {Object.keys(TabStatusMap).map((tabName) => {
            return (
              <TabPane key={tabName} tab={tabName}>
                {getObservationTabs({
                  keyName: tabName,
                  data: grouped?.get(TabStatusMap[tabName])
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
