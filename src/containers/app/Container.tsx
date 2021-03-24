import { Layout } from 'antd'
import React from 'react'
import { Sider } from '../Sider/Sider'
import styles from './app.module.css'

const { Content } = Layout
type AppProps = {
  children: React.ReactNode
}

const Container = ({ children }: AppProps): JSX.Element => {
  return (
    <Layout>
      <Sider />
      <Layout>
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  )
}

export default Container
