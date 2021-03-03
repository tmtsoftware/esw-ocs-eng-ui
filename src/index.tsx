import { AuthContextProvider } from '@tmtsoftware/esw-ts'
import React from 'react'
import { render } from 'react-dom'
import { AppConfig } from './config/AppConfig'
import App from './containers/app/App'
import { ServiceFactoryProvider } from './contexts/serviceFactoryContext/ServiceFactoryContext'
import './index.module.css'

render(
  <React.StrictMode>
    <AuthContextProvider config={AppConfig}>
      <ServiceFactoryProvider>
        <App />
      </ServiceFactoryProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
