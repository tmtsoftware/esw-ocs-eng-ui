import type { SequenceCommand } from '@tmtsoftware/esw-ts'
import { Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import React from 'react'
import { formatParameters } from './ParamFormatter'
import { HeaderTitle } from '../../../../components/table/HeaderTitle'

type ParameterDataType = {
  parameter: string
  unit: string
  values: React.JSX.Element
}

const columns: ColumnsType<ParameterDataType> = [
  {
    title: <HeaderTitle title='Parameter' />,
    dataIndex: 'parameter',
    key: 'parameter',
    width: '12rem',
    sortDirections: [],
    defaultSortOrder: 'ascend',
    sorter: (a, b) => a.parameter.localeCompare(b.parameter)
  },
  {
    title: <HeaderTitle title='Values' />,
    dataIndex: 'values',
    key: 'values',
    render: (values: string): React.JSX.Element => (
      <Typography.Paragraph ellipsis={{ expandable: true, rows: 20, tooltip: true }}>{values}</Typography.Paragraph>
    )
  },
  {
    title: <HeaderTitle title='Unit' />,
    dataIndex: 'unit',
    key: 'unit',
    width: '12rem'
  }
]

const createDataSource = (command: SequenceCommand): ParameterDataType[] => {
  return command.paramSet.map((parameter) => ({
    parameter: parameter.keyName,
    unit: parameter.units.name,
    values: formatParameters(parameter, command)
  }))
}

export const ParameterTable = ({ command }: { command: SequenceCommand }): React.JSX.Element => (
  <div style={{ marginTop: '0.5rem', height: '100%', overflowY: 'scroll' }}>
    <Table
      sticky
      rowKey={(row) => row.parameter}
      pagination={false}
      columns={columns}
      dataSource={createDataSource(command)}
      bordered
    />
  </div>
)
