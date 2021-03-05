import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from '../containers/home/Home'
import Infrastructure from '../containers/infrastructure/Infrastructure'
import { useAuthContext } from '../contexts/useAuthContext'
import LoginPage from './LoginPage'
import NoMatch from './NoMatch'
import { HOME, INFRASTRUCTURE, NO_MATCH } from './RoutesConfig'

const Routes = (): JSX.Element => {
  const { auth } = useAuthContext()
  if (!(auth && auth.isAuthenticated && auth.isAuthenticated())) {
    return <LoginPage />
  }
  return (
    <Switch>
      <Route exact path={HOME} component={Home} />
      <Route path={INFRASTRUCTURE} component={Infrastructure} />
      <Route path={NO_MATCH} component={NoMatch} />
    </Switch>
  )
}

export default Routes
