type Query = {
  key: string
  refetchInterval?: number // Refetch the data every defined milliseconds
  retry?: number // only failing queries will retry given number of times
}
// Agent
export const LIST_AGENTS: Query = { key: 'listAgents' }

// SM

export const AGENTS_STATUS: Query = {
  key: 'agentsStatus',
  refetchInterval: 3000
}
export const OBS_MODES_DETAILS: Query = {
  key: 'obsModesDetails',
  refetchInterval: 3000
}

// Sequencers

export const GET_SEQUENCE: Query = {
  key: 'getSequence',
  refetchInterval: 1000
}

export const OBS_MODE_SEQUENCERS: Query = {
  key: 'getSequenceObsMode',
  refetchInterval: 1000
}

export const SEQUENCER_STATUS: Query = {
  key: 'sequencerStatus'
}

export const SEQUENCER_STATE = {
  key: `getSequencerState`,
  refetchInterval: 1000
}

export const SEQUENCER_LOCATION = { key: 'findSequencerLocation' }
