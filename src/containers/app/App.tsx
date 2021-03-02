import { Layout } from 'antd'
import 'antd/dist/antd.css'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import HeaderBar from '../../components/HeaderBar/HeaderBar'
import styles from './app.module.css'
import Container from './Container'

const { Header } = Layout

const queryClient = new QueryClient()

interface AppProps {
  children: React.ReactNode
}

const App = ({ children }: AppProps): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Header className={styles.tmtHeader}>
          <HeaderBar />
        </Header>
        <Container>{children}</Container>
      </Layout>
      <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
    </QueryClientProvider>
  )
}

export default App
