import type {
  CometCoord,
  Coord,
  CoordKey,
  EqCoord,
  Key,
  MinorPlanetCoord,
  Parameter,
  TAITimeKey,
  UTCTimeKey
} from '@tmtsoftware/esw-ts'
import { Space, Typography } from 'antd'
import React from 'react'

const FormattedEqCoord = ({ value }: { value: EqCoord }) => (
  <>
    {value.tag.name}: RA={value.ra.toDegree()} DEC={value.dec.toDegree()} <br />
    {value.frame.toString()}, Catalog={value.catalogName} <br />
    Proper Motion={value.pm.pmx} {value.pm.pmy}
  </>
)

const FormattedCometCoord = ({ value }: { value: CometCoord }) => (
  <>
    {value.tag.name}: Epoch of Perihelion={value.epochOfPerihelion}
    inclination={value.inclination.toDegree()} degrees <br />
    Long Ascending Node={value.longAscendingNode.toDegree()} degrees <br />
    Argument of Perihelion={value.argOfPerihelion.toDegree()} degrees <br />
    Perihelion Distance={value.perihelionDistance} AU <br />
    Eccentricity={value.eccentricity} <br />
  </>
)

const FormattedMinorPlanetCoord = ({ value }: { value: MinorPlanetCoord }) => (
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

const formatCoord = (value: Coord) => {
  switch (value._type) {
    case 'EqCoord':
      return <FormattedEqCoord value={value} />

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
      return <FormattedCometCoord value={value} />

    case 'MinorPlanetCoord':
      return <FormattedMinorPlanetCoord value={value} />
  }
}

export const formatParameters = (key: Key['keyTag'], values: Parameter<Key>['values']): JSX.Element => {
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
      return <Typography.Text>{values.map((value) => JSON.stringify(value)).join(', ')}</Typography.Text>
  }
}
