import { LoadingOutlined } from '@ant-design/icons'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { loadGlobalConfig, LocationService } from '@tmtsoftware/esw-ts'
import { Layout, Result } from 'antd'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import styles from './app.module.css'
import { Container } from './Container'
import { HeaderBar } from '../../components/headerBar/HeaderBar'
import { GlobalSpinner } from '../../components/spinners/globalSpinner/GlobalSpinner'
import { AppConfig } from '../../config/AppConfig'
import { CombinedServiceContext } from '../../contexts/CombinedServiceContext'
import { useAuth } from '../../hooks/useAuth'
import { useQuery } from '../../hooks/useQuery'
import { Routes } from '../../routes'
import { getUsername } from '../../utils/getUsername'
import '@ant-design/v5-patch-for-react-19'

const { Header } = Layout

const ROUTER_BASENAME = import.meta.env.PROD ? `/${AppConfig.applicationName}` : ''

const useGlobalConfig = () => useQuery(['GlobalConfig'], () => loadGlobalConfig().then(() => true))

export const App = (): React.JSX.Element => {
  const { data: initialised, error } = useGlobalConfig()
  const { auth } = useAuth()
  const locationService = LocationService({ username: getUsername(auth) })

  if (error) return <Result status={'error'} title={'Global Config not found'} />
  if (!auth || !initialised) return <Result icon={<LoadingOutlined />} />

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
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}
