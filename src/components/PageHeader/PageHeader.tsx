import { PageHeader as AntPageHeader, PageHeaderProps } from 'antd'
import React from 'react'
import styles from './pageHeader.module.css'

const PageHeader = ({ title, ...props }: PageHeaderProps): JSX.Element => {
  return (
    <AntPageHeader className={styles.pageHeader} title={title} {...props} />
  )
}

export default PageHeader
