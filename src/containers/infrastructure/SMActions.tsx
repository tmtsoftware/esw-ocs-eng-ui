import { Space } from 'antd'
import React from 'react'
import { Configure } from '../../features/sm/components/configure/Configure'
import { Provision } from '../../features/sm/components/provision/Provision'
import { useProvisionStatus } from '../../features/sm/hooks/useProvisionStatus'
import { useSMContext } from '../../features/sm/hooks/useSMContext'

export const SmActions = (): JSX.Element => {
  const provisionStatus = useProvisionStatus(false)
  const [smLocation, loading] = useSMContext()
  console.log(smLocation, loading)
  const disabled = loading || !smLocation
  return (
    <Space>
      <Provision provisionStatus={provisionStatus.data} disabled={disabled} />
      <Configure disabled={!provisionStatus.data || disabled} />
    </Space>
  )
}
