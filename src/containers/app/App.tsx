import { Layout } from 'antd'
import 'antd/dist/antd.css'
import React from 'react'
import { ReactQueryDevtools } from 'react-query/devtools'
import { BrowserRouter as Router } from 'react-router-dom'
import { HeaderBar } from '../../components/headerBar/HeaderBar'
import { GlobalSpinner } from '../../components/spinners/globalSpinner/GlobalSpinner'
import { AppConfig } from '../../config/AppConfig'
import { Routes } from '../../routes/index'
import styles from './app.module.css'
import { Container } from './Container'

const { Header } = Layout

const basename = import.meta.env.NODE_ENV === 'production' ? `/${AppConfig.applicationName}` : ''

export const App = (): JSX.Element => {
  return (
    <>
      <Router basename={basename}>
        <Layout className={styles.app}>
          <Header className={styles.tmtHeader}>
            <HeaderBar />
          </Header>
          <Container>
            <Routes />
          </Container>
        </Layout>
      </Router>
      <GlobalSpinner />
      <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
    </>
  )
}
