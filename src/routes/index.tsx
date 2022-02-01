import { LoadingOutlined } from '@ant-design/icons'
import { Result } from 'antd'
import React, { useEffect } from 'react'
import { Route, Routes as RouterRoutes } from 'react-router-dom'
import { Home } from '../containers/home/Home'
import { Infrastructure } from '../containers/infrastructure/Infrastructure'
import { Observations } from '../containers/observation/Observations'
import { Resources } from '../containers/resources/Resources'
import { ManageSequencer } from '../containers/sequencer/ManageSequencer'
import { useAuth } from '../hooks/useAuth'
import { NoMatch } from './NoMatch'
import { HOME, INFRASTRUCTURE, NO_MATCH, OBSERVATIONS, RESOURCES, SEQUENCER_PATH } from './RoutesConfig'

const RedirectToLogin = () => {
  const { login } = useAuth()

  useEffect(login, [login])

  return <Result icon={<LoadingOutlined />} />
}

export const Routes = ({ loggedIn }: { loggedIn: boolean }): JSX.Element => {
  return loggedIn ? (
    <RouterRoutes>
      <Route path={HOME} element={<Home />} />
      <Route path={INFRASTRUCTURE} element={<Infrastructure />} />
      <Route path={OBSERVATIONS} element={<Observations />} />
      <Route path={RESOURCES} element={<Resources />} />
      <Route path={SEQUENCER_PATH} element={<ManageSequencer />} />
      <Route path={NO_MATCH} element={<NoMatch />} />
    </RouterRoutes>
  ) : (
    <RedirectToLogin />
  )
}
