import { Space } from 'antd'
import React from 'react'
import Configure from '../../features/sm/components/configure/Configure'
import Provision from '../../features/sm/components/provision/Provision'
import { useProvisionStatus } from '../../features/sm/hooks/useProvisionStatus'

const SmActions = (): JSX.Element => {
  const provisionStatus = useProvisionStatus(false)
  return (
    <Space>
      <Provision provisionStatus={provisionStatus.data} />
      <Configure disabled={!provisionStatus.data} />
    </Space>
  )
}

export default SmActions
