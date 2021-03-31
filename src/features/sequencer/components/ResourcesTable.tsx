import type { ResourceStatus } from '@tmtsoftware/esw-ts'
import { Table } from 'antd'
import React from 'react'
import { getStatusColumn } from '../../../containers/resources/Resources'
import { headerTitle } from '../../../utils/headerTitle'

export type ResourceTableStatus = {
  key: string
  status: ResourceStatus['_type']
}

type ResourcesTableProps = {
  resources: ResourceTableStatus[]
}

const columns = [
  {
    title: headerTitle('Resources Required'),
    dataIndex: 'key',
    width: '40%'
  },
  {
    title: headerTitle('Status'),
    dataIndex: 'status',
    render: (status: ResourceStatus['_type']) => getStatusColumn(status)
  }
]

const ResourcesTable = ({ resources }: ResourcesTableProps): JSX.Element => {
  return (
    <Table
      onRow={() => ({ style: { fontSize: '1rem' } })}
      pagination={false}
      columns={columns}
      dataSource={resources}
    />
  )
}

export default ResourcesTable
