import { AuthContext, TokenFactory } from '@tmtsoftware/esw-ts'
import { useContext } from 'react'
import { useQuery, UseQueryResult } from 'react-query'

export const useService = <S, E>(
  serviceName: string,
  factory: (tokenFactory: TokenFactory) => Promise<S>,
  useErrorBoundary = true,
  onError?: (err: E) => void
): UseQueryResult<S> => {
  const { auth } = useContext(AuthContext)
  // if (!auth) throw Error('Login to continue ...')

  return useQuery(serviceName, () => factory(() => undefined), {
    useErrorBoundary: useErrorBoundary,
    onError: onError
  })
}
