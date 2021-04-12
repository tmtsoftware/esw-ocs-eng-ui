import { AuthContextProvider } from '@tmtsoftware/esw-ts'
import React from 'react'
import { render } from 'react-dom'
import { AppConfig } from './config/AppConfig'
import { App } from './containers/app/App'
import {
  createServiceFactories,
  ServiceFactoryProvider
} from './contexts/ServiceFactoryContext'
import './index.module.css'
import { SMContextProvider } from './contexts/SMContext'
import { useAuth } from './contexts/useAuthContext'

const Main = () => {
  const { auth } = useAuth()
  const tokenFactory = auth ? auth.token : () => undefined
  const serviceFactories = createServiceFactories(tokenFactory)

  return (
    <ServiceFactoryProvider value={serviceFactories}>
      <SMContextProvider>
        <App />
      </SMContextProvider>
    </ServiceFactoryProvider>
  )
}

render(
  <React.StrictMode>
    <AuthContextProvider config={AppConfig}>
      <Main />
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
