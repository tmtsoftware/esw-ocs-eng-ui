import { screen, within } from '@testing-library/react'
import { ObsMode, ObsModeDetails, ObsModesDetailsResponseSuccess, ServiceError, StepList } from '@tmtsoftware/esw-ts'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { reset, when } from 'ts-mockito'
import { CurrentObsMode } from '../../../src/containers/observation/CurrentObsMode'
import { sequencerActionConstants } from '../../../src/features/sm/smConstants'
import { mockServices, renderWithAuth, sequencerServiceMock } from '../../utils/test-utils'

describe('CurrentObsMode', () => {
  beforeEach(() => {
    reset(mockServices.mock.smService)
    reset(sequencerServiceMock)
  })
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

    unmount()
  })
  it(`should render error notification when error is received | ESW-510`, async () => {
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
    const smService = mockServices.mock.smService
    when(smService.getObsModesDetails()).thenResolve(obsModesData)

    when(sequencerServiceMock.subscribeSequencerState()).thenReturn((_, onError) => {
      onError &&
        onError(
          ServiceError.make(500, 'server error', {
            message: 'Sequencer not found'
          })
        )
      return {
        cancel: () => undefined
      }
    })

    renderWithAuth({
      ui: (
        <CurrentObsMode
          resources={[]}
          sequencers={obsModes.find((x) => x.obsMode.name === 'DarkNight_1')?.sequencers ?? []}
          currentTab='Running'
          obsMode={new ObsMode('DarkNight_1')}
        />
      )
    })

    await screen.findByText('Sequencer not found')
  })

  it(`should render reload script button if sequencer available | ESW-506`, async () => {
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
    const smService = mockServices.mock.smService
    when(smService.getObsModesDetails()).thenResolve(obsModesData)
    when(sequencerServiceMock.subscribeSequencerState()).thenReturn((onEvent) => {
      onEvent({
        _type: 'SequencerStateResponse',
        sequencerState: { _type: 'Loaded' },
        stepList: new StepList([])
      })
      return {
        cancel: () => undefined
      }
    })

    renderWithAuth({
      ui: (
        <BrowserRouter>
          <CurrentObsMode
            resources={[]}
            sequencers={obsModes.find((x) => x.obsMode.name === 'DarkNight_1')?.sequencers ?? []}
            currentTab='Running'
            obsMode={new ObsMode('DarkNight_1')}
          />
        </BrowserRouter>
      )
    })

    const sequencer1 = await screen.findByRole('row', { name: /ESW.DarkNight_1/ })
    await within(sequencer1).findByText(sequencerActionConstants.reloadScript)
  })
})
