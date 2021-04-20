import type { SequencerService } from '@tmtsoftware/esw-ts'
import { sequencerServiceInstance } from '../utils/test-utils'

export const useSequencerService = (): SequencerService =>
  sequencerServiceInstance

export const mkSequencerService = (): SequencerService =>
  sequencerServiceInstance
