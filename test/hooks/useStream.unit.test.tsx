import { renderHook, waitFor } from '@testing-library/react'
import { expect } from 'chai'
import { useStream } from '../../src/hooks/useStream'
import '@ant-design/v5-patch-for-react-19'

describe('Stream hook', () => {
  it('should run streaming call on render', async () => {
    const { result } = renderHook(() =>
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
