import {
  ComponentId,
  Prefix,
  SequencerService,
  TokenFactory,
  Location
} from '@tmtsoftware/esw-ts'
import { SequencerServiceImpl } from '@tmtsoftware/esw-ts/lib/dist/src/clients/sequencer/SequencerServiceImpl'
import { HttpTransport } from '@tmtsoftware/esw-ts/lib/dist/src/utils/HttpTransport'
import {
  extractHostPort,
  getPostEndPoint,
  getWebSocketEndPoint
} from '@tmtsoftware/esw-ts/lib/dist/src/utils/Utils'
import { Ws } from '@tmtsoftware/esw-ts/lib/dist/src/utils/Ws'
import { useGatewayLocation } from '../../../contexts/GatewayServiceContext'
import { useAuth } from '../../../contexts/useAuthContext'

export const useSequencerService = (
  sequencerPrefix: Prefix
): SequencerService => {
  const [gatewayLocation] = useGatewayLocation()
  const { auth } = useAuth()
  if (!gatewayLocation) throw new Error('Gateway down!')

  const tf = auth === null ? () => undefined : auth.token

  return mkSequencerService(gatewayLocation, sequencerPrefix, tf)
}

export const mkSequencerService = (
  gatewayLocation: Location,
  prefix: Prefix,
  tf: TokenFactory
): SequencerService => {
  const compId = new ComponentId(prefix, 'Sequencer')
  const { host, port } = extractHostPort(gatewayLocation.uri)
  const postEndpoint = getPostEndPoint({ host, port })
  const wsEndpoint = getWebSocketEndPoint({ host, port })

  return new SequencerServiceImpl(
    compId,
    new HttpTransport(postEndpoint, tf),
    () => new Ws(wsEndpoint)
  )
}
