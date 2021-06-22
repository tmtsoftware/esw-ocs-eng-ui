import type { ObsMode } from '@tmtsoftware/esw-ts'
import { Typography } from 'antd'
import React, { ReactElement } from 'react'
import type { ResourceTableStatus } from '../../features/sequencer/components/ResourcesTable'
import { ResourcesTable } from '../../features/sequencer/components/ResourcesTable'
import { ObsModeCard, Status } from './CommonComponents'

export const NonConfiguredObsMode = ({
  obsMode,
  resources,
  actions
}: {
  obsMode: ObsMode
  resources: ResourceTableStatus[]
  actions?: ReactElement
}): JSX.Element => {
  return (
    <ObsModeCard
      title={
        <>
          <Typography.Title level={4}>{obsMode.name}</Typography.Title>
          <Status />
        </>
      }
      extra={actions}>
      <ResourcesTable resources={resources} />
    </ObsModeCard>
  )
}
