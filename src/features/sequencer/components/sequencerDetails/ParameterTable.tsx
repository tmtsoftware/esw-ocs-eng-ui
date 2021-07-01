import type { Coord, CoordKey, EqCoord, Key, Parameter, TAITimeKey, UTCTimeKey } from '@tmtsoftware/esw-ts'
import { Space, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import React from 'react'
import { HeaderTitle } from '../../../../components/table/HeaderTitle'

type ParameterDataType = {
  parameter: string
  unit: string
  values: JSX.Element
}

const formatEqCoord = (value: EqCoord) => {
  return (
    <>
      {value.tag.name}: RA={value.ra.toDegree()} DEC={value.dec.toDegree()} <br />
      {value.frame.toString()}, Catalog={value.catalogName} <br />
      Proper Motion={value.pm.pmx} {value.pm.pmy}
    </>
  )
}

const formatCoord = (value: Coord) => {
  switch (value._type) {
    case 'EqCoord':
      return formatEqCoord(value)

    case 'SolarSystemCoord':
      return (
        <>
          {value.tag.name}: {value.body.toString()}
        </>
      )

    case 'AltAzCoord':
      return (
        <>
          {value.tag.name}: Alt={value.alt.toDegree()} Az={value.az.toDegree()}
        </>
      )

    case 'CometCoord':
      return (
        <>
          {value.tag.name}: Epoch of Perihelion={value.epochOfPerihelion}
          inclination={value.inclination.toDegree()} degrees <br />
          Long Ascending Node={value.longAscendingNode.toDegree()} degrees <br />
          Argument of Perihelion={value.argOfPerihelion.toDegree()} degrees <br />
          Perihelion Distance={value.perihelionDistance} AU <br />
          Eccentricity={value.eccentricity} <br />
        </>
      )

    case 'MinorPlanetCoord':
      return (
        <>
          {value.tag.name}: Epoch={value.epoch} <br />
          inclination={value.inclination.toDegree()} degrees <br />
          Long Ascending Node={value.longAscendingNode.toDegree()} degrees <br />
          Argument of Perihelion={value.argOfPerihelion.toDegree()} degrees <br />
          Mean Distance={value.meanDistance} AU <br />
          Eccentricity={value.eccentricity} <br />
          Mean Anomaly={value.meanAnomaly.toDegree()} degrees <br />
        </>
      )
  }
}

const formatParameters = (key: Key['keyTag'], values: Parameter<Key>['values']): JSX.Element => {
  switch (key) {
    case 'CoordKey':
    case 'EqCoordKey':
    case 'AltAzCoordKey':
    case 'CometCoordKey':
    case 'MinorPlanetCoordKey':
    case 'SolarSystemCoordKey':
      const coordValues = values as Parameter<CoordKey>['values']
      return (
        <Space direction='vertical'>
          {coordValues.map((coord, index) => (
            <Typography.Text key={index}>{formatCoord(coord)}</Typography.Text>
          ))}
        </Space>
      )

    case 'UTCTimeKey':
    case 'TAITimeKey':
      const timeValues = values as Parameter<UTCTimeKey | TAITimeKey>['values']
      return (
        <Space direction='vertical' size={0}>
          {timeValues.map((time, index) => (
            <Typography.Text key={index}>{time}</Typography.Text>
          ))}
        </Space>
      )

    default:
      return <Typography.Text>{values.toString()}</Typography.Text>
  }
}

const columns: ColumnsType<ParameterDataType> = [
  {
    title: <HeaderTitle title='Parameter' />,
    dataIndex: 'parameter',
    key: 'parameter',
    width: '12rem'
  },
  {
    title: <HeaderTitle title='Values' />,
    dataIndex: 'values',
    key: 'values',
    // eslint-disable-next-line react/display-name
    render: (values: string): JSX.Element => {
      return (
        <Typography.Paragraph copyable ellipsis={{ expandable: true, rows: 2, tooltip: true }}>
          {values}
        </Typography.Paragraph>
      )
    }
  },
  {
    title: <HeaderTitle title='Unit' />,
    dataIndex: 'unit',
    key: 'unit',
    width: '12rem'
  }
]

const commaSeparator = ', '

const createDataSource = (paramSet: Parameter<Key>[]): ParameterDataType[] => {
  console.log(paramSet)
  paramSet.map((param) => formatParameters(param.keyTag, param.values))
  return paramSet.map((parameter) => ({
    parameter: parameter.keyName,
    unit: parameter.units.toString(),
    values: formatParameters(parameter.keyTag, parameter.values)
  }))
}

export const ParameterTable = ({ paramSet }: { paramSet: Parameter<Key>[] }): JSX.Element => (
  <div style={{ marginTop: '0.5rem', height: '100%', overflowY: 'scroll' }}>
    <Table
      sticky
      rowKey={(row) => row.parameter}
      pagination={false}
      columns={columns}
      dataSource={createDataSource(paramSet)}
      bordered
    />
  </div>
)

// map for coord and formatter
// extract space component
// extract parameter formatter file
