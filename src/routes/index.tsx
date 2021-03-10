import React, { useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from '../containers/home/Home'
import Infrastructure from '../containers/infrastructure/Infrastructure'
import Observations from '../containers/observation/Observations'
import { useAuthContext } from '../contexts/useAuthContext'
import NoMatch from './NoMatch'
import { HOME, INFRASTRUCTURE, NO_MATCH, OBSERVATIONS } from './RoutesConfig'

const Routes = (): JSX.Element => {
  const { login, auth } = useAuthContext()

  useEffect(() => {
    auth && auth.isAuthenticated && !auth.isAuthenticated() && login()
  }, [auth, login])

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
