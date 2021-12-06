import { ObsMode, ObsModeDetails, ObsModesDetailsResponseSuccess, VariationInfo } from '@tmtsoftware/esw-ts'
const obsModes: ObsModeDetails[] = [
  {
    obsMode: new ObsMode('DarkNight_1'),
    status: {
      _type: 'Configured'
    },
    resources: ['ESW', 'TCS'],
    sequencers: [VariationInfo.fromString('ESW'), VariationInfo.fromString('TCS')]
  },
  {
    obsMode: new ObsMode('DarkNight_2'),
    status: {
      _type: 'Configurable'
    },
    resources: ['ESW', 'IRIS'],
    sequencers: [VariationInfo.fromString('ESW')]
  },
  {
    obsMode: new ObsMode('DarkNight_3'),
    status: {
      _type: 'NonConfigurable',
      missingSequenceComponentsFor: []
    },
    resources: ['ESW', 'IRIS', 'WFOS'],
    sequencers: [VariationInfo.fromString('ESW'), VariationInfo.fromString('TCS')]
  },
  {
    obsMode: new ObsMode('DarkNight_8'),
    status: {
      _type: 'Configured'
    },
    resources: ['ESW', 'SOSS'],
    sequencers: [VariationInfo.fromString('ESW'), VariationInfo.fromString('SOSS')]
  },
  {
    obsMode: new ObsMode('DarkNight_6'),
    status: {
      _type: 'Configurable'
    },
    resources: ['ESW', 'IRIS'],
    sequencers: [VariationInfo.fromString('ESW')]
  },
  {
    obsMode: new ObsMode('DarkNight_5'),
    status: {
      _type: 'NonConfigurable',
      missingSequenceComponentsFor: [VariationInfo.fromString('TCS')]
    },
    resources: ['ESW', 'IRIS', 'WFOS'],
    sequencers: [VariationInfo.fromString('ESW'), VariationInfo.fromString('TCS')]
  }
]

export const nonConfigurableObsModesData: ObsModesDetailsResponseSuccess = {
  _type: 'Success',
  obsModes: obsModes.filter((obs) => obs.status._type === 'NonConfigurable')
}

export const configurableObsModesData: ObsModesDetailsResponseSuccess = {
  _type: 'Success',
  obsModes: obsModes.filter((obs) => obs.status._type === 'Configurable')
}

export const obsModesData: ObsModesDetailsResponseSuccess = {
  _type: 'Success',
  obsModes: obsModes
}
