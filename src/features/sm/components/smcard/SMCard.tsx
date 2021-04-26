import { Card, Typography } from 'antd'
import React from 'react'
import { CustomErrorBoundary } from '../../../../components/errorBoundary/CustomErrorBoundary'
import { useSMService } from '../../../../contexts/SMContext'
import { ShutdownSMButton } from '../ShutdownButton'
import { SpawnSMButton } from '../SpawnButton'
import styles from './smcard.module.css'

export const SMCard = (): JSX.Element => {
  const [smContext, isLoading] = useSMService()

  return (
    <CustomErrorBoundary>
      <Card
        loading={isLoading}
        title={
          <Typography.Title level={4} className={styles.title}>
            Sequence Manager
          </Typography.Title>
        }
        headStyle={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
        extra={smContext ? <ShutdownSMButton /> : <SpawnSMButton />}
        bodyStyle={{ display: 'none' }}
      />
    </CustomErrorBoundary>
  )
}

// TODO : remove error boundary to make it consistent with other actions (configure , provision)
