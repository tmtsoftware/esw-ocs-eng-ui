import { Layout } from 'antd'
import React from 'react'
import styles from './app.module.css'
import { Sider } from './Sider/Sider'

const { Content } = Layout
type AppProps = {
  children: React.ReactNode
}

export const Container = ({ children }: AppProps): JSX.Element => {
  return (
    <Layout>
      <Sider />
      <Layout>
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  )
}
