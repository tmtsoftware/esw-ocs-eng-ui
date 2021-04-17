import type { SequencerService } from '@tmtsoftware/esw-ts'
import { getMockServices } from '../utils/test-utils'
const mockServices = getMockServices()
export const useSequencerService = (): SequencerService =>
  mockServices.instance.sequencerService
export const mkSequencerService = (): SequencerService =>
  mockServices.instance.sequencerService
