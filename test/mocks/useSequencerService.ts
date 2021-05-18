import { sequencerServiceInstance } from '../utils/test-utils'
import type { SequencerService } from '@tmtsoftware/esw-ts'

export const useSequencerService = (): SequencerService =>
  sequencerServiceInstance

export const mkSequencerService = (): SequencerService =>
  sequencerServiceInstance
