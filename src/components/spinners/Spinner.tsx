import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import React from 'react'

const antIcon = <LoadingOutlined style={{ color: '#08c' }} spin />

export const Spinner = (): React.JSX.Element => <Spin indicator={antIcon} />
