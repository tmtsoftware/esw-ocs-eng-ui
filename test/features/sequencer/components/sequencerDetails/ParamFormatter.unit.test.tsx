import { render, screen } from '@testing-library/react'
import {
  AltAzCoord,
  altAzCoordKey,
  CometCoord,
  cometCoordKey,
  EqCoord,
  eqCoordKey,
  IntKey,
  intKey,
  Key,
  MinorPlanetCoord,
  minorPlanetCoordKey,
  Parameter,
  Prefix,
  SequenceCommand,
  Setup,
  SolarSystemCoord,
  solarSystemCoordKey,
  Tag,
  taiTimeKey,
  utcTimeKey,
  Angle
} from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { formatParameters } from '../../../../../src/features/sequencer/components/sequencerDetails/ParamFormatter'
describe('Parameter Formatter', () => {
  // construct coord parameters
  const eqCoord = eqCoordKey('eq').set([
    new EqCoord(new Tag('Base'), new Angle(12341), new Angle(12341), 'ICRS', 'cat123', {
      pmx: 123,
      pmy: 123414
    })
  ])
  const cometCoord = cometCoordKey('comet').set([
    new CometCoord(new Tag('Base'), 11, new Angle(12341), new Angle(12341), new Angle(12341), 200, 0.4)
  ])
  const minorCoord = minorPlanetCoordKey('minorPlanet').set([
    new MinorPlanetCoord(
      new Tag('Base'),
      2,
      new Angle(12341),
      new Angle(12341),
      new Angle(12341),
      2,
      2,
      new Angle(12341)
    )
  ])
  const solarSystemCoord = solarSystemCoordKey('solarSystem').set([new SolarSystemCoord(new Tag('Base'), 'Jupiter')])
  const altAzCoord = altAzCoordKey('altAz').set([new AltAzCoord(new Tag('Base'), new Angle(12341), new Angle(12341))])
  // construct time parameters
  const utcTime = utcTimeKey('utcTime').set(['1970-01-01T00:00:00Z'])
  const taiTime = taiTimeKey('taiTime').set(['2017-09-04T19:00:00.123456789Z'])

  // construct a parameter which has no custom formatting
  const intParam: Parameter<IntKey> = intKey('randomKey').set([123, 12432])

  // create commands for corresponding parameters
  const setupWithEqCoord = new Setup(Prefix.fromString('ESW.iris_darknight'), 'eqCoord', [eqCoord])
  const setupWithCometCoord = new Setup(Prefix.fromString('ESW.iris_darknight'), 'cometCoord', [cometCoord])
  const setupWithMinorPlanetCoord = new Setup(Prefix.fromString('ESW.iris_darknight'), 'minorPlanetCoord', [minorCoord])
  const setupWithSolarSystemCoord = new Setup(Prefix.fromString('ESW.iris_darknight'), 'solarSystemCoord', [
    solarSystemCoord
  ])
  const setupWithAltAzCoord = new Setup(Prefix.fromString('ESW.iris_darknight'), 'altAzCoord', [altAzCoord])
  const setupWithUtcTimeKey = new Setup(Prefix.fromString('ESW.iris_darknight'), 'utcTime', [utcTime])
  const setupWithTaiTimeKey = new Setup(Prefix.fromString('ESW.iris_darknight'), 'taiTime', [taiTime])
  const setupWithIntKey = new Setup(Prefix.fromString('ESW.iris_darknight'), 'intKey', [intParam])

  //expectations
  const formattedEqCoord = `Base: RA=12341 DEC=12341\nICRS, Catalog="cat123"\nProper Motion=123, 123414`
  const formattedCometCoord = `Base: Epoch of Perihelion=11\ninclination=0.0000034280555555555554 degrees\nLong Ascending Node=0.0000034280555555555554 degrees\nArgument of Perihelion=0.0000034280555555555554 degrees\nPerihelion Distance=200 AU\nEccentricity=0.4\n`
  const formattedMinorCoord = `Base: Epoch=2\ninclination=0.0000034280555555555554 degrees\nLong Ascending Node=0.0000034280555555555554 degrees\nArgument of Perihelion=0.0000034280555555555554 degrees\nMean Distance=2 AU\nEccentricity=2\nMean Anomaly=0.0000034280555555555554 degrees\n`
  const formattedSolarSystemCoord = `Base: Jupiter`
  const formattedAltAzCoord = `Base: Alt=0.0000034280555555555554 Az=0.0000034280555555555554`
  const formattedUtcTime = '1970-01-01T00:00:00Z'
  const formattedTaiTime = '2017-09-04T19:00:00.123456789Z'
  const formattedIntValue = '123, 12432'

  const testCases: [Parameter<Key>, SequenceCommand, string][] = [
    [eqCoord, setupWithEqCoord, formattedEqCoord],
    [cometCoord, setupWithCometCoord, formattedCometCoord],
    [minorCoord, setupWithMinorPlanetCoord, formattedMinorCoord],
    [solarSystemCoord, setupWithSolarSystemCoord, formattedSolarSystemCoord],
    [altAzCoord, setupWithAltAzCoord, formattedAltAzCoord],
    [utcTime, setupWithUtcTimeKey, formattedUtcTime],
    [taiTime, setupWithTaiTimeKey, formattedTaiTime],
    [intParam, setupWithIntKey, formattedIntValue]
  ]

  testCases.forEach(([parameter, command, formattedParam]) => {
    it(`should format ${parameter.keyTag} | ESW-503`, () => {
      render(<>{formatParameters(parameter, command)}</>)

      const element = screen.getByRole(parameter.keyTag)

      expect(element.innerText).equal(formattedParam)
    })
  })
})
