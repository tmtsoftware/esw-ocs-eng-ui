import { MoreOutlined } from '@ant-design/icons'
import type { ComponentId } from '@tmtsoftware/esw-ts'
import { Dropdown, Menu } from 'antd'
import React from 'react'
import { ReloadScript } from '../../sm/components/ReloadScript'
import { KillSequenceComponent } from './KillSequenceComponent'

const DisabledSequencerActions = () => {
  const displayMessage = 'Spawned sequencers will display more actions'
  return (
    <Menu.Item key='disabledSequencerActions' disabled={true} icon={<></>}>
      {displayMessage}
    </Menu.Item>
  )
}

type SequenceComponentActionProps = {
  componentId: ComponentId
  obsMode: string
}

const SequenceComponentActionsMenu = ({ componentId, obsMode, ...restProps }: SequenceComponentActionProps) => {
  return (
    <Menu {...restProps}>
      <KillSequenceComponent componentId={componentId} />
      <Menu.Divider />
      {!obsMode && <DisabledSequencerActions />}
      {obsMode && <ReloadScript subsystem={componentId.prefix.subsystem} obsMode={obsMode.split('.')[1]} />}
    </Menu>
  )
}
export const SequenceComponentActions = ({ componentId, obsMode }: SequenceComponentActionProps): JSX.Element => {
  return (
    <Dropdown
      overlay={() => <SequenceComponentActionsMenu componentId={componentId} obsMode={obsMode} />}
      trigger={['click']}>
      <MoreOutlined style={{ fontSize: '1.5rem' }} role='sequenceCompActions' />
    </Dropdown>
  )
}
