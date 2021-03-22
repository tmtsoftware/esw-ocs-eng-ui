import { expect } from 'chai'
import { groupBy } from '../../src/utils/groupBy'

type randomType = {
  name: 'A' | 'B' | 'C'
}

describe('Group by utility', () => {
  it('returns empty map', () => {
    const arr: randomType[] = []
    const groupedData = groupBy(arr, (x) => x.name)
    expect(groupedData).empty
  })

  it('returns grouped data by given getter function', () => {
    const arr: randomType[] = [
      { name: 'A' },
      { name: 'A' },
      { name: 'B' },
      { name: 'B' },
      { name: 'C' },
      { name: 'B' }
    ]
    const groupedData = groupBy(arr, (x) => x.name)

    expect(groupedData.get('A')).length(2)
    expect(groupedData.get('B')).length(3)
    expect(groupedData.get('C')).length(1)
  })
})
