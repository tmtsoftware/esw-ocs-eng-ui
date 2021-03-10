export const AppConfig = {
  realm: 'TMT', // Realm of your client
  clientId: 'tmt-frontend-app', // Client id which is registered in AAS server
  applicationName: 'esw-ocs-eng-ui' //Application name is used for capturing metrics of this web application
}

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
