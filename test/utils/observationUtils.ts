import { ObsMode, VariationInfo } from '@tmtsoftware/esw-ts'
import type { ObsModeDetails, ObsModesDetailsResponseSuccess, ObsModeStatus } from '@tmtsoftware/esw-ts'

export const getObsModes = (status: ObsModeStatus): ObsModesDetailsResponseSuccess => {
  const obsModes: ObsModeDetails[] = [
    {
      obsMode: new ObsMode('DarkNight_1'),
      status,
      resources: ['ESW', 'TCS'],
      sequencers: [VariationInfo.fromString('ESW'), VariationInfo.fromString('TCS')]
    }
  ]
  const obsModesData: ObsModesDetailsResponseSuccess = {
    _type: 'Success',
    obsModes: obsModes
  }
  return obsModesData
}
