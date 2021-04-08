import { Layout } from 'antd'
import React from 'react'
import { SMContextProvider } from '../../features/sm/hooks/useSMContext'
import { useSMTrack } from '../../features/sm/hooks/useSMStatus'
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
        <SMContextProvider>
          <Content className={styles.content}>{children}</Content>
        </SMContextProvider>
      </Layout>
    </Layout>
  )
}
