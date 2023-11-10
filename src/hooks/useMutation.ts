import {useMutation as useReactMutation, useQueryClient} from '@tanstack/react-query'
import type {QueryKey, UseMutationResult} from '@tanstack/react-query'

type UseMutationProps<S, T> = {
  mutationFn: (service: S) => Promise<T>
  onSuccess: (a: T) => void
  onError: (e: unknown) => void
  invalidateKeysOnSuccess?: (QueryKey[] | QueryKey)[]
  throwOnError?: boolean
}

export const useMutation = <S, T>({
                                    mutationFn,
                                    onSuccess,
                                    onError,
                                    invalidateKeysOnSuccess,
                                    throwOnError = false
                                  }: UseMutationProps<S, T>): UseMutationResult<T, unknown, S> => {
  const qc = useQueryClient()

  return useReactMutation({
    mutationFn: mutationFn,
    onSuccess: async (data) => {
      invalidateKeysOnSuccess && (await Promise.all(invalidateKeysOnSuccess.map((key) => qc.invalidateQueries({queryKey: key}))))
      onSuccess(data)
    },
    onError: (e) => onError(e),
    throwOnError: throwOnError
  })
}

export type {UseMutationResult}
