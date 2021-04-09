import { Typography } from 'antd'
import React from 'react'

export const HeaderTitle = ({ title }: { title: string }): JSX.Element => (
  <Typography.Title level={5} style={{ marginBottom: 0 }}>
    {title}
  </Typography.Title>
)
