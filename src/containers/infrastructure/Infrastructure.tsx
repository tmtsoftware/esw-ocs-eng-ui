import { Card, Space, Typography } from 'antd'
import type { BaseType } from 'antd/lib/typography/Base'
import React from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import styles from '../../components/PageHeader/pageHeader.module.css'
import AgentCards from '../../features/agent/components/AgentCards'
import { useSMStatus } from '../../features/sm/hooks/useSMStatus'
import SmActions from './SMActions'

const { Meta } = Card

const Infrastructure = (): JSX.Element => {
  return (
    <>
      <PageHeader
        onBack={() => window.history.back()}
        title='Manage Infrastructure'
      />
      <Card
        title={<SmStatusCard />}
        bodyStyle={{ display: 'none' }}
        extra={<SmActions />}
      />
      <AgentCards />
    </>
  )
}

const SMStatus = (): JSX.Element => {
  const { data, isLoading } = useSMStatus()
  const [txtType, text]: [BaseType, string] = isLoading
    ? ['warning', 'Loading...']
    : data?.metadata
    ? ['success', `Running on ${data.metadata.agentPrefix || 'unknown'}`]
    : ['danger', 'Service down']

  return <Typography.Text type={txtType}>{text}</Typography.Text>
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
            <SMStatus />
          </>
        }
      />
    </Space>
  )
}

export default Infrastructure
