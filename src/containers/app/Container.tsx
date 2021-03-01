import { Layout } from 'antd'
import React from 'react'
import CheckLogin from '../../routes/CheckLogin'
import { Sider } from '../Sider/Sider'
import styles from './app.module.css'

const { Content } = Layout
interface AppProps {
  children: React.ReactNode
}

const Container = ({ children }: AppProps): JSX.Element => {
  return (
    <CheckLogin fallbackComponent={<></>}>
      <Layout>
        <Sider />
        <Layout>
          <Content className={styles.content}>{children}</Content>
        </Layout>
      </Layout>
    </CheckLogin>
  )
}

export default Container
