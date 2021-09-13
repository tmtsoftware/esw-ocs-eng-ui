import { LoadingOutlined } from '@ant-design/icons'
import { loadGlobalConfig, LocationService } from '@tmtsoftware/esw-ts'
import { Layout, Result } from 'antd'
import 'antd/dist/antd.css'
import React, { useEffect, useState } from 'react'
import { ReactQueryDevtools } from 'react-query/devtools'
import { BrowserRouter as Router } from 'react-router-dom'
import { HeaderBar } from '../../components/headerBar/HeaderBar'
import { GlobalSpinner } from '../../components/spinners/globalSpinner/GlobalSpinner'
import { AppConfig } from '../../config/AppConfig'
import { CombinedServiceContext } from '../../contexts/CombinedServiceContext'
import { useAuth } from '../../hooks/useAuth'
import { Routes } from '../../routes'
import { getUsername } from '../../utils/getUsername'
import styles from './app.module.css'
import { Container } from './Container'

const { Header } = Layout

const ROUTER_BASENAME = import.meta.env.NODE_ENV === 'production' ? `/${AppConfig.applicationName}` : ''

export const App = (): JSX.Element => {
  const [initialized, setInitailized] = useState(false)
  const { auth } = useAuth()
  const locationService = LocationService({ username: getUsername(auth) })

  useEffect(() => {
    loadGlobalConfig().then(() => setInitailized(true))
  }, [initialized])

  if (!auth || !initialized) return <Result icon={<LoadingOutlined />} />

  return (
    <>
      <CombinedServiceContext locationService={locationService}>
        <Router basename={ROUTER_BASENAME}>
          <Layout className={styles.app}>
            <Header className={styles.tmtHeader}>
              <HeaderBar />
            </Header>
            <Container>
              <Routes loggedIn={auth.isAuthenticated() ?? false} />
            </Container>
          </Layout>
        </Router>
      </CombinedServiceContext>
      <GlobalSpinner />
      <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
    </>
  )
}
