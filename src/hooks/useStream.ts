import type { Subscription } from '@tmtsoftware/esw-ts'
import { useEffect, useState } from 'react'

export type Mapper<I, O> = (event: I) => O
export type Run<I> = (cb: Mapper<I, void>) => Subscription

export type UseStreamProps<I, O> = {
  mapper: Mapper<I, O>
  run: Run<I>
  defaultLoading?: boolean
}

// caller should make sure mapper and run functions are wrapped in callback or memo to avoid unnecessary renders
export const useStream = <I, O>({
  mapper,
  run,
  defaultLoading = true
}: UseStreamProps<I, O>): [O | undefined, boolean] => {
  const [value, setValue] = useState<O | undefined>(undefined)
  const [loading, setLoading] = useState(defaultLoading)

  useEffect(() => setLoading(defaultLoading), [defaultLoading])

  useEffect(() => {
    const mappedCallback = (v: I) => {
      const mappedValue = mapper(v)
      setValue(mappedValue)
      loading && setLoading(false)
    }
    console.log('calling', loading)
    const sub = run(mappedCallback)
    return sub.cancel
  }, [loading, mapper, run])

  return [value, loading]
}
