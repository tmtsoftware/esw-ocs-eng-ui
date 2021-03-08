import type { SequenceManagerService } from '@tmtsoftware/esw-ts'
import type { UseMutationResult } from 'react-query'
import { useAction } from '../../common/hooks/useAction'
import { AGENTS_STATUS_KEY, PROVISION_STATUS_KEY } from '../../queryKeys'

export const useProvisionAction = <T>(
  mutationFn: (agent: SequenceManagerService) => Promise<T>,
  successMsg: string,
  errorMsg: string,
  useErrorBoundary = true
): UseMutationResult<T, unknown, SequenceManagerService> =>
  useAction({
    invalidateKeysOnSuccess: [PROVISION_STATUS_KEY, AGENTS_STATUS_KEY],
    mutationFn,
    successMsg,
    errorMsg,
    useErrorBoundary
  })
