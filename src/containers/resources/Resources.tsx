import type {
  ObsModeDetails,
  ObsModesDetailsResponseSuccess
} from '@tmtsoftware/esw-ts'
import { Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import React, { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import { useObsModesDetails } from '../../features/sm/hooks/useObsModesDetails'
import styles from './resources.module.css'

type ResourceType = 'InUse' | 'Available'
type ResourceData = {
  key: string
  resourceStatus: ResourceType
  usedBy: string[]
}

const updateMapWithNewData = (
  data: ObsModesDetailsResponseSuccess,
  map: Map<string, ResourceData>
) => {
  data.obsModes.forEach((obsModes) => {
    if (obsModes.status._type === 'Configured') {
      setInUseResources(obsModes, map)
    } else {
      setAvailableResources(obsModes, map)
    }
  })
}

const setInUseResources = (
  obsModeDetails: ObsModeDetails,
  map: Map<string, ResourceData>
) => {
  obsModeDetails.resources.forEach((key) =>
    map.set(key, {
      key,
      resourceStatus: 'InUse',
      usedBy: [obsModeDetails.obsMode.name]
    })
  )
}

const setAvailableResources = (
  obsModeDetails: ObsModeDetails,
  map: Map<string, ResourceData>
) => {
  obsModeDetails.resources.forEach((key) => {
    if (map.has(key) && !!map.get(key)) {
      const value = map.get(key)
      if (!!value && value.resourceStatus !== 'InUse') {
        map.set(key, {
          ...value,
          usedBy: [...value.usedBy, obsModeDetails.obsMode.name]
        })
      }
    } else
      map.set(key, {
        key,
        resourceStatus: 'Available',
        usedBy: [obsModeDetails.obsMode.name]
      })
  })
}

const getStatusColumn = (status: ResourceType) => (
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
    title: 'Resources',
    dataIndex: 'key'
  },
  {
    title: 'Status',
    dataIndex: 'resourceStatus',
    render: (value: ResourceType) => getStatusColumn(value)
  },
  {
    title: 'Used By',
    dataIndex: 'usedBy',
    render: (value: string[]) => value.join(', ')
  }
]

const sortByResourceStatus = (list: ResourceData[]) =>
  list.sort((a, b) => (b.resourceStatus > a.resourceStatus ? 1 : -1))

const Resources = (): JSX.Element => {
  const { data, isLoading } = useObsModesDetails()
  const [resourceMap, setResourceMap] = useState<Map<string, ResourceData>>(
    new Map<string, ResourceData>()
  )

  useEffect(() => {
    const map = new Map<string, ResourceData>()
    if (data) {
      updateMapWithNewData(data, map)
    }
    setResourceMap(map)
  }, [data])

  return (
    <>
      <PageHeader onBack={() => window.history.back()} title='Resources' />
      <Table
        className={styles.resourcesCard}
        sticky
        onHeaderRow={() => ({ style: { fontSize: '1rem' } })}
        columns={columns}
        loading={isLoading}
        pagination={false}
        dataSource={sortByResourceStatus([...resourceMap.values()])}
      />
    </>
  )
}

export default Resources
