import type { Prefix, SequencerStateResponse } from '@tmtsoftware/esw-ts'

export type SequencerProps = {
  prefix: Prefix
  sequencerState?: SequencerStateResponse['_type']
}
