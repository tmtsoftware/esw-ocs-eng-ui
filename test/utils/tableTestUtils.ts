import { screen, within } from '@testing-library/react'
import { expect } from 'chai'

export const assertTableHeader = (tableElement: HTMLElement, columnName: string | RegExp): void => {
  within(tableElement).getByRole('columnheader', { name: columnName })
}

export const assertTableHeader2 = (tableElement: HTMLElement, columnName: string | RegExp): void => {
  tableElement.querySelector(".ant-table-column-title")!.firstChild!.textContent == columnName
}

export const assertTableBody = (tableElement: HTMLElement, rowValue: string | RegExp): void => {
  within(tableElement).getByRole('row', { name: rowValue })
}

export const assertTableHeaderNotPresent = (columnName: string): void => {
  expect(getHeader(columnName)).to.null
}

const getHeader = (colName: string) =>
  screen.queryByRole('columnheader', {
    name: colName
  })
