import React from 'react'
import { useHistory } from 'react-router'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import { ObservationTabs } from './ObservationTabs'

export const Observations = (): JSX.Element => {
  const history = useHistory()
  return (
    <>
      <PageHeader onBack={() => history.goBack()} title='Manage Observation' />
      <ObservationTabs />
    </>
  )
}
