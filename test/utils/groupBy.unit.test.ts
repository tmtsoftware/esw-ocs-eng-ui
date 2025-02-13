import { expect } from 'chai'
import { groupBy } from '../../src/utils/groupBy'
import '@ant-design/v5-patch-for-react-19'

type randomType = {
  name: 'A' | 'B' | 'C'
  value: number
}

describe('Group by utility', () => {
  it('returns empty map', () => {
    const arr: randomType[] = []
    const groupedData = groupBy(arr, (x) => x.name)
    expect(groupedData).empty
  })

  it('returns grouped data by given getter function', () => {
    const arr: randomType[] = [
      { name: 'A', value: 1 },
      { name: 'A', value: 2 },
      { name: 'B', value: 3 },
      { name: 'B', value: 4 },
      { name: 'C', value: 5 },
      { name: 'B', value: 6 }
    ]
    const groupedData = groupBy(arr, (x) => x.name)

    expect(groupedData.size).eq(3)
    expect(groupedData.get('A')).eqls([
      { name: 'A', value: 1 },
      { name: 'A', value: 2 }
    ])
    expect(groupedData.get('B')).eqls([
      { name: 'B', value: 3 },
      { name: 'B', value: 4 },
      { name: 'B', value: 6 }
    ])
    expect(groupedData.get('C')).eqls([{ name: 'C', value: 5 }])
  })
})
