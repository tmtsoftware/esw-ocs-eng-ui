import React from 'react'
import { ObservationTabs } from './ObservationTabs'
import { PageHeader } from '../../components/pageHeader/PageHeader'

export const Observations = (): React.JSX.Element => (
  <>
    <PageHeader title='Manage Observation' />
    <ObservationTabs />
  </>
)
