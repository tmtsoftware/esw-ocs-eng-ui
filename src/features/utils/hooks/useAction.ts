import { message } from 'antd'
import { useMutation, UseMutationResult, useQueryClient } from 'react-query'

export const useAction = <S, T>(
  queryKey: string,
  mutationFn: (agent: S) => Promise<T>,
  successMsg: string,
  errorMsg: string,
  onSuccess?: (a: T) => void,
  useErrorBoundary = true
): UseMutationResult<T, unknown, S> => {
  const qc = useQueryClient()

  return useMutation(mutationFn, {
    onSuccess: async (data) => {
      await qc.invalidateQueries(queryKey)
      message.success(successMsg)
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
