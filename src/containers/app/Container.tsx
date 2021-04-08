import { Layout } from 'antd'
import React from 'react'
import { useSMTrack } from '../../features/sm/hooks/useSMStatus'
import styles from './app.module.css'
import { Sider } from './Sider/Sider'

const { Content } = Layout
type AppProps = {
  children: React.ReactNode
}

export const Container = ({ children }: AppProps): JSX.Element => {
  useSMTrack()
  return (
    <Layout>
      <Sider />
      <Layout>
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  )
}
