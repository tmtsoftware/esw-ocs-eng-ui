import { Layout } from 'antd'
import React from 'react'
import { useAuth } from '../../contexts/useAuthContext'
import { Sider } from '../Sider/Sider'
import styles from './app.module.css'

const { Content } = Layout
interface AppProps {
  children: React.ReactNode
}

const Container = ({ children }: AppProps): JSX.Element => {
  // const { auth } = useAuth()
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
