import { MoreOutlined } from '@ant-design/icons'
import type { ComponentId, Prefix } from '@tmtsoftware/esw-ts'
import { Dropdown, Grid, MenuProps } from 'antd'
import React from 'react'
import styles from './agentCards.module.css'
import { useKillSequenceComponentItem } from './KillSequenceComponent'
import { useReloadScriptItem } from '../../sm/components/ReloadScript'
import { useStopSequencerItem } from '../../sm/components/StopSequencer'
import { useSequencerState } from '../../sm/hooks/useSequencerState'
import { disabledSequencerActions } from '../agentConstants'

const { useBreakpoint } = Grid

type SequenceComponentActionProps = {
  componentId: ComponentId
}

type SequencerActionProps = {
  componentId: ComponentId
  sequencerPrefix: Prefix
}

export const SequenceComponentActions = ({ componentId }: SequenceComponentActionProps): React.JSX.Element => {
  const screen = useBreakpoint()
  const width = screen.lg ? '200px' : '150px'
  const items: MenuProps['items'] = [
    useKillSequenceComponentItem(componentId),
    {
      type: 'divider'
    },
    {
      key: 'disabledSequencerActions',
      disabled: true,
      label: (
        <div style={{ maxWidth: width }} className={styles.disabledSequencerActions}>
          {disabledSequencerActions.displayMessage}
        </div>
      )
    }
  ]
  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <MoreOutlined className={styles.icon} style={{ fontSize: '1.5rem' }} role='sequenceCompActions' />
    </Dropdown>
  )
}

export const SequencerActions = ({ componentId, sequencerPrefix }: SequencerActionProps): React.JSX.Element => {
  const { data: sequencerState } = useSequencerState(sequencerPrefix)
  const items: MenuProps['items'] = [
    useStopSequencerItem(sequencerPrefix, sequencerState),
    useReloadScriptItem(sequencerPrefix, sequencerState),
    useKillSequenceComponentItem(componentId)
  ]
  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <MoreOutlined className={styles.icon} style={{ fontSize: '1.5rem' }} role='sequencerActions' />
    </Dropdown>
  )
}
