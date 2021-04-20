import type { Subsystem } from '@tmtsoftware/esw-ts'
import { Empty, Layout, Menu } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React, { useMemo } from 'react'
import type { ResourceTableStatus } from '../../features/sequencer/components/ResourcesTable'
import {
  useObsModesDetails,
  useRunningResources
} from '../../features/sm/hooks/useObsModesDetails'
import { CurrentObsMode } from './CurrentObsMode'
import type { TabName } from './ObservationTabs'

const { Sider } = Layout

const getTabBasedResources = (
  currentTab: TabName,
  resources: Subsystem[],
  runningResources: Subsystem[]
): ResourceTableStatus[] => {
  if (currentTab === 'Non-configurable') {
    return resources.map((resource) => ({
      key: resource,
      status: runningResources.includes(resource) ? 'InUse' : 'Available'
    }))
  }

  return resources.map((resource) => ({
    key: resource,
    status: currentTab === 'Configurable' ? 'Available' : 'InUse'
  }))
}

export type ObservationTabProps = {
  tabName: TabName
  currentTab: TabName
  selected?: string
  setObservation: (_: string) => void
}

export const ObservationTab = ({
  tabName,
  currentTab,
  selected = '',
  setObservation
}: ObservationTabProps): JSX.Element => {
  const { data: grouped } = useObsModesDetails()
  const runningResources = useRunningResources()

  const data = grouped ? grouped[tabName] : []
  const selectedObs = data.find((x) => x.obsMode.name === selected) ?? data[0]

  const resources = useMemo(
    () =>
      data.length > 0
        ? getTabBasedResources(
            currentTab,
            selectedObs.resources,
            runningResources
          )
        : [],
    [currentTab, data.length, runningResources, selectedObs]
  )

  if (!data.length) return <Empty description={`No ${tabName} ObsModes`} />

  return (
    <Layout style={{ height: '99%' }}>
      <Sider theme='light' style={{ overflowY: 'scroll' }} width={'13rem'}>
        <Menu
          selectedKeys={selectedObs && [selectedObs.obsMode.name]}
          style={{ paddingTop: '0.4rem' }}>
          {data.map((item) => (
            <Menu.Item
              onClick={() => setObservation(item.obsMode.name)}
              key={item.obsMode.name}>
              {item.obsMode.name}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Content style={{ marginRight: '2rem' }}>
        {selectedObs && (
          <CurrentObsMode
            obsMode={selectedObs.obsMode}
            sequencers={selectedObs.sequencers}
            resources={resources}
            currentTab={currentTab}
          />
        )}
      </Content>
    </Layout>
  )
}
