import { Space } from 'antd'
import React from 'react'
import { useSMContext } from '../../contexts/SMContext'
import { Configure } from '../../features/sm/components/Configure'
import { Provision } from '../../features/sm/components/provision/Provision'
import { useProvisionStatus } from '../../features/sm/hooks/useProvisionStatus'

export const SmActions = (): JSX.Element => {
  const provisionStatus = useProvisionStatus(false)
  const [smLocation, loading] = useSMContext()
  const disabled = loading || !smLocation
  return (
    <Space>
      <Provision provisionStatus={provisionStatus.data} disabled={disabled} />
      <Configure disabled={!provisionStatus.data || disabled} />
    </Space>
  )
}
