import { PageHeader as AntPageHeader, PageHeaderProps } from 'antd'
import React from 'react'
import { useHistory } from 'react-router'
import styles from './pageHeader.module.css'

export const PageHeader = ({
  title,
  ...props
}: PageHeaderProps): JSX.Element => {
  const history = useHistory()
  return (
    <AntPageHeader
      onBack={() => history.goBack()}
      className={styles.pageHeader}
      title={title}
      {...props}
    />
  )
}
