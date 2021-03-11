import type { ObsModeDetails, ObsModeStatus } from '@tmtsoftware/esw-ts'
import { Card, Empty, Tabs } from 'antd'
import React, { useState } from 'react'
import { groupBy } from '../../config/AppConfig'
import { useObsModesDetails } from '../../features/sm/hooks/useObsModesDetails'
import ObservationTab from './ObservationTab'
const { TabPane } = Tabs

type ObsModesDataType = {
  keyName: TabName
  data?: ObsModeDetails[]
}

export type TabName = 'Running' | 'Configurable' | 'Non-configurable'

export const TabStatusMap: Array<[TabName, ObsModeStatus['_type']]> = [
  ['Running', 'Configured'],
  ['Non-configurable', 'NonConfigurable'],
  ['Configurable', 'Configurable']
]

const ObservationTabs = (): JSX.Element => {
  const [selectedTab, setSelectedTab] = useState<string>()
  const { data } = useObsModesDetails()
  const grouped = data && groupBy(data.obsModes, (x) => x.status._type)

  const getObservationTab = ({ keyName, data }: ObsModesDataType) =>
    data ? (
      <ObservationTab data={data} currentTab={keyName} />
    ) : (
      <Empty
        description={`No ${keyName} ObsModes`}
        style={{ minHeight: '80vh' }}
      />
    )

  return (
    <Card
      bodyStyle={{ display: 'none' }}
      title={
        <Tabs
          activeKey={selectedTab}
          onTabClick={(key: string) => setSelectedTab(key)}
          tabBarStyle={{ marginBottom: '1em' }}>
          {TabStatusMap.map(([tabName, tabValue]) => {
            return (
              <TabPane key={tabName} tab={tabName}>
                {getObservationTab({
                  keyName: tabName,
                  data: grouped?.get(tabValue)
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
