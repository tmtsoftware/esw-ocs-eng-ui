import { Tabs } from 'antd'
import React, { useState } from 'react'
import styles from './observationsTabs.module.css'
import { ObservationTab } from './ObservationTab'
const { TabPane } = Tabs

export const tabNames = ['Running', 'Configurable', 'Non-configurable'] as const

export type TabName = typeof tabNames[number]

export const ObservationTabs = (): JSX.Element => {
  const [selectedTab, setSelectedTab] = useState<TabName>('Running')
  const [selectedObservation, setSelectedObservation] = useState<string>('')

  return (
    <Tabs
      activeKey={selectedTab}
      onTabClick={(key: string) => {
        setSelectedTab(key as TabName)
        selectedTab !== key && setSelectedObservation('')
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
            {selectedTab === tabName && (
              <ObservationTab
                tabName={tabName}
                selected={selectedObservation}
                setObservation={setSelectedObservation}
              />
            )}
          </TabPane>
        )
      })}
    </Tabs>
  )
}
