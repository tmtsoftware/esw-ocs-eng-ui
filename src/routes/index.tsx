import { AuthContext } from '@tmtsoftware/esw-ts'
import React, { useContext } from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from '../containers/home/Home'
import Infrastructure from '../containers/infrastructure/Infrastructure'
import NoMatch from './NoMatch'

const LoginPage = () => <div>User not logged in!!!</div>

const Routes = (): JSX.Element => {
  const { auth } = useContext(AuthContext)
  if (!(auth && auth.isAuthenticated && auth.isAuthenticated())) {
    return <LoginPage />
  }
  return (
    <Switch>
      <Route exact path={RoutesConfig.home} component={Home} />
      <Route path={RoutesConfig.infrastructure} component={Infrastructure} />
      <Route component={NoMatch} />
    </Switch>
  )
}

export const RoutesConfig = {
  home: '/',
  infrastructure: '/Infrastructure',
  observations: '/Observations',
  resources: '/Resources'
}

export default Routes
