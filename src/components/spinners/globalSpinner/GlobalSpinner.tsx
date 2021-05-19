import { Spin } from 'antd'
import { useIsFetching } from 'react-query'
import React from 'react'
import styles from './globalSpinner.module.css'

export const GlobalSpinner = (): JSX.Element => {
  const isFetching = useIsFetching()

  return (
    <div className={styles.globalSpinner}>
      <Spin spinning={isFetching ? true : false} />
    </div>
  )
}
