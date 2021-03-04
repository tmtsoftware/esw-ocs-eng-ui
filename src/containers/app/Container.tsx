import { Layout } from 'antd'
import React from 'react'
import { useAuthContext } from '../../contexts/useAuthContext'
import { Sider } from '../Sider/Sider'
import styles from './app.module.css'

const { Content } = Layout
interface AppProps {
  children: React.ReactNode
}

const Container = ({ children }: AppProps): JSX.Element => {
  const { auth } = useAuthContext()
  return (
    <Layout>
      {auth?.isAuthenticated() ? <Sider /> : <></>}
      <Layout>
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  )
}

export default Container
