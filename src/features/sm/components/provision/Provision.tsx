import React from 'react'
import { ProvisionButton } from './ProvisionButton'
import { UnProvisionButton } from './UnProvisionButton'

const Provision = ({
  provisionStatus,
  disabled
}: {
  provisionStatus: boolean | undefined
  disabled: boolean
}): JSX.Element => {
  return provisionStatus ? (
    <UnProvisionButton disabled={disabled} />
  ) : (
    <ProvisionButton disabled={disabled} />
  )
}

export default Provision
