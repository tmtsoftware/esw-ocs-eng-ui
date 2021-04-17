import type { SequencerService } from '@tmtsoftware/esw-ts'
import { mockServices } from '../utils/test-utils'
export const useSequencerService = (): SequencerService =>
  mockServices.instance.sequencerService
export const mkSequencerService = (): SequencerService =>
  mockServices.instance.sequencerService
