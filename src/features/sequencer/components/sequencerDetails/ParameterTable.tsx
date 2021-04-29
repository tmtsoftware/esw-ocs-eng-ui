import type { Key, Parameter } from '@tmtsoftware/esw-ts'
import { Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import React from 'react'
import { HeaderTitle } from '../../../../components/table/HeaderTitle'

type ParameterDataType = {
  parameter: string
  unit: string
  values: string
}

const columns: ColumnsType<ParameterDataType> = [
  {
    title: <HeaderTitle title='Parameter' />,
    dataIndex: 'parameter',
    key: 'parameter'
  },
  {
    title: <HeaderTitle title='Values' />,
    dataIndex: 'values',
    key: 'values',
    // eslint-disable-next-line react/display-name
    render: (values: string): JSX.Element => {
      return (
        <Typography.Paragraph
          copyable
          ellipsis={{ expandable: true, rows: 2, tooltip: true }}>
          {values}
        </Typography.Paragraph>
      )
    }
  },
  {
    title: <HeaderTitle title='Unit' />,
    dataIndex: 'unit',
    key: 'unit'
  }
]

const commaSeparator = ', '

const createDataSource = (paramSet: Parameter<Key>[]): ParameterDataType[] =>
  paramSet.map((parameter) => {
    return {
      parameter: parameter.keyName.toString(),
      unit: parameter.units.toString(),
      values: parameter.values
        .map((v) => JSON.stringify(v))
        .join(commaSeparator)
    }
  })

export const ParameterTable = ({
  paramSet
}: {
  paramSet: Parameter<Key>[]
}): JSX.Element => (
  <div style={{ height: '100%', overflowY: 'scroll' }}>
    <Table
      sticky
      rowKey={(row) => row.parameter}
      pagination={false}
      columns={columns}
      dataSource={createDataSource(paramSet)}
    />
  </div>
)
