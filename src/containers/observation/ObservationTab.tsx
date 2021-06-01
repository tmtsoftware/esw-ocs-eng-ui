import type { Subsystem } from '@tmtsoftware/esw-ts'
import { Empty, Layout, Menu } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React from 'react'
import type { ResourceTableStatus } from '../../features/sequencer/components/ResourcesTable'
import { useObsModesDetails } from '../../features/sm/hooks/useObsModesDetails'
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
  selected?: string
  setObservation: (_: string) => void
}

export const ObservationTab = ({ tabName, selected = '', setObservation }: ObservationTabProps): JSX.Element => {
  const { data: allObsModesGrouped } = useObsModesDetails()
  const thisTabObsModes = allObsModesGrouped ? allObsModesGrouped[tabName] : []
  if (!thisTabObsModes.length) return <Empty description={`No ${tabName} ObsModes`} />

  const runningResources = [
    ...new Set(allObsModesGrouped && allObsModesGrouped.Running.flatMap((obsMode) => obsMode.resources))
  ]
  const selectedObs = thisTabObsModes.find((x) => x.obsMode.name === selected) ?? thisTabObsModes[0]
  const resources = getTabBasedResources(tabName, selectedObs.resources, runningResources)

  return (
    <Layout style={{ height: '99%' }}>
      <Sider theme='light' style={{ overflowY: 'scroll' }} width={'13rem'}>
        <Menu mode='inline' selectedKeys={selectedObs && [selectedObs.obsMode.name]} style={{ paddingTop: '0.4rem' }}>
          {thisTabObsModes.map((item) => (
            <Menu.Item onClick={() => setObservation(item.obsMode.name)} key={item.obsMode.name}>
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
            currentTab={tabName}
          />
        )}
      </Content>
    </Layout>
  )
}
