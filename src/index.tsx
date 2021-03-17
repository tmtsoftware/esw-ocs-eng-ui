import React from 'react'
import { render } from 'react-dom'
import App from './containers/app/App'
import {
  createServiceFactories,
  ServiceFactoryProvider
} from './contexts/ServiceFactoryContext'
import './index.module.css'
import { useAuth } from './contexts/useAuthContext'

const Main = () => {
  // const { auth } = useAuth()
  const tokenFactory = () => undefined
  const serviceFactories = createServiceFactories(tokenFactory)

  return (
    <ServiceFactoryProvider value={serviceFactories}>
      <App />
    </ServiceFactoryProvider>
  )
}

render(
  <React.StrictMode>
    {/*<AuthContextProvider config={AppConfig}>*/}
    <Main />
    {/*</AuthContextProvider>*/}
  </React.StrictMode>,
  document.getElementById('root')
)
