import React from 'react'
import { ConfigServiceProvider } from '../../../../contexts/ConfigServiceContext'
import { ProvisionButton } from './ProvisionButton'
import { UnProvisionButton } from './UnProvisionButton'

export const Provision = ({
  provisionStatus,
  disabled = false
}: {
  provisionStatus: boolean | undefined
  disabled?: boolean
}): JSX.Element => {
  return provisionStatus ? (
    <UnProvisionButton disabled={disabled} />
  ) : (
    <ConfigServiceProvider>
      <ProvisionButton disabled={disabled} />
    </ConfigServiceProvider>
  )
}
