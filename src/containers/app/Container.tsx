import { AuthContext } from '@tmtsoftware/esw-ts'
import { Layout } from 'antd'
import React, { useContext } from 'react'
import { Sider } from '../Sider/Sider'
import styles from './app.module.css'

const { Content } = Layout
interface AppProps {
  children: React.ReactNode
}

const Container = ({ children }: AppProps): JSX.Element => {
  const { auth } = useContext(AuthContext)
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
