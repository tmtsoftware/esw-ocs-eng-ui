import { screen, waitFor } from '@testing-library/react'
//import { expect } from 'chai'
import React from 'react'
import { createCtx } from '../../../src/contexts/utils/createCtx'
import { renderWithAuth } from '../../utils/test-utils'
const dummyValue = '1234'
const [useContext, ContextProvider] = createCtx(() => dummyValue)
const Component = () => {
  const str = useContext()
  return <span>{str ? str : 'Unknown'}</span>
}

describe('Create context hook', () => {
  it('returns context with provided state | ESW-491', async () => {
    renderWithAuth({
      ui: (
        <ContextProvider>
          <Component />
        </ContextProvider>
      )
    })

    await waitFor(() => {
      expect(screen.getByText('1234')).to.exist
    })
  })
})
