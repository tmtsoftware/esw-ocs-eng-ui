import React from 'react'
import { ObservationTabs } from './ObservationTabs'
import { PageHeader } from '../../components/pageHeader/PageHeader'

export const Observations = (): JSX.Element => (
  <>
    <PageHeader title='Manage Observation' />
    <ObservationTabs />
  </>
)
