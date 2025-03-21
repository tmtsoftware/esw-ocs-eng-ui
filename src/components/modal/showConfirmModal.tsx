import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import React from 'react'
import '@ant-design/v5-patch-for-react-19'

export const showConfirmModal = (onYes: () => void, title: string, okText: string): void => {
  Modal.confirm({
    title,
    icon: <ExclamationCircleOutlined />,
    centered: true,
    okText,
    okButtonProps: {
      danger: true,
      type: 'primary'
    },
    closable: true,
    maskClosable: true,
    cancelText: 'Cancel',
    onOk: () => onYes()
  })
}
