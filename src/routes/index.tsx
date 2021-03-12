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

  return <></>
}

const Routes = (): JSX.Element => {
  const { login, auth } = useAuth()

  if (auth === null) return <p>Loading...</p>

  return auth.isAuthenticated() ? (
    <Switch>
      <Route exact path={HOME} component={Home} />
      <Route path={INFRASTRUCTURE} component={Infrastructure} />
      <Route path={OBSERVATIONS} component={Observations} />
      <Route path={NO_MATCH} component={NoMatch} />
    </Switch>
  ) : (
    <RedirectToLogin login={login} />
  )
}

export default Routes
