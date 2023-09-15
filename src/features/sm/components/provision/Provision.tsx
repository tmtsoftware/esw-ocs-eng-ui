import React from 'react'
import { ProvisionButton } from './ProvisionButton'
import { UnProvisionButton } from './UnProvisionButton'
import { ConfigServiceProvider } from '../../../../contexts/ConfigServiceContext'

type ProvisionProps = {
  provisionStatus: boolean | undefined
  disabled?: boolean
}

export const Provision = ({ provisionStatus, disabled = false }: ProvisionProps): JSX.Element =>
  provisionStatus ? (
    <UnProvisionButton disabled={disabled} />
  ) : (
    <ConfigServiceProvider>
      <ProvisionButton disabled={disabled} />
    </ConfigServiceProvider>
  )
