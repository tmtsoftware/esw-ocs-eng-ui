export const groupBy = <T, K>(
  list: T[],
  keyGetter: (item: T) => K
): Map<K, T[]> => {
  const map = new Map<K, T[]>()
  list.forEach((item) => {
    const key = keyGetter(item)
    const collection = map.get(key)
    if (!collection) {
      map.set(key, [item])
    } else {
      collection.push(item)
    }
  })
  return map
}
