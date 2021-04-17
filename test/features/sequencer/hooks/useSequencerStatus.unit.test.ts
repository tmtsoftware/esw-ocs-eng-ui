import { renderHook } from '@testing-library/react-hooks/dom'
import { Prefix } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import { verify, when } from 'ts-mockito'
import { useSequencerStatus } from '../../../../src/features/sequencer/hooks/useSequencerStatus'
import {
  getContextWithQueryClientProvider,
  getMockServices,
  sequencerServiceMock
} from '../../../utils/test-utils'

describe('useSequencer', () => {
  it('should return status of sequencer | ESW-455', async () => {
    const mockServices = getMockServices()

    when(sequencerServiceMock.isOnline()).thenResolve(true)
    const ContextAndQueryClientProvider = getContextWithQueryClientProvider(
      true,
      mockServices
    )

    const { result, waitFor } = renderHook(
      () => useSequencerStatus(Prefix.fromString('ESW.irisDarkNight')),
      {
        wrapper: ContextAndQueryClientProvider
      }
    )

    await waitFor(() => {
      return result.current.isSuccess
    })

    verify(sequencerServiceMock.isOnline()).called()

    expect(result.current.data).to.true
  })
})
