import { Layout } from 'antd'
import React from 'react'
import styles from './app.module.css'
import { Sider } from './sider/Sider'

const { Content } = Layout
type AppProps = {
  children: React.ReactNode
}

export const Container = ({ children }: AppProps): React.JSX.Element => {
  return (
    <Layout>
      <Sider />
      <Layout>
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  )
}
