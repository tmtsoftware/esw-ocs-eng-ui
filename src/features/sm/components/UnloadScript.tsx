import { FileExcelOutlined } from '@ant-design/icons'
import type { Prefix } from '@tmtsoftware/esw-ts'
import { Button, Tooltip } from 'antd'
import React from 'react'
import styles from '../../agent/components/agentCards.module.css'

export const UnloadScript = (): JSX.Element => {
  return (
    <Tooltip placement='bottom' title='Unload script'>
      <Button
        type='text'
        icon={
          <FileExcelOutlined
            className={styles.icon}
            role='unloadScriptIcon'
            onClick={() => ({})}
          />
        }
      />
    </Tooltip>
  )
}
