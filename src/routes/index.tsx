import { LoadingOutlined } from '@ant-design/icons'
import { Result } from 'antd'
import React, { useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from '../containers/home/Home'
import Infrastructure from '../containers/infrastructure/Infrastructure'
import Observations from '../containers/observation/Observations'
import { useAuth } from '../contexts/useAuthContext'
import NoMatch from './NoMatch'
import { HOME, INFRASTRUCTURE, NO_MATCH, OBSERVATIONS } from './RoutesConfig'

const RedirectToLogin = ({ login }: { login: () => void }) => {
  useEffect(() => {
    login()
  }, [login])

  return <Result icon={<LoadingOutlined />} />
}

const Routes = (): JSX.Element => {
  const { login, auth } = useAuth()

  // if (auth === null) return <Result icon={<LoadingOutlined />} />

  return (
    <Switch>
      <Route exact path={HOME} component={Home} />
      <Route path={INFRASTRUCTURE} component={Infrastructure} />
      <Route path={OBSERVATIONS} component={Observations} />
      <Route path={NO_MATCH} component={NoMatch} />
    </Switch>
  )
}

export default Routes
