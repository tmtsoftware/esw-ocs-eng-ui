import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContextProvider, setAppName } from '@tmtsoftware/esw-ts'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { AppConfig } from './config/AppConfig'
import { App } from './containers/app/App'
import './index.module.css'

setAppName(AppConfig.applicationName)
const queryClient = new QueryClient()
const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </AuthContextProvider>
  </React.StrictMode>
)
