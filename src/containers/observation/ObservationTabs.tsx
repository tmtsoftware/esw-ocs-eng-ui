import type { ObsModeDetails, ObsModeStatus } from '@tmtsoftware/esw-ts'
import { Empty, Tabs } from 'antd'
import React, { useState } from 'react'
import { groupBy } from '../../features/common/groupBy'
import { useObsModesDetails } from '../../features/sm/hooks/useObsModesDetails'
import ObservationTab from './ObservationTab'
const { TabPane } = Tabs

export type ObservationTab = {
  keyName: TabName
  data?: ObsModeDetails[]
}

export type TabName = 'Running' | 'Configurable' | 'Non-configurable'

export const tabNames: Array<[TabName, ObsModeStatus['_type']]> = [
  ['Running', 'Configured'],
  ['Non-configurable', 'NonConfigurable'],
  ['Configurable', 'Configurable']
]

const ObservationTabs = (): JSX.Element => {
  const [selectedTab, setSelectedTab] = useState<string>()
  const { data } = useObsModesDetails()
  const grouped = data && groupBy(data.obsModes, (x) => x.status._type)

  const getObservationTab = ({ keyName, data }: ObservationTab) =>
    data ? (
      <ObservationTab data={data} currentTab={keyName} />
    ) : (
      <Empty
        description={`No ${keyName} ObsModes`}
        style={{ minHeight: '80vh' }}
      />
    )

  return (
    <Tabs
      activeKey={selectedTab}
      onTabClick={(key: string) => setSelectedTab(key)}
      tabBarStyle={{
        backgroundColor: 'white',
        paddingLeft: '1.5rem',
        marginBottom: '1.5rem'
      }}>
      {tabNames.map(([tabName, tabValue]) => {
        return (
          <TabPane
            key={tabName}
            tab={tabName}
            style={{ marginLeft: '1.5rem', width: '99%' }}>
            {getObservationTab({
              keyName: tabName,
              data: grouped?.get(tabValue)
            })}
          </TabPane>
        )
      })}
    </Tabs>
  )
}

export default ObservationTabs
