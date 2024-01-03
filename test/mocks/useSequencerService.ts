import type { Prefix, SequencerService } from '@tmtsoftware/esw-ts'
import {
  sequencerServiceInstance,
  sequencerServiceInstanceIris,
  sequencerServiceInstanceTcs
} from '../utils/test-utils'

export const useSequencerService = (prefix: Prefix): SequencerService => {
  console.log("XXX called mock useSequencerService")
  switch (prefix.subsystem) {
    case 'IRIS':
      return sequencerServiceInstanceIris

    case 'TCS':
      return sequencerServiceInstanceTcs

    default:
      return sequencerServiceInstance
  }
}

export const mkSequencerService = (): SequencerService => sequencerServiceInstance
