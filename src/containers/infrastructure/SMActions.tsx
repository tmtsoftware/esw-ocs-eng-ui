import { Space } from 'antd'
import React from 'react'
import { useSMService } from '../../contexts/SMContext'
import { Configure } from '../../features/sm/components/Configure'
import { LoadScript } from '../../features/sm/components/LoadScript'
import { Provision } from '../../features/sm/components/provision/Provision'
import { useProvisionStatus } from '../../features/sm/hooks/useProvisionStatus'

export const SmActions = (): JSX.Element => {
  const provisionStatus = useProvisionStatus()
  const [smContext, loading] = useSMService()
  const smLocation = smContext?.smLocation

  const disabled = !smLocation || loading
  return (
    <Space>
      <Provision provisionStatus={provisionStatus} disabled={disabled} />
      <Configure disabled={!provisionStatus || disabled} />
      <LoadScript disabled={!provisionStatus || disabled} />
    </Space>
  )
}
