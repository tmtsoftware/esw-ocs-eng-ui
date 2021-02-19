import { Button, Card, PageHeader, Typography, Space } from 'antd'
import React from 'react'
import styles from './infrastructure.module.css'
import { useSMStatus } from '../../features/sm/hooks/useSMStatus'
const { Meta } = Card

const SmActions = (): JSX.Element => (
  <Space>
    <Button type='primary' size='middle'>
      Provision
    </Button>
    <Button disabled size='middle'>
      Configure
    </Button>
  </Space>
)

const SmStatus = (): JSX.Element => {
  const { data } = useSMStatus()
  const smStatus = data?.metadata.agentPrefix
    ? `Running on ${data.metadata.agentPrefix}`
    : 'Service Down'
  return (
    <Space direction='vertical' size={3}>
      <Typography.Text className={styles.pageTitle}>
        Sequence Manager
      </Typography.Text>
      <Meta
        description={
          <>
            <Typography.Text type='secondary'>{' Status: '}</Typography.Text>
            <Typography.Text type='success'> {smStatus}</Typography.Text>
          </>
        }
      />
    </Space>
  )
}

const Infrastructure = (): JSX.Element => {
  return (
    <>
      <PageHeader
        className={styles.pageHeader}
        onBack={() => window.history.back()}
        title='Manage Infrastructure'
      />
      <Card
        size='default'
        title={<SmStatus />}
        bodyStyle={{ display: 'none' }}
        extra={<SmActions />}
      />
    </>
  )
}

export default Infrastructure
