import { Card, Typography } from 'antd'
import React from 'react'
import { CustomErrorBoundary } from '../../../../components/ErrorBoundary/CustomErrorBoundary'
import { useSMContext } from '../../hooks/useSMContext'
import { useSMStatus } from '../../hooks/useSMStatus'
import { ShutdownSMButton } from '../shutdown/ShutdownButton'
import { SpawnSMButton } from '../spawn/SpawnButton'
import styles from './smcard.module.css'

export const SMCard = (): JSX.Element => {
  const [smLocation] = useSMContext()
  return (
    <CustomErrorBoundary>
      <Card
        title={
          <Typography.Title level={4} className={styles.title}>
            Sequence Manager
          </Typography.Title>
        }
        headStyle={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
        extra={smLocation ? <ShutdownSMButton /> : <SpawnSMButton />}
        bodyStyle={{ display: 'none' }}
      />
    </CustomErrorBoundary>
  )
}
