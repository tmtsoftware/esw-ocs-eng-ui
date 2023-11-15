import {CloseCircleOutlined, MoreOutlined} from '@ant-design/icons'
import type {ComponentId, Prefix} from '@tmtsoftware/esw-ts'
import {Dropdown, Grid, Menu} from 'antd'
import React from 'react'
import styles from './agentCards.module.css'
import {KillSequenceComponent} from './KillSequenceComponent'
import {ReloadScript} from '../../sm/components/ReloadScript'
import {StopSequencer} from '../../sm/components/StopSequencer'
import {useSequencerState} from '../../sm/hooks/useSequencerState'
import {disabledSequencerActions} from '../agentConstants'
import {ItemType, MenuDividerType} from "antd/es/menu/hooks/useItems";
import {stopSequencerConstants} from "../../sm/smConstants";

const {useBreakpoint} = Grid

type SequenceComponentActionProps = {
  componentId: ComponentId
}

type SequencerActionProps = {
  componentId: ComponentId
  sequencerPrefix: Prefix
}

const DisabledSequencerActions = (): ItemType => {
  const screen = useBreakpoint()
  const width = screen.lg ? '200px' : '150px'
  return {
    key: 'disabledSequencerActions',
    disabled: true,
    label: (
      <div style={{maxWidth: width}} className={styles.disabledSequencerActions}>
        {disabledSequencerActions.displayMessage}
      </div>
    )
  }
}

const SequenceComponentActionsMenu = ({componentId, ...restProps}: SequenceComponentActionProps) => {
  const dividerItem: MenuDividerType =  {type: 'divider'}
  const items = [
    KillSequenceComponent(componentId),
    dividerItem,
    DisabledSequencerActions()
  ]
  return (
    <Menu items={items} {...restProps}/>
  )
}

const SequencerActionsMenu = ({componentId, sequencerPrefix, ...restProps}: SequencerActionProps) => {
  const {data: sequencerState} = useSequencerState(sequencerPrefix)
  const items = [
    StopSequencer(sequencerPrefix, sequencerState),
    ReloadScript(sequencerPrefix, sequencerState),
    KillSequenceComponent(componentId)
  ]
  return (
    <Menu items={items} {...restProps}/>
  )
}

export const SequenceComponentActions = ({componentId}: SequenceComponentActionProps): React.JSX.Element => (
  <Dropdown overlay={() => <SequenceComponentActionsMenu componentId={componentId}/>} trigger={['click']}>
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
