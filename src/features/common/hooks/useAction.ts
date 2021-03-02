import { message } from 'antd'
import { useMutation, UseMutationResult, useQueryClient } from 'react-query'

interface useActionProps<S, T> {
  queryKey: string
  mutationFn: (agent: S) => Promise<T>
  successMsg?: string
  errorMsg?: string
  useErrorBoundary?: boolean
  onSuccess?: (a: T) => void
}

export const useAction = <S, T>({
  queryKey,
  mutationFn,
  successMsg,
  errorMsg,
  useErrorBoundary = true,
  onSuccess
}: useActionProps<S, T>): UseMutationResult<T, unknown, S> => {
  const qc = useQueryClient()

  return useMutation(mutationFn, {
    onSuccess: async (data) => {
      await qc.invalidateQueries(queryKey)
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
