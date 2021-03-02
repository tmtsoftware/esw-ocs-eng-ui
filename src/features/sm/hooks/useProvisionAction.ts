import type { SequenceManagerService } from '@tmtsoftware/esw-ts'
import type { UseMutationResult } from 'react-query'
import { useAction } from '../../common/hooks/useAction'

export const ProvisionActionQueryKey = 'ProvisionAction'

export const useProvisionAction = <T>(
  mutationFn: (agent: SequenceManagerService) => Promise<T>,
  successMsg: string,
  errorMsg: string,
  useErrorBoundary = true
): UseMutationResult<T, unknown, SequenceManagerService> =>
  useAction({
    queryKey: ProvisionActionQueryKey,
    mutationFn,
    successMsg,
    errorMsg,
    useErrorBoundary
  })
