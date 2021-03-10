import { useKeycloak } from '@react-keycloak/web'
import React, { useEffect } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import Home from '../containers/home/Home'
import Infrastructure from '../containers/infrastructure/Infrastructure'
import Observations from '../containers/observation/Observations'
import NoMatch from './NoMatch'
import { HOME, INFRASTRUCTURE, NO_MATCH, OBSERVATIONS } from './RoutesConfig'

const Routes = (): JSX.Element => {
  const { keycloak } = useKeycloak()
  const history = useHistory()

  useEffect(() => {
    !keycloak.authenticated && keycloak.login().then(() => history.push(HOME))
  }, [keycloak, history])

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
