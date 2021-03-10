import type { ObsModeDetails } from '@tmtsoftware/esw-ts'
import React from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import ObservationTabs from './ObservationTabs'
export type ObsModesDataType = {
  keyName: string
  data?: ObsModeDetails[]
}

const Observations = (): JSX.Element => {
  return (
    <>
      <PageHeader
        onBack={() => window.history.back()}
        title='Manage Observation'
      />
      <ObservationTabs />
    </>
  )
}

export default Observations
