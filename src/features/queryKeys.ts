type Query = {
  key: string
  // refetchIntervalInBackground?: boolean // refetchInterval will continue to refetch while their tab/window is in the background if enabled
  refetchInterval?: number // Refetch the data every defined milliseconds
  retry?: number // only failing queries will retry given number of times
}
// Agent
export const LIST_AGENTS: Query = { key: 'ListAgents' }

// SM
export const PROVISION_STATUS: Query = { key: 'ProvisionStatus' }

export const AGENTS_STATUS: Query = {
  key: 'AgentsStatus',
  refetchInterval: 3000
}
export const OBS_MODES_DETAILS: Query = {
  key: 'ObsModesDetails',
  refetchInterval: 3000
}

// Sequencers

export const GET_SEQUENCE: Query = {
  key: 'GetSequence',
  refetchInterval: 1000
}

export const OBS_MODE_SEQUENCERS: Query = {
  key: 'GetSequenceObsMode',
  refetchInterval: 1000
}

export const SEQUENCER_STATUS: Query = {
  key: 'SequencerStatus'
}

export const SEQUENCER_STATE = {
  key: `GetSequencerState`,
  refetchInterval: 1000
}
