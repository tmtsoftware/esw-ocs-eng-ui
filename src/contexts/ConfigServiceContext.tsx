import type {
  ConfigService,
  Location,
  TokenFactory,
  TrackingEvent
} from '@tmtsoftware/esw-ts'
import { ConfigServiceImpl } from '@tmtsoftware/esw-ts/lib/dist/src/clients/config-service/ConfigServiceImpl'
import { extractHostPort } from '@tmtsoftware/esw-ts/lib/dist/src/utils/Utils'
import { CONFIG_SERVICE_CONNECTION } from '../features/sm/constants'
import { useStream } from '../hooks/useStream'
import { createCtx } from './createCtx'
import { locationService } from './ServiceFactoryContext'
import { useAuth } from './useAuthContext'

const mkConfigService = (
  tokenFactory: TokenFactory,
  location: Location
): ConfigService => {
  const { host, port } = extractHostPort(location.uri)

  return new ConfigServiceImpl(host, port, tokenFactory)
}

const trackConfigCallback = (tokenFactory: TokenFactory) => (
  event: TrackingEvent
) =>
  event._type === 'LocationUpdated'
    ? mkConfigService(tokenFactory, event.location)
    : undefined

const trackConfigService = locationService.track(CONFIG_SERVICE_CONNECTION)

const _useConfigService = (): [ConfigService | undefined, boolean] => {
  const { auth } = useAuth()
  const tokenFactory = auth !== null ? auth.token : () => undefined
  return useStream({
    mapper: trackConfigCallback(tokenFactory),
    run: trackConfigService
  })
}

export const [useConfigService, ConfigServiceProvider] = createCtx(
  _useConfigService
)
