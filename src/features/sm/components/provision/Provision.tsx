import React from 'react'
import { ProvisionButton } from './ProvisionButton'
import { UnProvisionButton } from './UnProvisionButton'
import { useProvisionStatus } from './useProvisionStatus'

const Provision = (): JSX.Element => {
  const provisionStatus = useProvisionStatus(false)
  return provisionStatus.data ? <UnProvisionButton /> : <ProvisionButton />
}

export default Provision
