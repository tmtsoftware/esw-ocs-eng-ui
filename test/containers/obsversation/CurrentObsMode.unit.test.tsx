import { screen, waitFor, within } from '@testing-library/react'
import {
  AkkaConnection,
  AkkaLocation,
  ObsMode,
  ObsModeDetails,
  ObsModesDetailsResponseSuccess,
  Prefix,
  ServiceError,
  StepList,
  TrackingEvent
} from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { deepEqual, reset, verify, when } from 'ts-mockito'
import { CurrentObsMode } from '../../../src/containers/observation/CurrentObsMode'
import { sequencerActionConstants } from '../../../src/features/sm/smConstants'
import { mockServices, renderWithAuth, sequencerServiceMock } from '../../utils/test-utils'

describe('CurrentObsMode', () => {
  beforeEach(() => {
    reset(mockServices.mock.smService)
    reset(sequencerServiceMock)
  })

  const eswSequencerPrefix = new Prefix('ESW', 'DarkNight_1')
  const eswSequencerConnection = AkkaConnection(eswSequencerPrefix, 'Sequencer')
  const eswSequencerLocation: AkkaLocation = {
    _type: 'AkkaLocation',
    connection: eswSequencerConnection,
    uri: 'http://localhost:5000/',
    metadata: {}
  }

  it(`should call cancel subscription method on unmount | ESW-489`, async (done) => {
    const { smService, locationService } = mockServices.mock
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

    when(locationService.track(deepEqual(eswSequencerConnection))).thenReturn((cb) => {
      cb({ _type: 'LocationUpdated', location: eswSequencerLocation })
      return {
        cancel: () => ({})
      }
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

    verify(locationService.track(deepEqual(eswSequencerConnection))).once()

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
    const { smService, locationService } = mockServices.mock
    when(smService.getObsModesDetails()).thenResolve(obsModesData)

    when(locationService.track(deepEqual(eswSequencerConnection))).thenReturn((cb) => {
      cb({ _type: 'LocationUpdated', location: eswSequencerLocation })
      return {
        cancel: () => ({})
      }
    })

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
    const { smService, locationService } = mockServices.mock
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

    when(locationService.track(deepEqual(eswSequencerConnection))).thenReturn((cb) => {
      cb({ _type: 'LocationUpdated', location: eswSequencerLocation })
      return {
        cancel: () => ({})
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

  it('should update sequencer table if sequencer is stopped in background', async () => {
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
    const { smService, locationService } = mockServices.mock
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

    when(locationService.track(deepEqual(eswSequencerConnection))).thenReturn((cb) => {
      sendEvent(cb, { _type: 'LocationUpdated', location: eswSequencerLocation })
      sendEvent(cb, { _type: 'LocationRemoved', connection: eswSequencerConnection }, 400)
      return {
        cancel: () => ({})
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

    const sequencerRow = /setting esw\.darknight_1 close/i

    await waitFor(() => expect(screen.queryByRole('cell', { name: sequencerRow })).to.not.exist)

    await screen.findByRole('cell', { name: sequencerRow })
  })
})

const sendEvent = (
  callback: (trackingEvent: TrackingEvent) => void,
  state: TrackingEvent,
  timeout?: number | undefined
) => {
  timeout ? setTimeout(() => callback(state), timeout) : callback(state)
}
