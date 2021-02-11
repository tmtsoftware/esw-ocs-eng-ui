import { Menu } from 'antd'
import React from 'react'
import { useAgents } from '../hooks/useAgents'
import styles from './selectAgent.module.css'

interface SelectAgentProps {
  onChange: (value: string) => void
  selectedAgent: string
}
interface MenuInfo {
  key: React.Key
  keyPath: React.Key[]
  item: React.ReactInstance
  domEvent: React.MouseEvent<HTMLElement>
}
interface SelectInfo extends MenuInfo {
  selectedKeys?: React.Key[]
}
export const SelectAgent = ({
  onChange,
  selectedAgent
}: SelectAgentProps): JSX.Element => {
  const allAgentQuery = useAgents()
  const onSelect = (e: SelectInfo) => onChange(e.key as string)

  return (
    <Menu selectable onSelect={onSelect}>
      {allAgentQuery.data &&
        allAgentQuery.data.map((prefix) => {
          const agentName = prefix.toJSON()

          return (
            <Menu.Item
              className={
                styles.menuItem +
                ` ${agentName == selectedAgent ? styles.selectedItem : ''}`
              }
              key={agentName}>
              {agentName}
            </Menu.Item>
          )
        })}
    </Menu>
  )
}