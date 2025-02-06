import { Tabs } from 'antd'
import type { TabsProps } from 'antd';
import React, { useState } from 'react'
import styles from './observationsTabs.module.css'
import { ObservationTab } from './ObservationTab'

export const tabNames = ['Running', 'Configurable', 'Non-configurable'] as const

export type TabName = (typeof tabNames)[number]

export const ObservationTabs = (): React.JSX.Element => {
  const [selectedTab, setSelectedTab] = useState<TabName>('Running')
  const items: TabsProps['items'] = tabNames.map((tabName) => {
    return {
      key: tabName,
      label: tabName,
      style: { marginLeft: '1.5rem', width: '99%' },
      children: selectedTab === tabName && <ObservationTab tabName={tabName} />
    }
  })
  return (
    <Tabs
      activeKey={selectedTab}
      onTabClick={(key: string) => setSelectedTab(key as TabName)}
      className={styles.tabs}
      size='large'
      items={items}
      tabBarStyle={{
        backgroundColor: 'white',
        paddingLeft: '1.5rem',
        marginBottom: '1.5rem'
      }}></Tabs>
  )
}
