import { renderHook, waitFor } from '@testing-library/react'
import { HttpConnection, Prefix } from '@tmtsoftware/esw-ts'
import type { HttpLocation } from '@tmtsoftware/esw-ts'
import { verify, when } from '@johanblumenberg/ts-mockito'
import { expect } from 'chai'
import { useAgentsList } from '../../../../src/features/agent/hooks/useAgentsList'
import { getContextWithQueryClientProvider, mockServices, delay } from '../../../utils/test-utils'
import '@ant-design/v5-patch-for-react-19'

describe('useAgents', () => {
  it('should return list of agents up and running | ESW-441', async () => {
    const locServiceMock = mockServices.mock.locationService
    const agentPrefix = new Prefix('ESW', 'ESW.Machine1')
    const agentLocation: HttpLocation = {
      _type: 'HttpLocation',
      connection: HttpConnection(agentPrefix, 'Service'),
      uri: 'url',
      metadata: {}
    }
    when(locServiceMock.listByComponentType('Machine')).thenResolve([agentLocation])
    const ContextAndQueryClientProvider = getContextWithQueryClientProvider(true)

    const { result } = renderHook(() => useAgentsList(), {
      wrapper: ContextAndQueryClientProvider
    })
    // XXX Delay needed to allow background status to progress from pending
    await delay(500)
    await waitFor(() => {
      return result.current.isSuccess
    })

    verify(locServiceMock.listByComponentType('Machine')).called()

    const prefix = result.current.data ? result.current.data[0] : undefined
    expect(prefix).to.eq(agentPrefix)
  })
})
