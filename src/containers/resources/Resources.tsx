import type { ObsModeDetails, Subsystem } from '@tmtsoftware/esw-ts'
import { Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import { HeaderTitle } from '../../components/Table/HeaderTitle'
import {
  GroupedObsModeDetails,
  useObsModesDetails
} from '../../features/sm/hooks/useObsModesDetails'
import styles from './resources.module.css'

type ResourceType = 'InUse' | 'Available'

type ResourceData = {
  key: string
  status: ResourceType
  usedBy: string
}

const byStatus = (fst: ResourceData, snd: ResourceData) =>
  snd.status > fst.status ? 1 : -1

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
  const availableResources = getResources(groupedObsModes.Configurable)
  const availableResourceData: ResourceData[] = availableResources.map(
    (resource) => mkResourceData(resource, 'Available', 'NA')
  )

  const inUseResources = [
    ...new Set(
      groupedObsModes.Configured.flatMap((om) => {
        return om.resources.map<[string, Subsystem]>((resource) => {
          return [om.obsMode.name, resource]
        })
      })
    )
  ]

  const inUseResourceData: ResourceData[] = inUseResources.map(
    ([obsModeName, resource]) => mkResourceData(resource, 'InUse', obsModeName)
  )

  const nonConfigurableResources = getResources(groupedObsModes.NonConfigurable)
  const nonConfigurableResourceData: ResourceData[] = nonConfigurableResources.flatMap(
    (resource) => {
      const found = inUseResourceData.find((data) => data.key === resource)
      return found ? [] : [mkResourceData(resource, 'Available', 'NA')]
    }
  )

  return [
    ...inUseResourceData,
    ...availableResourceData,
    ...nonConfigurableResourceData
  ].sort(byStatus)
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
    title: <HeaderTitle title='Resource' />,
    dataIndex: 'key'
  },
  {
    title: <HeaderTitle title='Status' />,
    dataIndex: 'status',
    render: (value: ResourceType) => getStatusColumn(value)
  },
  {
    title: <HeaderTitle title='Used By' />,
    dataIndex: 'usedBy'
  }
]

export const Resources = (): JSX.Element => {
  const { data: groupedObsModes, isLoading } = useObsModesDetails()
  const [resourceData, setResourceData] = useState<ResourceData[]>([])
  const history = useHistory()

  useEffect(() => {
    groupedObsModes && setResourceData(groupByResourceStatus(groupedObsModes))
  }, [groupedObsModes])

  return (
    <>
      <PageHeader onBack={() => history.goBack()} title='Resources' />
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
