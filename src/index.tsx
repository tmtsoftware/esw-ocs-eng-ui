import { LoadingOutlined } from '@ant-design/icons'
import { AuthContextProvider, setAppName } from '@tmtsoftware/esw-ts'
import { Result } from 'antd'
import React from 'react'
import { render } from 'react-dom'
import { AppConfig } from './config/AppConfig'
import { App } from './containers/app/App'
import { CombinedServiceContext } from './contexts/CombinedServiceContext'
import { useAuth } from './hooks/useAuth'
import './index.module.css'

setAppName(AppConfig.applicationName)

const Main = () => {
  const { auth } = useAuth()

  if (auth === null) return <Result icon={<LoadingOutlined />} />

  return (
    <CombinedServiceContext>
      <App />
    </CombinedServiceContext>
  )
}

render(
  <React.StrictMode>
    <AuthContextProvider>
      <Main />
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
