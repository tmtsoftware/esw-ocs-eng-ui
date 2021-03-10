import { useKeycloak } from '@react-keycloak/web'
import { Layout } from 'antd'
import React from 'react'
import { Sider } from '../Sider/Sider'
import styles from './app.module.css'

const { Content } = Layout
interface AppProps {
  children: React.ReactNode
}

const Container = ({ children }: AppProps): JSX.Element => {
  const { keycloak } = useKeycloak()
  return (
    <Layout>
      {keycloak.authenticated ? <Sider /> : <></>}
      <Layout>
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  )
}

export default Container
