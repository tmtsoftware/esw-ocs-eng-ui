import React from 'react'
import { useProvisionStatus } from '../../hooks/useProvisionStatus'
import { ProvisionButton } from './ProvisionButton'
import { UnProvisionButton } from './UnProvisionButton'

const Provision = (): JSX.Element => {
  const provisionStatus = useProvisionStatus(false)
  return provisionStatus.data ? <UnProvisionButton /> : <ProvisionButton />
}

export default Provision
