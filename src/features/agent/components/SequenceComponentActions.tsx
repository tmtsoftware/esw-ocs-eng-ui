import {MoreOutlined} from '@ant-design/icons'
import type {ComponentId, Prefix} from '@tmtsoftware/esw-ts'
import {Dropdown, Grid, Menu, MenuProps} from 'antd'
import React from 'react'
import styles from './agentCards.module.css'
import {KillSequenceComponent} from './KillSequenceComponent'
import {ReloadScript} from '../../sm/components/ReloadScript'
import {StopSequencer} from '../../sm/components/StopSequencer'
import {useSequencerState} from '../../sm/hooks/useSequencerState'
import {disabledSequencerActions} from '../agentConstants'
import {MenuDividerType} from "antd/es/menu/hooks/useItems";
import {MenuItem} from "../../../utils/menuTypes";
import {useSMService} from "../../../contexts/SMContext";

const {useBreakpoint} = Grid

type SequenceComponentActionProps = {
  componentId: ComponentId
}

type SequencerActionProps = {
  componentId: ComponentId
  sequencerPrefix: Prefix
}

const DisabledSequencerActions = (): MenuItem => {
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

const SequenceComponentActionsMenu = (componentId: ComponentId): MenuProps['items'] => {
  const dividerItem: MenuDividerType = {type: 'divider'}
  return [
    KillSequenceComponent(componentId),
    dividerItem,
    DisabledSequencerActions()
  ]
}


const SequencerActionsMenu = (componentId: ComponentId, sequencerPrefix: Prefix): MenuProps['items'] => {
  const {data: sequencerState} = useSequencerState(sequencerPrefix)
  return [
    StopSequencer(sequencerPrefix, sequencerState),
    ReloadScript(sequencerPrefix, sequencerState),
    KillSequenceComponent(componentId)
  ]
}

export const SequenceComponentActions = ({componentId}: SequenceComponentActionProps): React.JSX.Element => (
  <Dropdown menu={{items: SequenceComponentActionsMenu(componentId)}} trigger={['click']}>
    <MoreOutlined className={styles.icon} style={{fontSize: '1.5rem'}} role='sequenceCompActions'/>
  </Dropdown>
)

export const SequencerActions = ({componentId, sequencerPrefix}: SequencerActionProps): React.JSX.Element => {
  return <Dropdown
    menu={{items: SequencerActionsMenu(componentId, sequencerPrefix)}}
    trigger={['click']}>
    <MoreOutlined className={styles.icon} style={{fontSize: '1.5rem'}} role='sequencerActions'/>
  </Dropdown>
}

