import { message } from 'antd'
import {
  QueryKey,
  useMutation,
  UseMutationResult,
  useQueryClient
} from 'react-query'

interface useActionProps<S, T> {
  invalidateKeysOnSuccess?: QueryKey[]
  mutationFn: (agent: S) => Promise<T>
  successMsg?: string
  errorMsg?: string
  useErrorBoundary?: boolean
  onSuccess?: (a: T) => void
}

export const useAction = <S, T>({
  invalidateKeysOnSuccess,
  mutationFn,
  successMsg,
  errorMsg,
  useErrorBoundary = true,
  onSuccess
}: useActionProps<S, T>): UseMutationResult<T, unknown, S> => {
  const qc = useQueryClient()

  return useMutation(mutationFn, {
    onSuccess: async (data) => {
      invalidateKeysOnSuccess &&
        (await Promise.all(
          invalidateKeysOnSuccess.map((key) => qc.invalidateQueries(key))
        ))
      if (successMsg) message.success(successMsg)
      onSuccess?.(data)
    },
    onError: (e) =>
      Promise.resolve(
        message.error(
          `${errorMsg}, reason: ${((e as unknown) as Error).message}`
        )
      ),
    useErrorBoundary
  })
}
