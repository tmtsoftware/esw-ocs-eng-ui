import type { Subsystem } from '@tmtsoftware/esw-ts'
import { Button, Layout, Menu, Space } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React from 'react'
import PauseButton from '../../features/sequencer/components/actions/PauseButton'
import ShutdownButton from '../../features/sequencer/components/actions/ShutdownButton'
import type { ResourceTableStatus } from '../../features/sequencer/components/ResourcesTable'
import { useConfigureAction } from '../../features/sm/hooks/useConfigureAction'
import { useRunningResources } from '../../features/sm/hooks/useObsModesDetails'
import { useProvisionStatus } from '../../features/sm/hooks/useProvisionStatus'
import { useSMService } from '../../features/sm/hooks/useSMService'
import CurrentObsMode from './CurrentObsMode'
import type { ObservationTabProps, TabName } from './ObservationTabs'

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

const ObservationTab = ({
  data,
  currentTab,
  selected,
  setObservation
}: ObservationTabProps): JSX.Element => {
  const selectedObs = data[selected] ?? data[0]
  const runningResources = useRunningResources()
  return (
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
            currentTab={currentTab}
            resources={getTabBasedResources(
              currentTab,
              selectedObs.resources,
              runningResources
            )}
          />
        )}
      </Content>
    </Layout>
  )
}

export default ObservationTab
