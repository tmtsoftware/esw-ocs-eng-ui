import { PageHeader as AntPageHeader, PageHeaderProps } from 'antd'
import React from 'react'
import styles from './pageHeader.module.css'
interface Props extends PageHeaderProps {
  title: string
}
const PageHeader = ({ title, ...props }: Props): JSX.Element => {
  return (
    <AntPageHeader className={styles.pageHeader} title={title} {...props} />
  )
}

export default PageHeader
