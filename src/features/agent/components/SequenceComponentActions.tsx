import { MoreOutlined } from '@ant-design/icons'
import { ComponentId, Prefix } from '@tmtsoftware/esw-ts'
import { Dropdown, Menu, Grid } from 'antd'
import React from 'react'
import { ReloadScript } from '../../sm/components/ReloadScript'
import { UnloadScript } from '../../sm/components/UnloadScript'
import { KillSequenceComponent } from './KillSequenceComponent'

const { useBreakpoint } = Grid

const DisabledSequencerActions = () => {
  const screen = useBreakpoint()
  const width = screen.lg ? '200px' : '150px'
  const displayMessage = 'Spawned sequencers will display more actions'
  return (
    <Menu.Item key='disabledSequencerActions' disabled={true}>
      <div style={{ maxWidth: width, whiteSpace: 'pre-wrap', fontStyle: 'italic' }}>{displayMessage}</div>
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
      {obsMode && <UnloadScript sequencerPrefix={Prefix.fromString(obsMode)} />}
      {obsMode && <ReloadScript subsystem={componentId.prefix.subsystem} obsMode={obsMode.split('.')[1]} />}
      <KillSequenceComponent componentId={componentId} />
      {!obsMode && (
        <>
          <Menu.Divider />
          <DisabledSequencerActions />
        </>
      )}
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
