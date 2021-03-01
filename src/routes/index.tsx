import { AuthContext } from '@tmtsoftware/esw-ts'
import React, { useContext } from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from '../containers/home/Home'
import Infrastructure from '../containers/infrastructure/Infrastructure'
import NoMatch from './NoMatch'
import RoutesConfig from './RoutesConfig'

const LoginPage = () => <div>User not logged in!!!</div>

const Routes = (): JSX.Element => {
  const { auth } = useContext(AuthContext)
  if (!(auth && auth.isAuthenticated && auth.isAuthenticated())) {
    return <LoginPage />
  }
  return (
    <Switch>
      <Route exact path={RoutesConfig.home} render={() => <Home />} />
      <Route path={RoutesConfig.infrastructure} component={Infrastructure} />
      <Route path={'/*'} component={NoMatch} />
    </Switch>
  )
}

export default Routes
