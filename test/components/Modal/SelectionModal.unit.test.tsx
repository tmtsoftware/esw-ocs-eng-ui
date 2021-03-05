import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect } from 'chai'
import React from 'react'
import { SelectionModal } from '../../../src/components/Modal/SelectionModal'

describe('SelectionModal', () => {
  it('should render modal with title and given list of data | ESW-441', async () => {
    const modalProps = {
      data: ['data-1', 'data-2'],
      title: 'some-title',
      okText: 'Start',
      onChange: () => true,
      selectedItem: '',
      visible: true
    }
    const { getByText, getByRole } = render(<SelectionModal {...modalProps} />)

    const title = getByText(/some-title/i)
    const data1 = getByRole('menuitem', {
      name: 'data-1'
    })
    const data2 = getByRole('menuitem', {
      name: 'data-2'
    })

    expect(title).to.exist
    expect(data1.innerText).eq('data-1')
    expect(data2.innerText).eq('data-2')
  })

  it('should call onChange method when menu item is selected | ESW-441', () => {
    let value = ''
    const modalProps = {
      data: ['data-1', 'data-2'],
      title: 'some-title',
      okText: 'Start',
      onChange: (selectedKey: string) => (value = selectedKey),
      selectedItem: '',
      visible: true
    }
    const { getByRole } = render(<SelectionModal {...modalProps} />)

    const data1 = getByRole('menuitem', {
      name: 'data-1'
    })

    userEvent.click(data1)

    expect(value).eq('data-1')
  })

  it('should handle onOk and onCancel event | ESW-441', () => {
    let value = ''
    const modalProps = {
      data: ['data-1'],
      title: 'some-title',
      okText: 'Start',
      onChange: () => true,
      onOk: () => (value = 'Ok'),
      onCancel: () => (value = 'canceled'),
      selectedItem: 'data-1',
      visible: true
    }
    const { getByRole } = render(<SelectionModal {...modalProps} />)

    const okButton = getByRole('button', { name: /start/i })
    const cancelButton = getByRole('button', { name: /cancel/i })

    userEvent.click(okButton)
    expect(value).eq('Ok')

    userEvent.click(cancelButton)
    expect(value).eq('canceled')
  })

  it('should not call onOk if any item is not selected | ESW-441', () => {
    let value = 'value not changed'
    const modalProps = {
      data: ['data-1'],
      title: 'some-title',
      okText: 'Start',
      onChange: () => true,
      onOk: () => (value = 'Ok'),
      onCancel: () => (value = 'canceled'),
      selectedItem: '',
      visible: true
    }
    const { getByRole } = render(<SelectionModal {...modalProps} />)

    const okButton = getByRole('button', { name: /start/i })

    userEvent.click(okButton)
    expect(value).eq('value not changed')
  })

  it('should not show menu if visible equals false | ESW-441', () => {
    const modalProps = {
      data: [],
      title: 'some-title',
      okText: 'Start',
      onChange: () => true,
      onOk: () => true,
      onCancel: () => true,
      selectedItem: '',
      visible: false
    }

    const { queryByText } = render(<SelectionModal {...modalProps} />)
    expect(queryByText(/some-title/i)).to.null
  })

  it('should show empty if data is not present | ESW-441', () => {
    const modalProps = {
      data: [],
      title: 'some-title',
      okText: 'Start',
      onChange: () => true,
      onOk: () => true,
      onCancel: () => true,
      selectedItem: '',
      visible: true
    }

    const { queryByRole, getByText } = render(
      <SelectionModal {...modalProps} />
    )

    expect(getByText(/No Data/i)).to.exist
    expect(queryByRole('menuitem')).to.null
    expect(
      (queryByRole('button', { name: 'Start' }) as HTMLButtonElement).disabled
    ).to.true
  })
})
