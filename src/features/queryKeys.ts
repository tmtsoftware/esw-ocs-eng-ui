// Query keys

type Query = {
  key: string
  refetchIntervalInBackground?: boolean // refetchInterval will continue to refetch while their tab/window is in the background if enabled
  refetchInterval?: number // Refetch the data every defined milliseconds
  retry?: number // only failing queries will retry given number of times
}
// Agent
export const LIST_AGENTS: Query = { key: 'ListAgents' }
export const AGENT_SERVICE: Query = {
  key: 'AgentService',
  retry: 1
}

// Config
export const CONFIG_SERVICE: Query = {
  key: 'ConfigService',
  retry: 1
}

// SM
export const PROVISION_STATUS: Query = { key: 'ProvisionStatus' }

export const SM_STATUS: Query = {
  key: 'SMStatus',
  refetchIntervalInBackground: true,
  refetchInterval: 3000
}
export const SM_SERVICE: Query = {
  key: 'SMService',
  refetchIntervalInBackground: true,
  refetchInterval: 3000
}

export const AGENTS_STATUS: Query = {
  key: 'AgentsStatus',
  refetchIntervalInBackground: true,
  refetchInterval: 3000
}
export const OBS_MODES_DETAILS: Query = {
  key: 'ObsModesDetails',
  refetchIntervalInBackground: true,
  refetchInterval: 3000
}

// Sequencers
export const SEQUENCER_SERVICE: Query = {
  key: 'SequencerService',
  retry: 1
}
export const OBS_MODE_SEQUENCERS: Query = {
  key: 'ObsModeSequencers',
  refetchIntervalInBackground: true,
  refetchInterval: 3000
}
