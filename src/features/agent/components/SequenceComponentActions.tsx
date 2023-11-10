import {MoreOutlined} from '@ant-design/icons'
import type {ComponentId, Prefix} from '@tmtsoftware/esw-ts'
import {Dropdown, Grid, Menu} from 'antd'
import React from 'react'
import styles from './agentCards.module.css'
import {KillSequenceComponentProps} from './KillSequenceComponent'
import {ReloadScript} from '../../sm/components/ReloadScript'
import {StopSequencer} from '../../sm/components/StopSequencer'
import {useSequencerState} from '../../sm/hooks/useSequencerState'
import {disabledSequencerActions} from '../agentConstants'

const {useBreakpoint} = Grid

type SequenceComponentActionProps = {
  componentId: ComponentId
}

type SequencerActionProps = {
  componentId: ComponentId
  sequencerPrefix: Prefix
}

const DisabledSequencerProps = () => {
  const screen = useBreakpoint()
  const width = screen.lg ? '200px' : '150px'
  return {
    key: 'disabledSequencerActions',
    disabled: true,
    label: <div style={{maxWidth: width}} className={styles.disabledSequencerActions}>
      {disabledSequencerActions.displayMessage}
    </div>
  }
}

const SequenceComponentActionsProps = ({componentId, ...restProps}: SequenceComponentActionProps) => (
  [
    KillSequenceComponentProps({componentId: componentId}),
    {type: 'divider'},
    DisabledSequencerProps(),
    {...restProps}
  ]
)

const SequencerActionsMenu = ({componentId, sequencerPrefix, ...restProps}: SequencerActionProps) => {
  const {data: sequencerState} = useSequencerState(sequencerPrefix)
  return (
    <Menu {...restProps}>
      <StopSequencer sequencerState={sequencerState} sequencerPrefix={sequencerPrefix}/>
      <ReloadScript sequencerState={sequencerState} sequencerPrefix={sequencerPrefix}/>
      <KillSequenceComponentProps componentId={componentId}/>
    </Menu>
  )
  //  return [
  //   KillSequenceComponentProps({componentId: componentId}),
  //     {...restProps}
  //   ]
}

export const SequenceComponentActions = ({componentId}: SequenceComponentActionProps): React.JSX.Element => (
  <Dropdown overlay={() => <SequenceComponentActionsProps componentId={componentId}/>} trigger={['click']}>
    <MoreOutlined className={styles.icon} style={{fontSize: '1.5rem'}} role='sequenceCompActions'/>
  </Dropdown>
)

export const SequencerActions = ({componentId, sequencerPrefix}: SequencerActionProps): React.JSX.Element => (
  <Dropdown
    overlay={() => <SequencerActionsMenu componentId={componentId} sequencerPrefix={sequencerPrefix}/>}
    trigger={['click']}>
    <MoreOutlined className={styles.icon} style={{fontSize: '1.5rem'}} role='sequencerActions'/>
  </Dropdown>
)
