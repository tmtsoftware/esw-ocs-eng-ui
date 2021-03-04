import { Card, Typography } from 'antd'
import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { QueryErrorResetBoundary } from 'react-query'
import { ErrorFallback } from '../../../../components/ErrorBoundary/ErrorFallback'
import CustomErrorBoundary from '../../../../components/ErrorBoundary/CustomErrorBoundary'
import { useSMStatus } from '../../hooks/useSMStatus'
import { ShutdownSMButton } from '../shutdown/ShutdownButton'
import { SpawnSMButton } from '../spawn/SpawnButton'
import styles from './smcard.module.css'

const SMCard = (): JSX.Element => {
  const smStatus = useSMStatus()
  return (
    <CustomErrorBoundary>
      <Card
        size='default'
        title={
          <Typography.Title level={4} className={styles.title}>
            Sequence Manager
          </Typography.Title>
        }
        headStyle={{ paddingTop: '8px', paddingBottom: '8px' }}
        extra={smStatus.data ? <ShutdownSMButton /> : <SpawnSMButton />}
        bodyStyle={{ display: 'none' }}
      />
    </CustomErrorBoundary>
  )
}

export default SMCard
