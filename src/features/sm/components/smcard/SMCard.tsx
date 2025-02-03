import { Card, Typography } from 'antd'
import React from 'react'
import styles from './smcard.module.css'
import { CustomErrorBoundary } from '../../../../components/errorBoundary/CustomErrorBoundary'
import { useSMService } from '../../../../contexts/SMContext'
import { ShutdownSMButton } from '../ShutdownButton'
import { SpawnSMButton } from '../SpawnButton'

export const SMCard = (): React.JSX.Element => {
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
        styles={{header: { paddingTop: '0.5rem', paddingBottom: '0.5rem' }, body: { display: 'none' }}}
        extra={smContext ? <ShutdownSMButton /> : <SpawnSMButton />}
      />
    </CustomErrorBoundary>
  )
}

// TODO : remove error boundary to make it consistent with other actions (configure , provision)
