import { ObsMode, ObsModeDetails, ObsModesDetailsResponseSuccess } from '@tmtsoftware/esw-ts'
import React from 'react'
import { when } from 'ts-mockito'
import { CurrentObsMode } from '../../../src/containers/observation/CurrentObsMode'
import { mockServices, renderWithAuth, sequencerServiceMock } from '../../utils/test-utils'

describe('CurrentObsMode', () => {
  it(`should call cancel subscription method on unmount | ESW-489`, async (done) => {
    const smService = mockServices.mock.smService

    const obsModes: ObsModeDetails[] = [
      {
        obsMode: new ObsMode('DarkNight_1'),
        status: {
          _type: 'Configured'
        },
        resources: ['ESW'],
        sequencers: ['ESW']
      }
    ]
    const obsModesData: ObsModesDetailsResponseSuccess = {
      _type: 'Success',
      obsModes: obsModes
    }
    when(smService.getObsModesDetails()).thenResolve(obsModesData)

    when(sequencerServiceMock.subscribeSequencerState()).thenReturn(() => {
      return { cancel: done }
    })

    const { unmount } = renderWithAuth({
      ui: (
        <CurrentObsMode
          resources={[]}
          sequencers={obsModes.find((x) => x.obsMode.name === 'DarkNight_1')?.sequencers ?? []}
          currentTab='Running'
          obsMode={new ObsMode('DarkNight_1')}
        />
      )
    })

    // await screen.findByRole('menuitem', { name: 'DarkNight_1' })
    unmount()
  })
})
