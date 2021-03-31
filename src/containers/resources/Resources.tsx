import type {
  ObsMode,
  ObsModeDetails,
  ResourceStatus,
  Subsystem
} from '@tmtsoftware/esw-ts'
import { Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import React, { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import { useObsModesDetails } from '../../features/sm/hooks/useObsModesDetails'
import { headerTitle } from '../../utils/headerTitle'
import styles from './resources.module.css'

type ResourceType = 'InUse' | 'Available'
type ResourceData = {
  key: string
  resourceStatus: ResourceType
  usedBy: string | 'NA'
}

const markResourcesWith = (
  status: ResourceStatus['_type'],
  obsModeDetails: ObsModeDetails[],
  map: Map<string, ResourceData>
) => {
  obsModeDetails.forEach((obsModeDetail) =>
    obsModeDetail.resources.forEach((key) => {
      const usedBy = status === 'Available' ? 'NA' : obsModeDetail.obsMode.name
      setStatusToResourceMap(map, key, status, usedBy)
    })
  )
}

const setStatusToResourceMap = (
  map: Map<string, ResourceData>,
  key: string,
  resourceStatus: ResourceStatus['_type'],
  usedBy: string
) => {
  map.set(key, {
    key,
    resourceStatus,
    usedBy
  })
}

const getConflictingResources = (
  resources: Subsystem[],
  obsmodesDetails: ObsModeDetails[]
) => {
  return resources.reduce<[Subsystem, ObsMode][]>((list, resource) => {
    obsmodesDetails.forEach((x) => {
      if (x.resources.includes(resource)) list.push([resource, x.obsMode])
    })
    return list
  }, [])
}

const setResourcesAsAvailableIfNotExists = (
  inUseResources: [Subsystem, ObsMode][],
  currentResource: string,
  map: Map<string, ResourceData>
) => {
  inUseResources.forEach((inUseResource) => {
    if (inUseResource[0] === currentResource) {
      setStatusToResourceMap(
        map,
        currentResource,
        'InUse',
        inUseResource[1].name
      )
    } else {
      if (!map.get(currentResource)) {
        setStatusToResourceMap(map, currentResource, 'Available', 'NA')
      }
    }
  })
}

const markNonConfigurableResources = (
  nonConfigurableObsModes: ObsModeDetails[],
  runningObsModes: ObsModeDetails[],
  map: Map<string, ResourceData>
) => {
  nonConfigurableObsModes.forEach((obsModeDetail) => {
    const conflictingResources = getConflictingResources(
      obsModeDetail.resources,
      runningObsModes
    )
    // mark only conflicting resources to in use
    if (!conflictingResources.length) {
      markResourcesWith('InUse', nonConfigurableObsModes, map)
    } else {
      obsModeDetail.resources.forEach((currentResource) => {
        setResourcesAsAvailableIfNotExists(
          conflictingResources,
          currentResource,
          map
        )
      })
    }
  })
}

const updateMapWithNewData = (
  groupedData: Map<
    'Configured' | 'Configurable' | 'NonConfigurable',
    ObsModeDetails[]
  >,
  map: Map<string, ResourceData>
) => {
  const runningObsModes = groupedData.get('Configured')
  const nonConfigurableObsModes = groupedData.get('NonConfigurable')
  const ConfigurableObsModes = groupedData.get('Configurable')
  // mark all resources of configurable obsmode to Available
  ConfigurableObsModes &&
    markResourcesWith('Available', ConfigurableObsModes, map)
  // mark all resources of running obsmode to InUse
  runningObsModes && markResourcesWith('InUse', runningObsModes, map)
  // mark those resources of nonconfigurable obsmode to InUse  which  are conflicting with running, and non conflciting resources to available
  nonConfigurableObsModes &&
    runningObsModes &&
    markNonConfigurableResources(nonConfigurableObsModes, runningObsModes, map)
}

export const getStatusColumn = (status: ResourceType): JSX.Element => (
  <Typography.Text
    strong
    style={{
      color: `${
        status === 'Available' ? 'var(--purple)' : 'var(--successColor)'
      }`
    }}>
    {status}
  </Typography.Text>
)

const columns: ColumnsType<ResourceData> = [
  {
    title: headerTitle('Resources'),
    dataIndex: 'key'
  },
  {
    title: headerTitle('Status'),
    dataIndex: 'resourceStatus',
    render: (value: ResourceType) => getStatusColumn(value)
  },
  {
    title: headerTitle('Used By'),
    dataIndex: 'usedBy'
  }
]

const sortByResourceStatus = (list: ResourceData[]) =>
  list.sort((a, b) => (b.resourceStatus > a.resourceStatus ? 1 : -1))

const Resources = (): JSX.Element => {
  const { data: groupedData, isLoading } = useObsModesDetails()
  const [resourceMap, setResourceMap] = useState<Map<string, ResourceData>>(
    new Map<string, ResourceData>()
  )

  useEffect(() => {
    const map = new Map<string, ResourceData>()
    if (groupedData) {
      updateMapWithNewData(groupedData, map)
    }
    setResourceMap(map)
  }, [groupedData])

  return (
    <>
      <PageHeader onBack={() => window.history.back()} title='Resources' />
      <Table
        className={styles.resourcesCard}
        sticky
        onRow={() => ({ style: { fontSize: '1rem' } })}
        columns={columns}
        loading={isLoading}
        pagination={false}
        dataSource={sortByResourceStatus([...resourceMap.values()])}
      />
    </>
  )
}

export default Resources
