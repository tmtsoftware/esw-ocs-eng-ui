import { Spin } from 'antd'
import React from 'react'
import { useIsFetching } from 'react-query'
import styles from './globalSpinner.module.css'

export const GlobalSpinner = (): React.JSX.Element => {
  const isFetching = useIsFetching()

  return (
    <div className={styles.globalSpinner}>
      <Spin spinning={isFetching ? true : false} />
    </div>
  )
}
