import { Empty, Menu, Modal, Typography } from 'antd'
import type { ModalProps } from 'antd'
import type { SelectInfo } from 'rc-menu/lib/interface'
import React from 'react'
import styles from './selectionModal.module.css'

interface SelectionModalProps extends ModalProps {
  selectedItem: string
  data: string[] | undefined
  onChange: (value: string) => void
}

const getList = (selectedItem: string, data: string[] | undefined, onChange: (value: string) => void) => {
  const onSelect = (e: SelectInfo) => onChange(e.key)
  if (data === undefined || data.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  }

  const items = data.map((item) => {
    return {
      className: styles.menuItem + ` ${item === selectedItem ? styles.selectedItem : ''}`,
      style: { paddingLeft: '1.5rem', marginTop: 0, marginBottom: 0 },
      key: item,
      label: item
    }
  })

  return <Menu selectable onSelect={onSelect} selectedKeys={[selectedItem]} className={styles.menu} items={items} />
}
export const SelectionModal = ({
  selectedItem,
  data,
  title,
  okText,
  open,
  confirmLoading,
  onOk,
  onCancel,
  onChange
}: SelectionModalProps): React.JSX.Element => (
  <Modal
    title={
      <Typography.Title level={5} style={{ marginBottom: 0 }}>
        {title}
      </Typography.Title>
    }
    okText={okText}
    centered
    open={open}
    confirmLoading={confirmLoading}
    styles={{body: { padding: 0 }}}
    okButtonProps={{
      disabled: !selectedItem || !data || data.length === 0
    }}
    onOk={onOk}
    onCancel={onCancel}>
    {getList(selectedItem, data, onChange)}
  </Modal>
)
