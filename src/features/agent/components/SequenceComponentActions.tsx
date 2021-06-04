import { MoreOutlined } from '@ant-design/icons'
import type { ComponentId, Prefix } from '@tmtsoftware/esw-ts'
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
  sequencerPrefix: Prefix | undefined
}

const SequenceComponentActionsMenu = ({ componentId, sequencerPrefix, ...restProps }: SequenceComponentActionProps) => (
  <Menu {...restProps}>
    {sequencerPrefix && <StopSequencer sequencerPrefix={sequencerPrefix} />}
    {sequencerPrefix && (
      <ReloadScript subsystem={componentId.prefix.subsystem} obsMode={sequencerPrefix.componentName} />
    )}
    <KillSequenceComponent componentId={componentId} />
    {!sequencerPrefix && (
      <>
        <Menu.Divider />
        <DisabledSequencerActions />
      </>
    )}
  </Menu>
)
export const SequenceComponentActions = ({
  componentId,
  sequencerPrefix
}: SequenceComponentActionProps): JSX.Element => (
  <Dropdown
    overlay={() => <SequenceComponentActionsMenu componentId={componentId} sequencerPrefix={sequencerPrefix} />}
    trigger={['click']}>
    <MoreOutlined style={{ fontSize: '1.5rem' }} role='sequenceCompActions' />
  </Dropdown>
)
