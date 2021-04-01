import type { Subsystem } from '@tmtsoftware/esw-ts'
import { Empty, Layout, Menu } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React from 'react'
import type { ResourceTableStatus } from '../../features/sequencer/components/ResourcesTable'
import {
  useObsModesDetails,
  useRunningResources
} from '../../features/sm/hooks/useObsModesDetails'
import CurrentObsMode from './CurrentObsMode'
import type { TabName } from './ObservationTabs'

const { Sider } = Layout

const getTabBasedResources = (
  currentTab: TabName,
  resources: Subsystem[],
  runningResources: Subsystem[]
): ResourceTableStatus[] => {
  switch (currentTab) {
    case 'Running':
      return resources.map((resource) => ({ key: resource, status: 'InUse' }))
    case 'Configurable':
      return resources.map((resource) => ({
        key: resource,
        status: 'Available'
      }))
    case 'Non-configurable':
      return resources.map((resource) => ({
        key: resource,
        status: runningResources.includes(resource) ? 'InUse' : 'Available'
      }))
  }
}

const tabMap: Record<
  TabName,
  'Configured' | 'Configurable' | 'NonConfigurable'
> = {
  Running: 'Configured',
  Configurable: 'Configurable',
  'Non-configurable': 'NonConfigurable'
}

export type ObservationTabProps = {
  tabName: TabName
  currentTab: TabName
  selected: number
  setObservation: (_: number) => void
}

const ObservationTab = ({
  tabName,
  currentTab,
  selected,
  setObservation
}: ObservationTabProps): JSX.Element => {
  const { data: grouped } = useObsModesDetails()
  const runningResources = useRunningResources()

  const data = grouped ? grouped[tabMap[tabName]] : []
  const selectedObs = data[selected] ?? data[0]

  if (!data.length) return <Empty description={`No ${tabName} ObsModes`} />

  const resources = getTabBasedResources(
    currentTab,
    selectedObs.resources,
    runningResources
  )

  return (
    !!data && (
      <Layout style={{ height: '99%' }}>
        <Sider theme='light' style={{ overflowY: 'scroll' }} width={'13rem'}>
          <Menu
            selectedKeys={selectedObs && [selectedObs.obsMode.name]}
            style={{ paddingTop: '0.4rem' }}>
            {data.map((item, index) => (
              <Menu.Item
                onClick={() => setObservation(index)}
                key={item.obsMode.name}>
                {item.obsMode.name}
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Content>
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
  )
}

export default ObservationTab
