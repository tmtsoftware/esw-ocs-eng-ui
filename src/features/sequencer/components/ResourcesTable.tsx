import type { ResourceStatus } from '@tmtsoftware/esw-ts'
import { Table } from 'antd'
import React from 'react'
import { HeaderTitle } from '../../../components/Table/HeaderTitle'
import { getStatusColumn } from '../../../containers/resources/Resources'

export type ResourceTableStatus = {
  key: string
  status: ResourceStatus['_type']
}

type ResourcesTableProps = {
  resources: ResourceTableStatus[]
}

const columns = [
  {
    title: <HeaderTitle title='Resource Required' />,
    dataIndex: 'key',
    width: '40%'
  },
  {
    title: <HeaderTitle title='Status' />,
    dataIndex: 'status',
    render: (status: ResourceStatus['_type']) => getStatusColumn(status)
  }
]

export const ResourcesTable = ({
  resources
}: ResourcesTableProps): JSX.Element => {
  return (
    <Table
      onRow={() => ({ style: { fontSize: '1rem' } })}
      pagination={false}
      columns={columns}
      dataSource={resources}
    />
  )
}
