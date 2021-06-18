import type { ObsMode, Subsystem } from '@tmtsoftware/esw-ts'
import React from 'react'
import type { ResourceTableStatus } from '../../features/sequencer/components/ResourcesTable'
import { ConfiguredObsMode } from './ConfiguredObsMode'
import { NonConfiguredObsMode } from './NonConfiguredObsMode'
import type { TabName } from './ObservationTabs'
import { ConfigurableActions } from './ObsModeActions'

type SelectedObsModeProps = {
  currentTab: TabName
  obsMode: ObsMode
  sequencers: Subsystem[]
  resources: ResourceTableStatus[]
}

export const SelectedObsMode = ({ currentTab, obsMode, sequencers, resources }: SelectedObsModeProps): JSX.Element => {
  switch (currentTab) {
    case 'Running':
      return <ConfiguredObsMode obsMode={obsMode} sequencers={sequencers} resources={resources} />

    case 'Configurable':
      return (
        <NonConfiguredObsMode
          obsMode={obsMode}
          resources={resources}
          actions={<ConfigurableActions obsMode={obsMode} />}
        />
      )

    case 'Non-configurable':
      return <NonConfiguredObsMode obsMode={obsMode} resources={resources} />
  }
}
