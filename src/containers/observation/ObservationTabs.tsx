import type {
  ObsModeDetails,
  ObsModeStatus,
  Subsystem
} from '@tmtsoftware/esw-ts'
import { Empty, Tabs } from 'antd'
import React, { useState } from 'react'
import { useObsModesDetails } from '../../features/sm/hooks/useObsModesDetails'
import { groupBy } from '../../utils/groupBy'
import styles from './observationsTabs.module.css'
import ObservationTab from './ObservationTab'
const { TabPane } = Tabs

export type ObservationTabProps = {
  currentTab: TabName
  data: ObsModeDetails[]
  selected: number
  setObservation: (_: number) => void
}

export type TabName = 'Running' | 'Configurable' | 'Non-configurable'

export const tabNames: Array<[TabName, ObsModeStatus['_type']]> = [
  ['Running', 'Configured'],
  ['Configurable', 'Configurable'],
  ['Non-configurable', 'NonConfigurable']
]

const ObservationTabs = (): JSX.Element => {
  const [selectedTab, setSelectedTab] = useState<string>()
  const [selectedObservation, setSelectedObservation] = useState(0)

  const { data: grouped } = useObsModesDetails()

  const getObservationTab = ({
    currentTab,
    data,
    selected,
    setObservation
  }: ObservationTabProps) =>
    data.length > 0 ? (
      <ObservationTab
        data={data}
        currentTab={currentTab}
        selected={selected}
        setObservation={setObservation}
      />
    ) : (
      <Empty description={`No ${currentTab} ObsModes`} />
    )

  return (
    <Tabs
      activeKey={selectedTab}
      onTabClick={(key: string) => {
        setSelectedTab(key)
        selectedTab !== key && setSelectedObservation(0)
      }}
      className={styles.tabs}
      size={'large'}
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
              currentTab: tabName,
              data: grouped?.get(tabValue) || [],
              selected: selectedObservation,
              setObservation: (number) => setSelectedObservation(number)
            })}
          </TabPane>
        )
      })}
    </Tabs>
  )
}

export default ObservationTabs
