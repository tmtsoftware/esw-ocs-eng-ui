import { AuthContext } from '@tmtsoftware/esw-ts'
import React, { useContext } from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from '../containers/home/Home'
import Infrastructure from '../containers/infrastructure/Infrastructure'
import LoginPage from './LoginPage'
import NoMatch from './NoMatch'
import { HOME, INFRASTRUCTURE, NO_MATCH } from './RoutesConfig'

const Routes = (): JSX.Element => {
  const { auth } = useContext(AuthContext)
  if (!(auth && auth.isAuthenticated && auth.isAuthenticated())) {
    return <LoginPage />
  }
  return (
    <Switch>
      <Route exact path={HOME} render={() => <Home />} />
      <Route path={INFRASTRUCTURE} component={Infrastructure} />
      <Route path={NO_MATCH} component={NoMatch} />
    </Switch>
  )
}

export default Routes
