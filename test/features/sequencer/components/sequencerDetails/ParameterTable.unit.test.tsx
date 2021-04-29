import { screen } from '@testing-library/react'
import {
  booleanKey,
  BooleanKey,
  IntArrayKey,
  intArrayKey,
  intKey,
  IntKey,
  Parameter,
  stringKey,
  StringKey
} from '@tmtsoftware/esw-ts'
import React from 'react'
import { ParameterTable } from '../../../../../src/features/sequencer/components/sequencerDetails/ParameterTable'
import {
  assertTableBody,
  assertTableHeader
} from '../../../../utils/tableTestUtils'
import { renderWithAuth } from '../../../../utils/test-utils'

describe('Parameters Table', () => {
  it('should display all the parameters in a step of a Sequence | ESW-457', async () => {
    const booleanParam: Parameter<BooleanKey> = booleanKey('flag').set([false])
    const intParam: Parameter<IntKey> = intKey('randomKey').set([123, 12432])
    const filterKey = intArrayKey('filter')
    const filterParam: Parameter<IntArrayKey> = filterKey.set([
      [1, 2, 3],
      [4, 5, 6]
    ])
    const stringParam: Parameter<StringKey> = stringKey('ra').set([
      '12:13:14.1'
    ])

    const paramSet = [booleanParam, intParam, filterParam, stringParam]
    renderWithAuth({ ui: <ParameterTable paramSet={paramSet} /> })
    await screen.findByRole('table')
    const [paramHeaderTable, paramBodyTable] = screen.queryAllByRole('table')
    assertTableHeader(paramHeaderTable, 'Parameter')
    assertTableHeader(paramHeaderTable, 'Unit')
    assertTableHeader(paramHeaderTable, 'Values')

    assertTableBody(paramBodyTable, 'flag [false] copy NoUnits')
    assertTableBody(paramBodyTable, 'randomKey [123,12432] copy NoUnits')
    assertTableBody(paramBodyTable, 'filter [[1,2,3],[4,5,6]] copy NoUnits')
  })
})
