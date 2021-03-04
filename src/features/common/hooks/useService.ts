import { useQuery, UseQueryResult } from 'react-query'

export const useService = <S, E>(
  serviceName: string,
  factory: () => Promise<S>,
  useErrorBoundary = true,
  onError?: (err: E) => void
): UseQueryResult<S> => {
  return useQuery(serviceName, () => factory(), {
    useErrorBoundary: useErrorBoundary,
    onError: onError,
    retry: 1
  })
}
