import { useKeycloak } from '@react-keycloak/web'
import React from 'react'
import { render } from 'react-dom'
import App from './containers/app/App'
import { AuthProvider } from './contexts/AuthContext'
import {
  createServiceFactories,
  ServiceFactoryProvider
} from './contexts/ServiceFactoryContext'
import './index.module.css'

const Main = () => {
  const { initialized, keycloak } = useKeycloak()
  const tokenFactory = () => keycloak.token
  const serviceFactories = createServiceFactories(tokenFactory)

  if (!initialized) return <p>Loading ...</p>

  return (
    <ServiceFactoryProvider value={serviceFactories}>
      <App />
    </ServiceFactoryProvider>
  )
}

render(
  <React.StrictMode>
    <AuthProvider>
      <Main />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
