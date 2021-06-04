import { MoreOutlined } from '@ant-design/icons'
import { ComponentId, Prefix, Subsystem } from '@tmtsoftware/esw-ts'
import { Dropdown, Menu, Grid } from 'antd'
import React from 'react'
import { ReloadScript } from '../../sm/components/ReloadScript'
import { StopSequencer } from '../../sm/components/StopSequencer'
import styles from './agentCards.module.css'
import { KillSequenceComponent } from './KillSequenceComponent'

const { useBreakpoint } = Grid

const DisabledSequencerActions = () => {
  const screen = useBreakpoint()
  const width = screen.lg ? '200px' : '150px'
  const displayMessage = 'Spawned sequencers will display more actions'
  return (
    <Menu.Item key='disabledSequencerActions' disabled={true}>
      <div style={{ maxWidth: width }} className={styles.disabledSequencerActions}>
        {displayMessage}
      </div>
    </Menu.Item>
  )
}

type SequenceComponentActionProps = {
  componentId: ComponentId
  sequencerSubsystem: Subsystem
  obsMode: string
}

const SequenceComponentActionsMenu = ({
  componentId,
  sequencerSubsystem,
  obsMode,
  ...restProps
}: SequenceComponentActionProps) => (
  <Menu {...restProps}>
    {obsMode && <StopSequencer sequencerPrefix={Prefix.fromString(`${sequencerSubsystem}.${obsMode}`)} />}
    {obsMode && <ReloadScript subsystem={sequencerSubsystem} obsMode={obsMode} />}
    <KillSequenceComponent componentId={componentId} />
    {!obsMode && (
      <>
        <Menu.Divider />
        <DisabledSequencerActions />
      </>
    )}
  </Menu>
)

export const SequenceComponentActions = ({
  componentId,
  sequencerSubsystem,
  obsMode
}: SequenceComponentActionProps): JSX.Element => (
  <Dropdown
    overlay={() => (
      <SequenceComponentActionsMenu
        componentId={componentId}
        sequencerSubsystem={sequencerSubsystem}
        obsMode={obsMode}
      />
    )}
    trigger={['click']}>
    <MoreOutlined style={{ fontSize: '1.5rem' }} role='sequenceCompActions' />
  </Dropdown>
)
