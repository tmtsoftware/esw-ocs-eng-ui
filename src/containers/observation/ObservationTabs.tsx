import { Tabs } from 'antd'
import React, { useState } from 'react'
import styles from './observationsTabs.module.css'
import ObservationTab from './ObservationTab'
const { TabPane } = Tabs

export type TabName = 'Running' | 'Configurable' | 'Non-configurable'

export const tabNames: TabName[] = [
  'Running',
  'Configurable',
  'Non-configurable'
]

const ObservationTabs = (): JSX.Element => {
  const [selectedTab, setSelectedTab] = useState<TabName>('Running')
  const [selectedObservation, setSelectedObservation] = useState(0)

  return (
    <Tabs
      activeKey={selectedTab}
      onTabClick={(key: string) => {
        setSelectedTab(key as TabName)
        selectedTab !== key && setSelectedObservation(0)
      }}
      className={styles.tabs}
      size={'large'}
      tabBarStyle={{
        backgroundColor: 'white',
        paddingLeft: '1.5rem',
        marginBottom: '1.5rem'
      }}>
      {tabNames.map((tabName) => {
        return (
          <TabPane
            key={tabName}
            tab={tabName}
            style={{ marginLeft: '1.5rem', width: '99%' }}>
            <ObservationTab
              tabName={tabName}
              currentTab={selectedTab}
              selected={selectedObservation}
              setObservation={(number) => setSelectedObservation(number)}
            />
          </TabPane>
        )
      })}
    </Tabs>
  )
}

export default ObservationTabs
