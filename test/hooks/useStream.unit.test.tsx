import { renderHook } from '@testing-library/react'
import { expect } from 'chai'
import { useStream } from '../../src/hooks/useStream'

describe('Stream hook', () => {
  it('should run streaming call on render', async () => {
    const { result, waitFor } = renderHook(() =>
      useStream({
        mapper: (event: { a: number }) => {
          expect(event['a']).to.equal(1)
        },
        run: (cb) => {
          cb({ a: 1 })
          return {
            cancel: () => ({})
          }
        }
      })
    )

    await waitFor(() => {
      result.current !== null
    })
  })
})
