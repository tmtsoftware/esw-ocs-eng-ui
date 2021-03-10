import { ObsMode, ObsModesDetailsResponseSuccess } from '@tmtsoftware/esw-ts'
export default <ObsModesDetailsResponseSuccess>(<unknown>{
  _type: 'Success',
  obsModes: [
    {
      obsMode: new ObsMode('DarkNight_1'),
      status: {
        _type: 'Configured'
      },
      resources: ['ESW', 'TCS'],
      sequencers: ['ESW', 'TCS']
    },
    {
      obsMode: new ObsMode('DarkNight_2'),
      status: {
        _type: 'Configurable'
      },
      resources: ['ESW', 'IRIS'],
      sequencers: ['ESW']
    },
    {
      obsMode: new ObsMode('DarkNight_3'),
      status: {
        _type: 'NonConfigurable'
      },
      resources: ['ESW', 'IRIS', 'WFOS'],
      sequencers: ['ESW', 'TCS']
    },
    {
      obsMode: new ObsMode('DarkNight_8'),
      status: {
        _type: 'Configured'
      },
      resources: ['ESW', 'TCS'],
      sequencers: ['ESW', 'TCS']
    },
    {
      obsMode: new ObsMode('DarkNight_6'),
      status: {
        _type: 'Configurable'
      },
      resources: ['ESW', 'IRIS'],
      sequencers: ['ESW']
    },
    {
      obsMode: new ObsMode('DarkNight_5'),
      status: {
        _type: 'NonConfigurable'
      },
      resources: ['ESW', 'IRIS', 'WFOS'],
      sequencers: ['ESW', 'TCS']
    }
  ]
})
