import React from 'react'
import { ProvisionButton } from './ProvisionButton'
import { UnProvisionButton } from './UnProvisionButton'

const Provision = ({
  provisionStatus
}: {
  provisionStatus: boolean | undefined
}): JSX.Element => {
  return provisionStatus ? <UnProvisionButton /> : <ProvisionButton />
}

export default Provision
