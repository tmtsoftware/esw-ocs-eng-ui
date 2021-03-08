import { Card, PageHeader, Space, Typography } from 'antd'
import React from 'react'
import AgentCards from '../../features/agent/components/AgentCards'
import { useSMStatus } from '../../features/sm/hooks/useSMStatus'
import styles from './infrastructure.module.css'
import SmActions from './SMActions'

const { Meta } = Card

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
        title={<SmStatusCard />}
        bodyStyle={{ display: 'none' }}
        extra={<SmActions />}
      />
      <AgentCards />
    </>
  )
}

const SmStatus = (): JSX.Element => {
  const { data, isLoading } = useSMStatus()
  if (isLoading) {
    return <Typography.Text type='warning'>Loading...</Typography.Text>
  }
  const smStatus = data?.metadata ? (
    <Typography.Text type='success'>
      Running on {data.metadata.agentPrefix || 'unknown'}
    </Typography.Text>
  ) : (
    <Typography.Text type='danger'>Service down</Typography.Text>
  )
  return smStatus
}

const SmStatusCard = (): JSX.Element => {
  return (
    <Space direction='vertical' size={3}>
      <Typography.Text className={styles.pageTitle}>
        Sequence Manager
      </Typography.Text>
      <Meta
        description={
          <>
            <Typography.Text type='secondary'>{' Status: '}</Typography.Text>
            <SmStatus />
          </>
        }
      />
    </Space>
  )
}

export default Infrastructure
