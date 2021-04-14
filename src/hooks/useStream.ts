import type { Subscription } from '@tmtsoftware/esw-ts'
import { useCallback, useEffect, useRef, useState } from 'react'

export type Mapper<I, O> = (event: I) => O
export type Run<I> = (cb: Mapper<I, void>) => Subscription

export type StreamProps<I, O> = {
  mapper: Mapper<I, O>
  run: Run<I>
}

export const useStream = <I, O>({
  mapper,
  run
}: StreamProps<I, O>): [O | undefined, boolean] => {
  const [value, setValue] = useState<O | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const mappedCallback = (v: I) => {
      const mappedValue = mapper(v)
      setValue(mappedValue)
    }

    const sub = run(mappedCallback)
    setLoading(false)

    return sub.cancel
  }, [mapper, run])

  return [value, loading]
}
