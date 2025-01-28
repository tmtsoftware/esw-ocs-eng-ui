import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContextProvider, setAppName } from '@tmtsoftware/esw-ts'
import ReactDOM from 'react-dom/client'
import React from 'react'
import { AppConfig } from './config/AppConfig'
import { App } from './containers/app/App'
import './index.module.css'

setAppName(AppConfig.applicationName)
const queryClient = new QueryClient()
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  // <React.StrictMode>
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </AuthContextProvider>
  // </React.StrictMode>
)
