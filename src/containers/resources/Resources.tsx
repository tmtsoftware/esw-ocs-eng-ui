import type { ObsModeDetails, Subsystem } from '@tmtsoftware/esw-ts'
import { Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import React, { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import {
  GroupedObsModeDetails,
  useObsModesDetails
} from '../../features/sm/hooks/useObsModesDetails'
import { headerTitle } from '../../utils/headerTitle'
import styles from './resources.module.css'

type ResourceType = 'InUse' | 'Available'

type ResourceData = {
  key: string
  status: ResourceType
  usedBy: string
}

const mkResourceData = (
  key: string,
  status: ResourceType,
  usedBy: string
): ResourceData => ({ key, status, usedBy })

const getResources = (details: ObsModeDetails[]) => [
  ...new Set(details.flatMap((om) => om.resources))
]

const groupByResourceStatus = (
  groupedObsModes: GroupedObsModeDetails
): ResourceData[] => {
  const runningObsModes = groupedObsModes.get('Configured') || []
  const nonConfigurableObsModes = groupedObsModes.get('NonConfigurable') || []
  const configurableObsModes = groupedObsModes.get('Configurable') || []

  const availableResources = getResources(configurableObsModes)
  const availableResourceData: ResourceData[] = availableResources.map(
    (resource) => mkResourceData(resource, 'Available', 'NA')
  )

  const inUseResources = [
    ...new Set(
      runningObsModes.flatMap((om) => {
        return om.resources.map<[string, Subsystem]>((resource) => {
          return [om.obsMode.name, resource]
        })
      })
    )
  ]

  const inUseResourceData: ResourceData[] = inUseResources.map(
    ([obsModeName, resource]) => mkResourceData(resource, 'InUse', obsModeName)
  )

  const nonConfigurableResources = getResources(nonConfigurableObsModes)
  const nonConfigurableResourceData: ResourceData[] = nonConfigurableResources.flatMap(
    (resource) => {
      const found = inUseResourceData.find((data) => data.key === resource)
      return found ? [] : [mkResourceData(resource, 'Available', 'NA')]
    }
  )

  const byStatus = (fst: ResourceData, snd: ResourceData) =>
    snd.status > fst.status ? 1 : -1

  return [
    ...new Set(
      [
        ...inUseResourceData,
        ...availableResourceData,
        ...nonConfigurableResourceData
      ].sort(byStatus)
    )
  ]
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
    dataIndex: 'status',
    render: (value: ResourceType) => getStatusColumn(value)
  },
  {
    title: headerTitle('Used By'),
    dataIndex: 'usedBy'
  }
]

const Resources = (): JSX.Element => {
  const { data: groupedObsModes, isLoading } = useObsModesDetails()
  const [resourceData, setResourceData] = useState<ResourceData[]>([])

  useEffect(() => {
    groupedObsModes && setResourceData(groupByResourceStatus(groupedObsModes))
  }, [groupedObsModes])

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
        dataSource={resourceData}
      />
    </>
  )
}

export default Resources
