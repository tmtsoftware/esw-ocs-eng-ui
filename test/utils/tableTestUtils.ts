import { screen, within } from '@testing-library/react'
import { expect } from 'chai'

export const assertTableHeader = (
  tableElement: HTMLElement,
  columnName: string | RegExp
) => {
  within(tableElement).getByRole('columnheader', { name: columnName })
}

export const assertTableHeaderNotPresent = (columnName: string) => {
  expect(getHeader(columnName)).to.null
}

const getHeader = (colName: string) =>
  screen.queryByRole('columnheader', {
    name: colName
  })
