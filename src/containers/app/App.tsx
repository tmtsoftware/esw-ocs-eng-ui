import { Layout } from 'antd'
import 'antd/dist/antd.css'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { BrowserRouter as Router } from 'react-router-dom'
import HeaderBar from '../../components/HeaderBar/HeaderBar'
import GlobalSpinner from '../../components/spinners/globalSpinner/GlobalSpinner'
import Routes from '../../routes/index'
import styles from './app.module.css'
import Container from './Container'

const { Header } = Layout

const queryClient = new QueryClient()

const App = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
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
    </QueryClientProvider>
  )
}

export default App
