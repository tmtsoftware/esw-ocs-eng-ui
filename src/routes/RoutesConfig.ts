const sequencer = '/sequencer'
export const HOME = '/'
export const INFRASTRUCTURE = '/infrastructure'
export const OBSERVATIONS = '/observations'
export const RESOURCES = '/resources'
export const NO_MATCH = '/*'
export const SEQUENCER_PATH = `${sequencer}`

export const getSequencerPath = (prefix: string): string => {
  return `${sequencer}?prefix=${prefix}`
}
