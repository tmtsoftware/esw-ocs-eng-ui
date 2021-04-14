// Query keys

import type { Prefix } from '@tmtsoftware/esw-ts'

type Query = {
  key: string
  // refetchIntervalInBackground?: boolean // refetchInterval will continue to refetch while their tab/window is in the background if enabled
  refetchInterval?: number // Refetch the data every defined milliseconds
  retry?: number // only failing queries will retry given number of times
}
// Agent
export const LIST_AGENTS: Query = { key: 'ListAgents' }
export const AGENT_SERVICE: Query = {
  key: 'AgentService'
}

// Config
export const CONFIG_SERVICE: Query = {
  key: 'ConfigService'
}

// SM
export const PROVISION_STATUS: Query = { key: 'ProvisionStatus' }

export const SM_STATUS: Query = {
  key: 'SMStatus',
  refetchInterval: 3000
}
export const SM_SERVICE: Query = {
  key: 'SMService',
  refetchInterval: 3000
}

export const AGENTS_STATUS: Query = {
  key: 'AgentsStatus',
  refetchInterval: 3000
}
export const OBS_MODES_DETAILS: Query = {
  key: 'ObsModesDetails',
  refetchInterval: 3000
}

// Sequencers
export const SEQUENCER_SERVICE = (prefix: Prefix): Query => ({
  key: `${prefix.toJSON()}-SequencerService`
})

export const SEQUENCER_STEPS = (prefix: Prefix): Query => ({
  key: `${prefix.toJSON()}-steps`,
  refetchInterval: 1000
})

export const OBS_MODE_SEQUENCERS: Query = {
  key: 'ObsModeSequencers',
  refetchInterval: 1000
}

export const SEQUENCER_STATUS: Query = {
  key: 'SequencerStatus'
}

export const SEQUENCER_STATE: Query = {
  key: 'SequencerState'
}

export const OBS_MODE_STATE: Query = {
  key: 'ObsModeState',
  refetchInterval: 1000
}
