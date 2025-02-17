import { screen } from '@testing-library/react'
import {
  booleanKey,
  intArrayKey,
  intKey,
  Parameter,
  Prefix,
  Setup,
  SolarSystemCoord,
  solarSystemCoordKey,
  stringKey,
  Tag,
  Units
} from '@tmtsoftware/esw-ts'
import type { BooleanKey, IntArrayKey, IntKey, StringKey } from '@tmtsoftware/esw-ts'
import React from 'react'
import { ParameterTable } from '../../../../../src/features/sequencer/components/sequencerDetails/ParameterTable'
import { assertTableBody, assertTableHeader } from '../../../../utils/tableTestUtils'
import { renderWithAuth } from '../../../../utils/test-utils'
import '@ant-design/v5-patch-for-react-19'

describe('Parameters Table', () => {
  it('should display all the parameters in a step of a Sequence | ESW-457, ESW-503, ESW-537', async () => {
    const booleanParam: Parameter<BooleanKey> = booleanKey('flag').set([false])
    const intParam: Parameter<IntKey> = intKey('randomKey', Units.meter).set([123, 12432])
    const filterKey = intArrayKey('filter', Units.foot)
    const filterParam: Parameter<IntArrayKey> = filterKey.set([
      [1, 2, 3],
      [4, 5, 6]
    ])
    const stringParam: Parameter<StringKey> = stringKey('ra').set(['12:13:14.1'])
    const solarSystemCoord = solarSystemCoordKey('solarSystem').set([new SolarSystemCoord(new Tag('Base'), 'Jupiter')])

    const paramSet = [booleanParam, intParam, filterParam, stringParam, solarSystemCoord]
    const command = new Setup(Prefix.fromString('ESW.darknight'), 'setup', paramSet)

    renderWithAuth({ ui: <ParameterTable command={command} /> })
    const table = await screen.findByRole('table')
    const paramHeaderTable: HTMLElement =  document.querySelector(".ant-table-thead")!
    const paramBodyTable: HTMLElement =  document.querySelector(".ant-table-body")!
    assertTableHeader(paramHeaderTable, 'Parameter')
    assertTableHeader(paramHeaderTable, 'Unit')
    assertTableHeader(paramHeaderTable, 'Values')

    assertTableBody(paramBodyTable, 'flag false none')
    assertTableBody(paramBodyTable, 'randomKey 123, 12432 m')
    assertTableBody(paramBodyTable, 'filter [1,2,3], [4,5,6] ft')
    assertTableBody(paramBodyTable, 'solarSystem Base: Jupiter none')
  })
})
