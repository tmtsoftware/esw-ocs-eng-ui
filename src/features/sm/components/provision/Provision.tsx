import { Button, message } from 'antd'
import React from 'react'
import { FallbackProps, withErrorBoundary } from 'react-error-boundary'
import { ProvisionButton } from './ProvisionButton'
import { UnProvisionButton } from './UnProvisionButton'
import { useProvisionStatus } from './useProvisionStatus'

const Provision = (): JSX.Element => {
  const provisionStatus = useProvisionStatus()
  return provisionStatus.data ? <UnProvisionButton /> : <ProvisionButton />
}

export function ProvisionErrorFallback({
  resetErrorBoundary
}: FallbackProps): JSX.Element {
  return (
    <Button size='middle' type='primary' onClick={resetErrorBoundary}>
      Retry
    </Button>
  )
}

export default withErrorBoundary(Provision, {
  onError: (err) => message.error(err.message),
  FallbackComponent: ProvisionErrorFallback
})
