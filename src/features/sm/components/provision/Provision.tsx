import React from 'react'
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
    <ProvisionButton disabled={disabled} />
  )
}
